'use strict';
const Promise = require('bluebird');

module.exports.init = function(db, config)
{
  return Promise.all([
    require('./Supplier').init(db),
    require('./SupplierAddress').init(db),
    require('./SupplierContact').init(db),
    require('./SupplierBankAccount').init(db),
    require('./Supplier2User').init(db),
    require('./Capability').init(db)
  ]);
};
