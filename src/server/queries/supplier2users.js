'use strict'

const Promise = require('bluebird');

module.exports.init = function(db, config)
{
  this.db = db;

  return Promise.resolve(this);
};

module.exports.find = function(userId)
{
  return this.db.models.Supplier2User.findOne({ where: { userId: userId } });
};

module.exports.create = function(supplier2user)
{
  return this.db.models.Supplier2User.create(supplier2user);
};

module.exports.update = function(userId, supplier2user)
{
  var self = this;
  return this.db.models.Supplier2User.update(supplier2user, { where: { userId: userId } }).then(() => {
    return self.find(userId);
  });
};

