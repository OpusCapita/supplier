'use strict';

const Promise = require('bluebird');
const epilogue = require('epilogue');

const supplierRoutes = require('./supplier');
const supplierAddressRoutes = require('./supplierAddress');
const supplierContactRoutes = require('./supplierContact');
const countries = require('./countries');

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
  // Register routes here.
  // Use the passed db parameter in order to use Epilogue auto-routes.
  // Use require in order to separate routes into multiple js files.

  epilogue.initialize({
    app: app,
    sequelize: db,
    base: '/api'
  });

  // supplier routes
  supplierRoutes(epilogue, db);

  // supplier address routes
  supplierAddressRoutes(epilogue, db);

  // supplier contacts
  supplierContactRoutes(epilogue, db);

  // countries
  countries(epilogue, db);

  // Always return a promise.
  return Promise.resolve();
}
