'use strict'

const Promise = require('bluebird');

module.exports.init = function(db, config)
{
  this.db = db;

  return Promise.resolve(this);
};

module.exports.all = function(supplierId)
{
  return this.db.models.Supplier2User.findAll({ where: { supplierId: supplierId } });
};

module.exports.find = function(supplierId, userId)
{
  return this.db.models.Supplier2User.findOne({ where: { supplierId: supplierId, id: userId } });
};

module.exports.getSupplierAccess = function () {
  return this.db.models.Supplier2User.findAll({
    where: { status: 'requested'},
  })
};

module.exports.getContactDetails = function (data) {
  let supplier = this.db.models.SupplierContact
  let supplierInformation = []
  for(let index = 0; index < data.length ; index ++){
    supplierInformation.push(supplier.findOne({ where: {SupplierId: data[index].dataValues.supplierId}}))
  }
  return Promise.all(supplierInformation)
}

module.exports.approve = function(supplierId, userId, accessReason)
{
  var self = this;
  return this.db.models.Supplier2User.update(accessReason, { where: { supplierId: supplierId, userId: userId  } }).then(() => {
    return self.find(supplierId, userId);
  });
};

module.exports.reject = function(supplierId, userId, accessReason)
{
  var self = this;
  return this.db.models.Supplier2User.update(accessReason, { where: { supplierId: supplierId, userId: userId } }).then(() => {
    return self.find(supplierId, userId);
  });
};
