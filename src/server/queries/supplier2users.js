'use strict'

const Promise = require('bluebird');

module.exports.init = function(db, config)
{
  this.db = db;

  return Promise.resolve(this);
};

module.exports.all = function(supplierId)
{
  return this.db.models.Supplier2User.findAll({ where: { supplierId: supplierId } });
}

module.exports.find = function(userId)
{
  return this.db.models.Supplier2User.findOne({ where: { userId: userId } });
};

module.exports.create = function(supplier2user)
{
  return this.db.models.Supplier2User.create(supplier2user);
};

module.exports.update = function(id, supplier2user)
{
  const attributes = { status: supplier2user.status };
  const userId = supplier2user.userId;
  return this.db.models.Supplier2User.update(attributes, { where: { id: id }}).then(() => {
    return this.find(userId);
  });
};

module.exports.exists = function(id)
{
  return this.db.models.Supplier2User.findOne({ where: { id: id }}).then(supplier2user => Boolean(supplier2user));
};
