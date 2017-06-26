'use strict'

const Promise = require('bluebird');
const pathjs = require('path');

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
    const path = pathjs.resolve(__dirname + '/../data');

    // Load data.
    const addressData = require(path + '/address.json');
    // Get database models.
    const Address  = db.models.Address;

    // -----

    // Load data.
    const countryData = require(path + '/country.json');
    // Get database models.
    const Country  = db.models.Country;

    // -----

    // Load data.
    const supplierData = require(path + '/supplier.json');
    // Get database models.
    const Supplier  = db.models.Supplier;

    // -----

    // Load data.
    const supplier2addressData = require(path + '/supplier2address.json');
    // Get database models.
    const Supplier2Address  = db.models.Supplier2Address;

    // -----

    // Load data.
    const supplierContactData = require(path + '/supplierContact.json');
    // Get database models.
    const SupplierContact  = db.models.SupplierContact;

    // -----

    // Load data.
    const user2SupplierData = require(path + '/user2supplier.json');
    // Get database models.
    const User2Supplier  = db.models.User2Supplier;

    return Promise.all([
        Promise.all(addressData.map(cur => Address.upsert(cur))),
        Promise.all(countryData.map(cur => Country.upsert(cur))),
        Promise.all(supplierData.map(cur => Supplier.upsert(cur)))
    ])
    .then(() => Promise.all([
        Promise.all(supplier2addressData.map(cur => Supplier2Address.upsert(cur))),
        Promise.all(supplierContactData.map(cur => SupplierContact.upsert(cur))),
        Promise.all(user2SupplierData.map(cur => User2Supplier.upsert(cur)))
    ]));
}

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
        db.models.User2Supplier.destroy({ truncate: true }),
        db.models.SupplierContact.destroy({ truncate: true }),
        db.models.Supplier2Address.destroy({ truncate: true })
    ]).then(() => Promise.all([
        db.models.Supplier.destroy({ truncate: true }),
        db.models.Address.destroy({ truncate: true }),
        db.models.Country.destroy({ truncate: true })
    ]));
}
