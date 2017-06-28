const Promise = require('bluebird');

module.exports.init = function(db, config)
{
  this.db = db;
  return Promise.resolve(this);
};

module.exports.all = function()
{
  return this.db.models.Supplier.findAll();
};

module.exports.find = function(supplierId)
{
  return this.db.models.Supplier.findById(supplierId);
};

module.exports.create = function(supplier)
{
  return this.db.models.Supplier.create(supplier).then(supplier => {
    return supplier;
  });
};

module.exports.update = function(supplierId, supplier)
{
  let self = this;
  return this.db.models.Supplier.update(supplier, { where: { supplierId: supplierId } }).then(() => {
    return self.find(supplierId);
  });
};

module.exports.delete = function(supplierId)
{
  return this.db.models.Supplier.destroy({ where: { supplierId: supplierId } }).then(() => null);
};

module.exports.exists = function(supplierId)
{
  return this.db.models.Supplier.findById(supplierId).then(supplier => supplier && supplier.supplierId === supplierId);
};

module.exports.recordExists = function(supplier)
{
  let options = { supplierName: supplier.supplierName };

  ['commercialRegisterNo', 'taxIdentificationNo', 'vatIdentificationNo'].forEach(field => {
    if (supplier[field]) {
      options[field] = supplier[field];
    }
  });

  return this.db.models.Supplier.findOne({ where: options }).then(supplier => Boolean(supplier));
};

module.exports.isAuthorized = function(supplierId, changedBy)
{
  return this.db.models.Supplier.findById(supplierId).then(supplier => supplier && supplier.changedBy === changedBy);
};
