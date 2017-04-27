'use strict';

const Promise = require('bluebird');
const express = require('express');

const suppliers = require('./suppliers');
const supplierContacts = require('./supplier_contacts');
const supplierAddresses = require('./supplier_addresses');
const SupplierAddress = require('../queries/supplier_addresses');

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

  suppliers(app, db, config);
  supplierContacts(app, db, config);
  supplierAddresses(app, db, config);

  if (process.env.NODE_ENV === 'development') {
    const path = require('path');
    const exphbs = require('express-handlebars');

    app.use('/static', express.static(path.join(__dirname, '../static')));

    app.engine('handlebars', exphbs());
    app.set('view engine', 'handlebars');
    app.set('views', path.resolve(__dirname + '/../templates'));

    app.get('/', (req, res) => {
      res.render('index', {
        helpers: {
          json: JSON.stringify
        }
      });
    });
  }

  // Always return a promise.
  return Promise.resolve();
}
