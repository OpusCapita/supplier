'use strict';

const Promise = require('bluebird');

module.exports.init = function(db, config)
{
  this.db = db;

  return Promise.resolve(this);
};

module.exports.all = function(supplierId)
{
  return this.db.models.SupplierBankAccount.findAll({ where: { supplierId: supplierId } });
};

module.exports.find = function(supplierId, bankAccountId)
{
  return this.db.models.SupplierBankAccount.findOne({ where: { supplierId: supplierId, bankAccountId: bankAccountId } });
};

module.exports.create = function(address)
{
  return this.db.models.SupplierBankAccount.create(address).then(address => {
    return address;
  });
};

module.exports.update = function(supplierId, bankAccountId, address)
{
  let self = this;
  return this.db.models.SupplierBankAccount.update(address, { where: { bankAccountId: bankAccountId } }).then(() => {
    return self.find(supplierId, bankAccountId);
  });
};

module.exports.delete = function(supplierId, bankAccountId)
{
  return this.db.models.SupplierBankAccount.destroy({ where: { supplierId: supplierId, bankAccountId: bankAccountId } }).then(() => null);
};

module.exports.bankExists = function(supplierId, bankAccountId)
{
  return this.find(supplierId, bankAccountId).then(accounts => accounts && accounts.bankAccountId === bankAccountId);
};
