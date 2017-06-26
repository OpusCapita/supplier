'use strict';
const Sequelize = require('sequelize');

module.exports = function(sequelize, config) {

  /**
   * @class BankAccount
   */
  return sequelize.define('BankAccount',

  /** @lends BankAccount */
  {
    /** internal identifier */
    id: {
      field: 'BankAccountSN',
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    /** owner object type */
    ownerObjectType: {
      field: 'OwnerObjectType',
      type: Sequelize.STRING(200),
      allowNull: true,
      validate: {
        notEmpty: true
      }
    },
      /** owner object id */
    ownerObjectId: {
      field: 'OwnerObjectID',
      type: Sequelize.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
      /** bank code */
    bankCode: {
      field: 'BankCode',
      type: Sequelize.STRING(12),
      validate: {
        notEmpty: true
      }
    },
      /** bank name */
    bankName: {
      field: 'BankName',
      type: Sequelize.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
      /** bank branch code */
    bankBranchCode: {
      field: 'BankBranchCode',
      type: Sequelize.STRING(6),
      validate: {
        notEmpty: true
      }
    },
      /** country id */
    countryId: {
      field: 'CountryID',
      type: Sequelize.STRING(2),
      validate: {
        notEmpty: true
      }
    },
    /** city */
    city: {
      field: 'City',
      type: Sequelize.STRING(50),
      validate: {
        notEmpty: true
      }
    },
    /** IBAN - international bank account number */
    iban: {
      field: 'IBAN',
      type: Sequelize.STRING(43),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    /** swift code - a standard format of Bank Identifier Codes (BIC) */
    swiftCode: {
      field: 'SwiftCode',
      type: Sequelize.STRING(11),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    /** type */
    type: {
      field: 'Type',
      type: Sequelize.STRING(30),
      validate: {
        notEmpty: true
      }
    },
    /** account number */
    accountNo: {
      field: 'AccountNo',
      type: Sequelize.STRING(12),
      validate: {
        notEmpty: true
      }
    },
    /** currency id */
    currencyId: {
      field: 'CurrencyID',
      type: Sequelize.STRING(3),
      validate: {
        notEmpty: true
      }
    },
    /** created on */
    createdOn: {
      field: 'CreatedOn',
      type: Sequelize.DATE,
      allowNull: false
    },
    /** created by */
    createdBy: {
      field: 'CreatedBy',
      type: Sequelize.STRING(60),
      allowNull: false
    },
    /** changed on */
    changedOn: {
      field: 'ChangedOn',
      type: Sequelize.DATE,
      allowNull: false
    },
    /** changed by */
    changedBy: {
      field: 'ChangedBy',
      type: Sequelize.STRING(60),
      allowNull: false
    }
  }, {
    updatedAt: 'changedOn',
    createdAt: 'createdOn',
    timestamps: true,
    freezeTableName: true,
    tableName: 'BankAccount'
  });
};
