const stringHelper = require('../utils/string');
const SqlString = require('sequelize/lib/sql-string');
const utils = require('../utils/lib');
const uniqueIdentifier = require('../utils/validators/uniqueIdentifier');

class Supplier {
  constructor(db) {
    this.supplier = db.models.Supplier;
    this.db = db;

    this.supplier.hasMany(db.models.SupplierContact, { foreignKey: 'supplierId', sourceKey: 'id' });
    this.supplier.hasMany(db.models.SupplierAddress, { foreignKey: 'supplierId', sourceKey: 'id' });
    this.supplier.hasMany(db.models.SupplierBankAccount, { foreignKey: 'supplierId', sourceKey: 'id' });
    this.supplier.hasMany(db.models.Capability, { foreignKey: 'supplierId', sourceKey: 'id' });

    this.associations = {
      contacts: db.models.SupplierContact,
      addresses: db.models.SupplierAddress,
      bankAccounts: db.models.SupplierBankAccount,
      capabilities: db.models.Capability
    };
  }

  async all(query, includes) {
    let queryObj = {};
    if (query.id) queryObj.id = { $in: query.id.split(',') };
    if (query.name) queryObj.name = { $like: `%${query.name}%` };
    if (query.hierarchyId) queryObj['$or'] = hierarchyQuery(query.hierarchyId);
    if (query.commercialRegisterNo) queryObj.commercialRegisterNo = query.commercialRegisterNo;
    if (query.vatIdentificationNo) queryObj.vatIdentificationNo = query.vatIdentificationNo;
    if (query.globalLocationNo) queryObj.globalLocationNo = query.globalLocationNo;
    if (query.ovtNo) queryObj.ovtNo = query.ovtNo;

    const includeModels = this.associationsFromIncludes(includes || []);

    const suppliers = await this.supplier.findAll({ where: queryObj, include: includeModels });

    return suppliers.map(supplier => supplierWithAssociations(supplier));
  }

  async find(supplierId, includes) {
    const includeModels = this.associationsFromIncludes(includes || []);

    const supplier = await this.supplier.findOne({where: { id: supplierId }, include: includeModels});

    return supplierWithAssociations(supplier);
  }

  async findMother(supplierId) {
    const supplier = await this.find(supplierId);
    if (!supplier) return Promise.resolve(null);

    const motherSupplierId = supplier.hierarchyId ? supplier.hierarchyId.split('|')[0] : supplier.id;
    return this.find(motherSupplierId);
  }

  async create(supplier) {
    if (!supplier.name) supplier.name = supplier.supplierName;
    normalize(supplier);

    if (supplier.parentId) {
      const parent = await this.find(supplier.parentId);
      supplier.hierarchyId = determineHierarchyIdFromParent(supplier.parentId, parent.hierarchyId);
    }

    const self = this;
    let supplierId = supplier.name.replace(/^[0-9\W]+|[^0-9a-z-_]/gi, '').slice(0, 27);

    function generateSupplierId(id) {
      return self.exists(id).then(exists => {
        if (exists) return generateSupplierId(supplierId + utils.randomNumber());

        return id;
      });
    }

    return generateSupplierId(supplierId).then(id => {
      supplier.id = id;
      supplier.role = 'selling';
      return this.supplier.create(supplier);
    });
  }

  async update(supplierId, supplier) {
    [ 'id', 'createdBy', 'createdOn', 'updatedOn' ].forEach(key => delete supplier[key]);

    if (supplier.supplierName && !supplier.name) supplier.name = supplier.supplierName;
    normalize(supplier);

    if (supplier.parentId) {
      const parent = await this.find(supplier.parentId);
      supplier.hierarchyId = determineHierarchyIdFromParent(supplier.parentId, parent.hierarchyId);
    } else {
      supplier.hierarchyId = null;
    }

    let children = await this.all({ hierarchyId: supplierId });

    let self = this;
    return this.supplier.update(supplier, { where: { id: supplierId } }).then(() => {
      return Promise.all(children.map(child => {
        const hierarchyId = determineHierarchyIdForChild(supplierId, supplier.hierarchyId, child.hierarchyId);
        return this.supplier.update({ hierarchyId: hierarchyId }, { where: { id : child.id } });
      })).then(() => self.find(supplierId));
    });
  }

  delete(supplierId) {
    return this.supplier.destroy({ where: { id: supplierId } }).then(() => null);
  }

  exists(supplierId) {
    return this.supplier.findById(supplierId).then(supplier => Boolean(supplier));
  }

  searchAll(searchValue, capabilities) {
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

    const select = `SELECT ${this.attributes()}, Capability.capabilityId FROM Supplier `;
    const leftJoin = 'LEFT JOIN Capability ON Supplier.ID = Capability.supplierId ';
    const matchQuery = `WHERE MATCH (${searchFields}) AGAINST ('${search}' IN BOOLEAN MODE)`;
    let query = select + leftJoin + (searchValue ? matchQuery : '');

    if (capabilities.length < 1) return this.db.query(query, { model: this.supplier }).then(suppliers => aggregateSearch(suppliers));

    const innerJoin = 'INNER JOIN Capability ON Supplier.ID = Capability.supplierId ';
    const capabilityQuery = capabilities.map(capability => `Capability.capabilityId = ${SqlString.escape(capability)}`).join(' OR ');

    query = select + innerJoin + (searchValue ? `${matchQuery} AND ${capabilityQuery}` : `WHERE ${capabilityQuery}`);
    return this.db.query(query, { model: this.supplier }).then(suppliers => aggregateSearch(suppliers));
  }

  async searchRecord(query) {
    normalize(query);

    let rawQueryArray = [];

    if (query.name) rawQueryArray.push(equalSQL('Name', query.name));
    if (query.vatIdentificationNo) rawQueryArray.push(equalSQL('VatIdentificationNo', query.vatIdentificationNo));
    if (query.dunsNo) rawQueryArray.push(equalSQL('DUNSNo', query.dunsNo));
    if (query.ovtNo) rawQueryArray.push(equalSQL('OVTNo', query.ovtNo));
    if (query.globalLocationNo) rawQueryArray.push(equalSQL('GlobalLocationNo', query.globalLocationNo));
    if (query.iban) rawQueryArray.push(equalSQL('SupplierBankAccount.AccountNumber', query.iban));
    if (query.subEntityCode) rawQueryArray.push(equalSQL('SubEntityCode', query.subEntityCode));

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

    if (query.id) rawQuery = rawQuery + ` AND Supplier.ID != ${SqlString.escape(query.id)}`;
    if (query.parentId) {
      const motherCustomer = await this.findMother(query.parentId);

      if (motherCustomer) {
        if (query.notEqual) {
          rawQuery = rawQuery + ` AND Supplier.ID != ${SqlString.escape(motherCustomer.id)}`;
          rawQuery = rawQuery + ` AND ${notLikeSQL('HierarchyId', motherCustomer.id)}`;
        } else {
          rawQuery = rawQuery + ` AND ${likeSQL('HierarchyId', motherCustomer.id)}`;
        }
      }
    }

    const select = `SELECT ${this.attributes()} FROM Supplier`;
    const leftJoin = 'LEFT JOIN SupplierBankAccount ON Supplier.ID = SupplierBankAccount.SupplierID';
    const suppliers = await this.db.query(`${select} ${leftJoin} WHERE ${rawQuery} LIMIT 1`, { model:  this.supplier });
    let supplier = suppliers[0];
    if (supplier) {
      supplier.get('supplierId');
      supplier.get('supplierName');
    }
    return supplier;
  }

  recordExists(supplier) {
    return this.searchRecord(supplier).then(supplier => Boolean(supplier));
  }

  associationsFromIncludes(includes) {
    let includeModels = [];

    for (const association of includes) {
      if (this.associations[association]) includeModels.push(this.associations[association]);
    }

    return includeModels;
  }

  attributes() {
    let rawAttributes = this.supplier.rawAttributes;
    delete rawAttributes.supplierId;
    delete rawAttributes.supplierName;
    return Object.keys(rawAttributes).map(fieldName => `Supplier.${rawAttributes[fieldName].field} AS ${fieldName}`).join(', ');
  }

  hasUniqueIdentifier(supplier) {
    const fields = [
      supplier.vatIdentificationNo,
      supplier.dunsNo,
      supplier.globalLocationNo,
      supplier.ovtNo,
      supplier.iban
    ];

    if (uniqueIdentifier.isValid(fields)) return true;

    return false;
  }
};

let normalize = function(supplier)
{
  for (const fieldName of ['vatIdentificationNo', 'dunsNo', 'iban']) {
    if (supplier[fieldName]) supplier[fieldName] = supplier[fieldName].replace(/\s+/g, '');
  }
  for (const fieldName of ['name', 'commercialRegisterNo', 'cityOfRegistration', 'taxIdentificationNo']) {
    if (supplier[fieldName]) supplier[fieldName] = supplier[fieldName].trim();
  }
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

let likeSQL = function(fieldName, value)
{
  const string = `%${value}%`;
  return `${fieldName} LIKE ${SqlString.escape(string)}`;
}

let notLikeSQL = function(fieldName, value)
{
  const string = `%${value}%`;
  return `(${fieldName} IS NULL OR ${fieldName} NOT LIKE ${SqlString.escape(string)})`;
}

let aggregateSearch = function(suppliers)
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

let hierarchyQuery = function(hierarchyId)
{
  return [
    { hierarchyId: { $like: `%|${hierarchyId}` } },
    { hierarchyId: { $like: `${hierarchyId}|%` } },
    { hierarchyId: { $like: `%|${hierarchyId}|%` } },
    { hierarchyId: { $eq: hierarchyId } }
  ];
}

module.exports = Supplier;
