'use strict'

const Promise = require('bluebird');

module.exports.init = function(db, config)
{
  this.db = db;

  return Promise.resolve(this);
};

module.exports.all = function(supplierId)
{
  return this.db.models.SupplierContact.findAll({ where: { supplierId: supplierId } });
};

module.exports.find = function(supplierId, contactId)
{
  return this.db.models.SupplierContact.findOne({
    where: { supplierId: supplierId, contactId: contactId }
  });
};

module.exports.create = function(contact)
{
  return this.db.models.SupplierContact.create(contact).then(contact => {
    return contact;
  });
};

module.exports.update = function(supplierId, contactId, contact)
{
  let self = this;
  return this.db.models.SupplierContact.update(contact, { where: { contactId: contactId } }).then(() => {
    return self.find(supplierId, contactId);
  });
};

module.exports.delete = function(supplierId, contactId)
{
  return this.db.models.SupplierContact.destroy({ where: { supplierId: supplierId, contactId: contactId } }).then(() => null);
};

module.exports.contactExists = function(supplierId, contactId)
{
  return this.find(supplierId, contactId).then(contact => contact && contact.contactId === contactId);
};
