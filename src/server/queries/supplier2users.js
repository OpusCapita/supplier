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
