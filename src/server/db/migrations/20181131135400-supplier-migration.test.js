'use strict';

const Promise = require('bluebird');
const pathjs = require('path');
const path = pathjs.resolve(__dirname + '/../data');

const supplierDemoData = require(path + '/supplierDemoData-2.json');
const supplierAddressDemoData = require(path + '/supplierAddressDemoData-2.json');
const supplierBankAccountDemoData = require(path + '/supplierBankAccountDemoData-2.json');

module.exports.up = function(db, config)
{
  return db.queryInterface.bulkInsert('Supplier', supplierDemoData)
  .then(() => Promise.all([
    db.queryInterface.bulkInsert('SupplierAddress', supplierAddressDemoData),
    db.queryInterface.bulkInsert('SupplierBankAccount', supplierBankAccountDemoData)
  ]));
};

module.exports.down = function(db, config)
{
  return Promise.all([
    db.queryInterface.bulkDelete('SupplierAddress', { SupplierID: { $in: supplierAddressDemoData.map(rec => rec.SupplierID) } }),
    db.queryInterface.bulkDelete('SupplierBankAccount', { SupplierID: { $in: supplierBankAccountDemoData.map(rec => rec.SupplierID) } })
  ]).then(() => db.queryInterface.bulkDelete('Supplier', { ID: { $in: supplierDemoData.map(rec => rec.ID) } }));
};
