'use strict'

const Promise = require('bluebird');

module.exports.init = function(db, config)
{
  this.db = db;

  return Promise.resolve(this);
};

module.exports.createOrUpdate = async function(supplierId, attributes)
{
  let visibility = await this.find(supplierId);
  if (!visibility) visibility = this.db.models.SupplierVisibility.build({ supplierId: supplierId });

  if (attributes.contacts) visibility.contacts = attributes.contacts;
  if (attributes.bankAccounts) visibility.bankAccounts = attributes.bankAccounts;

  return visibility.save().then(() => this.find(supplierId));
};

module.exports.find = function(supplierId)
{
  return this.db.models.SupplierVisibility.findOne({ where: { supplierId: supplierId }});
};

module.exports.delete = function(supplierId)
{
  return this.db.models.SupplierVisibility.destroy({ where: { supplierId: supplierId } }).then(() => null);
};
