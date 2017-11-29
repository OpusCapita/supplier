const Promise = require('bluebird');
const stringHelper = require('../utils/string');
const SqlString = require('sequelize/lib/sql-string');

module.exports.init = function(db, config)
{
  db.models.Supplier.hasMany(db.models.SupplierContact, { foreignKey: 'supplierId', sourceKey: 'supplierId' });
  db.models.Supplier.hasMany(db.models.SupplierAddress, { foreignKey: 'supplierId', sourceKey: 'supplierId' });
  db.models.Supplier.hasMany(db.models.SupplierBankAccount, { foreignKey: 'supplierId', sourceKey: 'supplierId' });

  this.db = db;
  return Promise.resolve(this);
};

module.exports.all = function(query, includes)
{
  const queryObj = query.supplierId ? { supplierId: { $in: query.supplierId.split(',') }} : {};
  const includeModels = associationsFromIncludes(this.db.models, includes);

  return this.db.models.Supplier.findAll({ where: queryObj, include: includeModels }).map(supplier => {
    return supplierWithAssociations(supplier);
  });
};

module.exports.find = function(supplierId, includes)
{
  const includeModels = associationsFromIncludes(this.db.models, includes);

  return this.db.models.Supplier.findOne({where: { supplierId: supplierId }, include: includeModels}).then(supplier => {
    return supplierWithAssociations(supplier);
  });
};

module.exports.create = function(supplier)
{
  normalize(supplier);

  const self = this;
  let supplierId = supplier.supplierName.replace(/[^0-9a-z_\-]/gi, '').slice(0, 27);

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
    supplier.supplierId = id;
    supplier.role = 'selling';
    return this.db.models.Supplier.create(supplier);
  });
};

module.exports.update = function(supplierId, supplier)
{
  normalize(supplier);

  let self = this;
  return this.db.models.Supplier.update(supplier, { where: { supplierId: supplierId } }).then(() => {
    return self.find(supplierId, []);
  });
};

module.exports.delete = function(supplierId)
{
  return this.db.models.Supplier.destroy({ where: { supplierId: supplierId } }).then(() => null);
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
    'SupplierName',
    'CityOfRegistration',
    'TaxIdentificationNo',
    'VatIdentificationNo',
    'CommercialRegisterNo',
    'DUNSNo',
    'GlobalLocationNo'
  ].join(',');

  const select = `SELECT ${attributes(model)}, Capability.capabilityId FROM Supplier `;
  const leftJoin = 'LEFT JOIN Capability ON Supplier.SupplierID = Capability.supplierId ';
  const matchQuery = `WHERE MATCH (${searchFields}) AGAINST ('${search}' IN BOOLEAN MODE)`;
  let query = select + leftJoin + (searchValue ? matchQuery : '');

  if (capabilities.length < 1) return this.db.query(query, { model: model }).then(suppliers => aggregateSeach(suppliers));

  const innerJoin = 'INNER JOIN Capability ON Supplier.SupplierID = Capability.supplierId ';
  const capabilityQuery = capabilities.map(capability => `Capability.capabilityId = ${SqlString.escape(capability)}`).join(' OR ');

  query = select + innerJoin + (searchValue ? `${matchQuery} AND ${capabilityQuery}` : `WHERE ${capabilityQuery}`);
  return this.db.query(query, { model: model }).then(suppliers => aggregateSeach(suppliers));
};

module.exports.searchRecord = function(query)
{
  normalize(query);

  let rawQueryArray = [];

  if (query.supplierName) rawQueryArray.push(equalSQL('SupplierName', query.supplierName));
  if (query.vatIdentificationNo) rawQueryArray.push(equalSQL('VatIdentificationNo', query.vatIdentificationNo));
  if (query.dunsNo) rawQueryArray.push(equalSQL('DUNSNo', query.dunsNo));
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

  if (query.supplierId) rawQuery = rawQuery + ` AND Supplier.SupplierID != '${query.supplierId}'`;

  const model = this.db.models.Supplier;
  const select = `SELECT ${attributes(model)} FROM Supplier`;
  const leftJoin = 'LEFT JOIN SupplierBankAccount ON Supplier.SupplierID = SupplierBankAccount.SupplierID';
  return this.db.query(`${select} ${leftJoin} WHERE ${rawQuery} LIMIT 1`, { model:  model }).then(suppliers => suppliers[0]);
};

module.exports.recordExists = function(supplier)
{
  return this.searchRecord(supplier).then(supplier => Boolean(supplier));
};

module.exports.isAuthorized = function(supplierId, changedBy)
{
  return this.db.models.Supplier.findById(supplierId).then(supplier => supplier && supplier.changedBy === changedBy);
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
    bankAccounts: dbModels.SupplierBankAccount
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

  supplier.dataValues.contacts = supplier.SupplierContacts;
  supplier.dataValues.addresses = supplier.SupplierAddresses;
  supplier.dataValues.bankAccounts = supplier.SupplierBankAccounts;

  delete supplier.dataValues.SupplierContacts;
  delete supplier.dataValues.SupplierAddresses;
  delete supplier.dataValues.SupplierBankAccounts;

  return supplier.dataValues;
}

let normalize = function(supplier)
{
  for (const fieldName of ['vatIdentificationNo', 'dunsNo']) {
    if (supplier[fieldName]) supplier[fieldName] = supplier[fieldName].replace(/\s+/g, '');
  }
  for (const fieldName of ['supplierName', 'commercialRegisterNo', 'cityOfRegistration', 'taxIdentificationNo']) {
    if (supplier[fieldName]) supplier[fieldName] = supplier[fieldName].trim();
  }
}

let similar = function(fieldName, value)
{
  /* Min length for MATCH is 4 */
  if (value.length > 4) return matchSQL(fieldName, value);

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
  const rawAttributes = model.rawAttributes;
  return Object.keys(rawAttributes).map(fieldName => `Supplier.${rawAttributes[fieldName].field} AS ${fieldName}`).join(', ');
}

let aggregateSeach = function(suppliers)
{
  const suppliersById = suppliers.reduce((accumulator, supplier) => {
    const object = supplier.dataValues;
    if (!accumulator[object.supplierId]) {
      accumulator[object.supplierId] = JSON.parse(JSON.stringify(object));
      accumulator[object.supplierId].capabilities = [];
      delete accumulator[object.supplierId].capabilityId;
    }

    if (object.capabilityId) accumulator[object.supplierId].capabilities.push(object.capabilityId);
    return accumulator;
  }, {});

  return Object.values(suppliersById);
}
