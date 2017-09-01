const Promise = require('bluebird');

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
  let self = this;
  return this.db.models.Supplier.update(supplier, { where: { supplierId: supplierId } }).then(() => {
    return self.find(supplierId, []);
  });
};

module.exports.delete = function(supplierId)
{
  return this.db.models.Supplier.destroy({ where: { supplierId: supplierId } }).then(() => null);
};

module.exports.searchRecord = function(query)
{
  let orOptions = [];

  for (const field of ['supplierName', 'vatIdentificationNo', 'dunsNo', 'globalLocationNo']) {
    if (query[field]) orOptions.push({ [field]: { $eq: query[field] } });
  }

  if (query.commercialRegisterNo) {
    orOptions.push({
      $and: {
        commercialRegisterNo: { $eq: query.commercialRegisterNo },
        cityOfRegistration: { $eq: query.cityOfRegistration },
        countryOfRegistration: { $eq: query.countryOfRegistration }
      }
    });
  }

  if (query.taxIdentificationNo) {
    orOptions.push({
      $and: {
        taxIdentificationNo: { $eq: query.taxIdentificationNo },
        countryOfRegistration: { $eq: query.countryOfRegistration }
      }
    });
  }

  const options = { $or: orOptions };

  if (query.supplierId) options.supplierId = { $ne: query.supplierId };

  return this.db.models.Supplier.findOne({ where: options });
};

module.exports.exists = function(supplierId)
{
  return this.db.models.Supplier.findById(supplierId).then(supplier => Boolean(supplier));
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
