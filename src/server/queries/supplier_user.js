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
  let supplier = this.db.models.Supplier
  let supplier2user = this.db.models.Supplier2User
  return supplier.findAll({
    where: { status: true},
    include: [
      { model: supplier2user,
        required: true,
        where: {
          status: 'requested'
        }
      }
    ]
  })
  // return this.db.models.Supplier2User.findAll({
  //   where: { status: 'requested'},
  //   include: [
  //     { model: supplier,
  //       required: true
  //     }
  //   ]
  // })
};

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
