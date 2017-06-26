'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const Promise = require('bluebird');

const Address = require('./Address');
const BankAccount = require('./BankAccount');
const Certification = require('./Certification');
const CertificationGroup = require('./CertificationGroup');
const Country = require('./Country');
const Supplier = require('./Supplier');
const Supplier2Address = require('./Supplier2Address');
const SupplierCertification = require('./SupplierCertification');
const SupplierContact = require('./SupplierContact');
const SupplierFinancials = require('./SupplierFinancials');
const TradingPartner = require('./TradingPartner');
const User2Supplier = require('./User2Supplier');

module.exports.init = function(db, config)
{
  // Register Sequelize database models here.
  // Use require in order to separate models into multiple js files.
  // http://docs.sequelizejs.com/en/latest/api/model/
  //
  // db.define(...);

  db.import('Address', Address);
  db.import('BankAccount', BankAccount);
  db.import('Certification', Certification);
  db.import('CertificationGroup', CertificationGroup);
  db.import('Country', Country);
  db.import('Supplier', Supplier);
  db.import('Supplier2Address', Supplier2Address);
  db.import('SupplierCertification', SupplierCertification);
  db.import('SupplierContact', SupplierContact);
  db.import('SupplierFinancials', SupplierFinancials);
  db.import('TradingPartner', TradingPartner);
  db.import('User2Supplier', User2Supplier);
  db.import('Address', Address);
  db.import('Address', Address);


  // Always return a promise.
  return Promise.resolve();
}
