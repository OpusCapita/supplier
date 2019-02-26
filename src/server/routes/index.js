'use strict';

const Promise = require('bluebird');

const Supplier = require('./Supplier');
const SupplierContact = require('./SupplierContact');
const SupplierAddress = require('./SupplierAddress');
const SupplierBankAccount = require('./SupplierBankAccount');
const supplierProfileStrength = require('./supplier_profile_strength');
const SupplierAccess = require('./SupplierAccess');
const Capability = require('./Capability');
const SupplierOrganization = require('./SupplierOrganization');
const SupplierVisibility = require('./SupplierVisibility');

/**
 * Initializes all routes for RESTful access.
 *
 * @param {object} app - [Express]{@link https://github.com/expressjs/express} instance.
 * @param {object} db - If passed by the web server initialization, a [Sequelize]{@link https://github.com/sequelize/sequelize} instance.
 * @param {object} config - Everything from [config.routes]{@link https://github.com/OpusCapitaBusinessNetwork/web-init} passed when running the web server initialization.
 * @returns {Promise} [Promise]{@link http://bluebirdjs.com/docs/api-reference.html}
 * @see [Minimum setup]{@link https://github.com/OpusCapitaBusinessNetwork/web-init#minimum-setup}
 */
module.exports.init = function(app, db, config) {
  new Supplier(app, db).init();
  new SupplierContact(app, db).init();
  new SupplierAddress(app, db).init();
  new SupplierBankAccount(app, db).init();
  supplierProfileStrength(app, db, config);
  new SupplierAccess(app, db).init();
  new Capability(app, db).init();
  new SupplierOrganization(app, db).init();
  new SupplierVisibility(app, db).init();
  return Promise.resolve();
};
