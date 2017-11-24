'use strict'

const Promise = require('bluebird');

module.exports.init = function(db, config)
{
  this.db = db;

  return Promise.resolve(this);
};

module.exports.create = function(supplierId, capabilityId)
{
  return this.db.models.Capability.findOrCreate(query(supplierId, capabilityId)).spread((capability, created) => capability);
};

module.exports.delete = function(supplierId, capabilityId)
{
  return this.db.models.Capability.destroy(query(supplierId, capabilityId)).then(() => null);
};

let query = function(supplierId, capabilityId)
{
  return { where: { supplierId: supplierId, capabilityId: capabilityId } };
}
