'use strict'

const Promise = require('bluebird');

module.exports.init = function(db, config)
{
  this.db = db;

  return Promise.resolve(this);
}

module.exports.all = function(supplierId)
{
  return this.db.models.Address.findAll({ where: { supplierId: supplierId } });
}

module.exports.find = function(supplierId, addressId)
{
  return this.db.models.Address.findOne({ where: { supplierId: supplierId, addressId: addressId } });
}

module.exports.create = function(address)
{
  return this.db.models.Address.create(address).then(address => {
    return address;
  });
}

module.exports.update = function(supplierId, addressId, address)
{
  var self = this;
  return this.db.models.Address.update(address, { where: { addressId: addressId } }).then(() => {
    return self.find(supplierId, addressId);
  });
}

module.exports.delete = function(supplierId, addressId)
{
  return this.db.models.Address.destroy({ where: { supplierId: supplierId, addressId: addressId } }).then(() => null);
}

module.exports.addressExists = function(supplierId, addressId)
{
  return this.find(supplierId, addressId).then(address => address && address.addressId === addressId);
}
