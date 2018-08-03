'use strict';
const Promise = require('bluebird');

module.exports.init = function(db, config)
{
  return Promise.all([
    require('./Supplier').init(db, config),
    require('./SupplierAddress').init(db, config),
    require('./SupplierContact').init(db, config),
    require('./SupplierBankAccount').init(db, config),
    require('./Supplier2User').init(db, config),
    require('./Capability').init(db, config),
    require('./SupplierVisibility').init(db, config)
  ]);
};
