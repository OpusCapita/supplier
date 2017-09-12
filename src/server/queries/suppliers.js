const Promise = require('bluebird');
const stringHelper = require('../utils/string');

module.exports.init = function(db, config)
{
  db.models.Supplier.hasMany(db.models.SupplierContact, { foreignKey: 'supplierId', sourceKey: 'supplierId' });
  db.models.Supplier.hasMany(db.models.SupplierAddress, { foreignKey: 'supplierId', sourceKey: 'supplierId' });
  db.models.Supplier.hasMany(db.models.SupplierBankAccount, { foreignKey: 'supplierId', sourceKey: 'supplierId' });

  this.db = db;
  return Promise.resolve(this);
};

module.exports.all = function(queryObj, includes)
{
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
  if (supplier.vatIdentificationNo) supplier.vatIdentificationNo = normalizeVATID(supplier.vatIdentificationNo);

  const self = this;
  let supplierId = supplier.supplierName.replace(/[^0-9a-z_\-]/gi, '');

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
  if (supplier.vatIdentificationNo) supplier.vatIdentificationNo = normalizeVATID(supplier.vatIdentificationNo);

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

module.exports.searchRecord = function(query)
{
  if (query.vatIdentificationNo) query.vatIdentificationNo = normalizeVATID(query.vatIdentificationNo);

  let rawQueryArray = [];
  for (const value of ['supplierName', 'vatIdentificationNo']) {
    const fieldName = stringHelper.capitalize(value);
    if (query[value]) rawQueryArray.push(`MATCH (${fieldName}) AGAINST ('${query[value]}')`);
  }

  if (query.dunsNo) rawQueryArray.push(`MATCH (DUNSNo) AGAINST ('${query.dunsNo}')`);

  if (query.globalLocationNo) rawQueryArray.push(`GlobalLocationNo = '${query.globalLocationNo}'`);

  if (query.commercialRegisterNo) {
    const commercialRegisterNoQuery = [
      `MATCH (CommercialRegisterNo) AGAINST ('${query.commercialRegisterNo}')`,
      `MATCH (CityOfRegistration) AGAINST ('${query.cityOfRegistration}')`,
      `CountryOfRegistration = '${query.countryOfRegistration}'`
    ].join(' AND ');
    rawQueryArray.push(`(${commercialRegisterNoQuery})`);
  }

  if (query.taxIdentificationNo) {
    const taxIdentificationNoQuery = [
      `MATCH (TaxIdentificationNo) AGAINST ('${query.taxIdentificationNo}')`,
      `CountryOfRegistration = '${query.countryOfRegistration}'`
    ].join(' AND ');
    rawQueryArray.push(`(${taxIdentificationNoQuery})`);
  }

  let rawQuery = rawQueryArray.length > 1 ? '(' + rawQueryArray.join(' OR ') + ')' : rawQueryArray[0];

  if (query.supplierId) rawQuery = rawQuery + ` AND SupplierID != '${query.supplierId}'`;

  const rawAttributes = this.db.models.Supplier.rawAttributes;
  const attributes = Object.keys(rawAttributes).map(fieldName => `${rawAttributes[fieldName].field} AS ${fieldName}`).join(', ');

  return this.db.query(
    `SELECT ${attributes} FROM Supplier WHERE ${rawQuery} LIMIT 1`,
    { model:  this.db.models.Supplier }
  ).then(suppliers => suppliers[0]);
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

let normalizeVATID = function(vatId)
{
  return vatId.replace(/\s+/g, '');
}
