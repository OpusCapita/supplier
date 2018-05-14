const Promise = require('bluebird');
const stringHelper = require('../utils/string');
const SqlString = require('sequelize/lib/sql-string');

module.exports.init = function(db, config)
{
  db.models.Supplier.hasMany(db.models.SupplierContact, { foreignKey: 'supplierId', sourceKey: 'id' });
  db.models.Supplier.hasMany(db.models.SupplierAddress, { foreignKey: 'supplierId', sourceKey: 'id' });
  db.models.Supplier.hasMany(db.models.SupplierBankAccount, { foreignKey: 'supplierId', sourceKey: 'id' });
  db.models.Supplier.hasMany(db.models.Capability, { foreignKey: 'supplierId', sourceKey: 'id' });

  this.db = db;
  return Promise.resolve(this);
};

module.exports.all = function(query, includes)
{
  let queryObj = {};
  if (query.id) queryObj.id = { $in: query.id.split(',') };
  if (query.name) queryObj.name = { $like: `%${query.name}%` };
  if (query.hierarchyId) queryObj.hierarchyId = { $like: `%${query.hierarchyId}%` };
  if (query.vatIdentificationNo) queryObj.vatIdentificationNo = query.vatIdentificationNo;
  if (query.globalLocationNo) queryObj.globalLocationNo = query.globalLocationNo;
  if (query.ovtNo) queryObj.ovtNo = query.ovtNo;

  const includeModels = associationsFromIncludes(this.db.models, includes || []);

  return this.db.models.Supplier.findAll({ where: queryObj, include: includeModels }).map(supplier => {
    return supplierWithAssociations(supplier);
  });
};

module.exports.find = function(supplierId, includes)
{
  const includeModels = associationsFromIncludes(this.db.models, includes || []);

  return this.db.models.Supplier.findOne({where: { id: supplierId }, include: includeModels}).then(supplier => {
    return supplierWithAssociations(supplier);
  });
};

module.exports.create = async function(supplier)
{
  if (!supplier.name) supplier.name = supplier.supplierName;
  normalize(supplier);

  if (supplier.parentId) {
    const parent = await this.db.models.Supplier.findOne({where: { id: supplier.parentId }});
    supplier.hierarchyId = determineHierarchyIdFromParent(supplier.parentId, parent.hierarchyId);
  }

  const self = this;
  let supplierId = supplier.name.replace(/[^0-9a-z_\-]/gi, '').slice(0, 27);

  function generateSupplierId(id) {
    return self.exists(id).then(exists => {
      if (exists) {
        return generateSupplierId(supplierId + randomNumber());
      } else {
        return id;
      }
    });
  }

  return generateSupplierId(supplierId).then(id => {
    supplier.id = id;
    supplier.role = 'selling';
    return this.db.models.Supplier.create(supplier);
  });
};

module.exports.update = async function(supplierId, supplier)
{
  [ 'id', 'createdBy', 'createdOn', 'updatedOn' ].forEach(key => delete supplier[key]);

  if (supplier.supplierName && !supplier.name) supplier.name = supplier.supplierName;
  normalize(supplier);

  if (supplier.parentId) {
    const parent = await this.db.models.Supplier.findOne({where: { id: supplier.parentId }});
    supplier.hierarchyId = determineHierarchyIdFromParent(supplier.parentId, parent.hierarchyId);
  } else {
    supplier.hierarchyId = null;
  }

  let children = await this.all({ hierarchyId: supplierId });

  let self = this;
  return this.db.models.Supplier.update(supplier, { where: { id: supplierId } }).then(() => {
    return Promise.all(children.map(child => {
      const hierarchyId = determineHierarchyIdForChild(supplierId, supplier.hierarchyId, child.hierarchyId);
      return this.db.models.Supplier.update({ hierarchyId: hierarchyId }, { where: { id : child.id } });
    })).then(() => {
      return self.find(supplierId, []);
    });
  });
};

module.exports.delete = function(supplierId)
{
  return this.db.models.Supplier.destroy({ where: { id: supplierId } }).then(() => null);
};

module.exports.exists = function(supplierId)
{
  return this.db.models.Supplier.findById(supplierId).then(supplier => Boolean(supplier));
};

module.exports.searchAll = function(searchValue, capabilities)
{
  const model = this.db.models.Supplier;
  const search = searchValue.replace(/\W+/g, '* ') + '*';
  const searchFields = [
    'Name',
    'CityOfRegistration',
    'TaxIdentificationNo',
    'VatIdentificationNo',
    'CommercialRegisterNo',
    'DUNSNo',
    'GlobalLocationNo'
  ].join(',');

  const select = `SELECT ${attributes(model)}, Capability.capabilityId FROM Supplier `;
  const leftJoin = 'LEFT JOIN Capability ON Supplier.ID = Capability.supplierId ';
  const matchQuery = `WHERE MATCH (${searchFields}) AGAINST ('${search}' IN BOOLEAN MODE)`;
  let query = select + leftJoin + (searchValue ? matchQuery : '');

  if (capabilities.length < 1) return this.db.query(query, { model: model }).then(suppliers => aggregateSeach(suppliers));

  const innerJoin = 'INNER JOIN Capability ON Supplier.ID = Capability.supplierId ';
  const capabilityQuery = capabilities.map(capability => `Capability.capabilityId = ${SqlString.escape(capability)}`).join(' OR ');

  query = select + innerJoin + (searchValue ? `${matchQuery} AND ${capabilityQuery}` : `WHERE ${capabilityQuery}`);
  return this.db.query(query, { model: model }).then(suppliers => aggregateSeach(suppliers));
};

module.exports.searchRecord = function(query)
{
  normalize(query);

  let rawQueryArray = [];

  if (query.name) rawQueryArray.push(equalSQL('Name', query.name));
  if (query.vatIdentificationNo) rawQueryArray.push(equalSQL('VatIdentificationNo', query.vatIdentificationNo));
  if (query.dunsNo) rawQueryArray.push(equalSQL('DUNSNo', query.dunsNo));
  if (query.ovtNo) rawQueryArray.push(equalSQL('OVTNo', query.ovtNo));
  if (query.globalLocationNo) rawQueryArray.push(equalSQL('GlobalLocationNo', query.globalLocationNo));
  if (query.iban) rawQueryArray.push(equalSQL('SupplierBankAccount.AccountNumber', query.iban));

  if (query.commercialRegisterNo) {
    const commercialRegisterNoQuery = [
      equalSQL('CommercialRegisterNo', query.commercialRegisterNo),
      similar('CityOfRegistration', query.cityOfRegistration),
      equalSQL('CountryOfRegistration', query.countryOfRegistration)
    ].join(' AND ');
    rawQueryArray.push(`(${commercialRegisterNoQuery})`);
  }

  if (query.taxIdentificationNo) {
    const taxIdentificationNoQuery = [
      equalSQL('TaxIdentificationNo', query.taxIdentificationNo),
      similar('CityOfRegistration', query.cityOfRegistration)
    ].join(' AND ');
    rawQueryArray.push(`(${taxIdentificationNoQuery})`);
  }

  let rawQuery = rawQueryArray.length > 1 ? '(' + rawQueryArray.join(' OR ') + ')' : rawQueryArray[0];

  if (query.id) rawQuery = rawQuery + ` AND Supplier.ID != '${query.id}'`;

  const model = this.db.models.Supplier;
  const select = `SELECT ${attributes(model)} FROM Supplier`;
  const leftJoin = 'LEFT JOIN SupplierBankAccount ON Supplier.ID = SupplierBankAccount.SupplierID';
  return this.db.query(`${select} ${leftJoin} WHERE ${rawQuery} LIMIT 1`, { model:  model }).then(suppliers => {
    let supplier = suppliers[0];
    if (supplier) {
      supplier.get('supplierId');
      supplier.get('supplierName');
    }
    return supplier;
  });
};

module.exports.recordExists = function(supplier)
{
  return this.searchRecord(supplier).then(supplier => Boolean(supplier));
};

let randomNumber = function()
{
  return Math.floor((Math.random() * 1000));
};

let associationsFromIncludes = function(dbModels, includes)
{
  const associations = {
    contacts: dbModels.SupplierContact,
    addresses: dbModels.SupplierAddress,
    bankAccounts: dbModels.SupplierBankAccount,
    capabilities: dbModels.Capability
  };

  let includeModels = [];

  for (const association of includes) {
    if (associations[association]) includeModels.push(associations[association]);
  }

  return includeModels;
}

let supplierWithAssociations = function(supplier)
{
  if (!supplier) return supplier;

  supplier.get('supplierId');
  supplier.get('supplierName');

  supplier.dataValues.contacts = supplier.SupplierContacts;
  supplier.dataValues.addresses = supplier.SupplierAddresses;
  supplier.dataValues.bankAccounts = supplier.SupplierBankAccounts;
  supplier.dataValues.capabilities = supplier.Capabilities;

  delete supplier.dataValues.SupplierContacts;
  delete supplier.dataValues.SupplierAddresses;
  delete supplier.dataValues.SupplierBankAccounts;
  delete supplier.dataValues.Capabilities;

  return supplier.dataValues;
}

let normalize = function(supplier)
{
  for (const fieldName of ['vatIdentificationNo', 'dunsNo', 'iban']) {
    if (supplier[fieldName]) supplier[fieldName] = supplier[fieldName].replace(/\s+/g, '');
  }
  for (const fieldName of ['name', 'commercialRegisterNo', 'cityOfRegistration', 'taxIdentificationNo']) {
    if (supplier[fieldName]) supplier[fieldName] = supplier[fieldName].trim();
  }
}

let similar = function(fieldName, value)
{
  /* Min length for MATCH is 4 */
  if (value && value.length > 4) return matchSQL(fieldName, value);

  return equalSQL(fieldName, value);
}

let matchSQL = function(fieldName, value)
{
  return `MATCH (${fieldName}) AGAINST (${SqlString.escape(value)})`;
}

let equalSQL = function(fieldName, value)
{
  return `${fieldName} = ${SqlString.escape(value)}`;
}

let attributes = function(model)
{
  let rawAttributes = model.rawAttributes;
  delete rawAttributes.supplierId;
  delete rawAttributes.supplierName;
  return Object.keys(rawAttributes).map(fieldName => `Supplier.${rawAttributes[fieldName].field} AS ${fieldName}`).join(', ');
}

let aggregateSeach = function(suppliers)
{
  const suppliersById = suppliers.reduce((accumulator, supplier) => {
    const object = supplier.dataValues;
    if (!accumulator[object.id]) {
      accumulator[object.id] = JSON.parse(JSON.stringify(object));
      accumulator[object.id].capabilities = [];
      delete accumulator[object.id].capabilityId;
    }

    if (object.capabilityId) accumulator[object.id].capabilities.push(object.capabilityId);
    return accumulator;
  }, {});

  return Object.values(suppliersById);
}

let determineHierarchyIdFromParent = function(parentId, parentHierarchyId)
{
  if (!parentHierarchyId) return parentId;

  return [parentHierarchyId, parentId].join('|');
}

let determineHierarchyIdForChild = function(supplierId, hierarchyId, childHierarchyId)
{
  let hierarchyIds = childHierarchyId.split('|');
  let slicedChildHierarchyId = hierarchyIds.slice(hierarchyIds.indexOf(supplierId)).join('|');

  if (!hierarchyId) return slicedChildHierarchyId;

  return [hierarchyId, slicedChildHierarchyId].join('|');
}
