'use strict';

const Promise = require('bluebird');
const pathjs = require('path');
const path = pathjs.resolve(__dirname + '/../data');

const supplierDemoData = require(path + '/supplierDemoData.json');
const supplierAddressDemoData = require(path + '/supplierAddressDemoData.json');
const supplierBankAccountDemoData = require(path + '/supplierBankAccountDemoData.json');

/**
 * Inserts test data into existing database structures.
 * If all migrations were successul, this method will never be executed again.
 * To identify which migrations have successfully been processed, a migration's filename is used.
 *
 * @param {object} data - [Sequelize]{@link https://github.com/sequelize/sequelize} instance.
 * @param {object} config - A model property for database models and everything from [config.data]{@link https://github.com/OpusCapitaBusinessNetwork/db-init} passed when running the db-initialization.
 * @returns {Promise} [Promise]{@link http://bluebirdjs.com/docs/api-reference.html}
 * @see [Applying data migrations]{@link https://github.com/OpusCapitaBusinessNetwork/db-init#applying-data-migrations}
 */
module.exports.up = function(db, config)
{
  return db.queryInterface.bulkInsert('Supplier', supplierDemoData)
  .then(() => Promise.all([
    db.queryInterface.bulkInsert('SupplierAddress', supplierAddressDemoData),
    db.queryInterface.bulkInsert('SupplierBankAccount', supplierBankAccountDemoData)
  ]));
};

/**
 * Reverts all migrations for databse tables and data.
 * If the migration process throws an error, this method is called in order to revert all changes made by the up() method.
 *
 * @param {object} data - [Sequelize]{@link https://github.com/sequelize/sequelize} instance.
 * @param {object} config - A model property for database models and everything from [config.data]{@link https://github.com/OpusCapitaBusinessNetwork/db-init} passed when running the db-initialization.
 * @returns {Promise} [Promise]{@link http://bluebirdjs.com/docs/api-reference.html}
 * @see [Applying data migrations]{@link https://github.com/OpusCapitaBusinessNetwork/db-init#applying-data-migrations}
 */
module.exports.down = function(db, config)
{
  return Promise.all([
    db.queryInterface.bulkDelete('SupplierAddress', { SupplierID: { $in: supplierAddressDemoData.map(rec => rec.SupplierID) } }),
    db.queryInterface.bulkDelete('SupplierBankAccount', { SupplierID: { $in: supplierBankAccountDemoData.map(rec => rec.SupplierID) } })
  ]).then(() => db.queryInterface.bulkDelete('Supplier', { ID: { $in: supplierDemoData.map(rec => rec.ID) } }));
};
