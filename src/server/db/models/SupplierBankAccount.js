'use strict';
const Sequelize = require('sequelize');
const { IBAN, BIC, ISR } = require('@opuscapita/field-validators');

module.exports.init = function (db, config) {
  /**
   * Supplier bank account.
   * @class SupplierBankAccount
   */
  let SupplierBankAccount = db.define('SupplierBankAccount',
    /** @lends SupplierBankAccount */
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'ID'
      },
      supplierId: {
        type: Sequelize.STRING(50),
        allowNull: false,
        field: 'SupplierID',
        unique: true,
        validate: {
          notEmpty: true
        }
      },
      /** The International Bank Account Number (IBAN) */
      accountNumber: {
        field: 'AccountNumber',
        type: Sequelize.STRING(35),
        validate: {
          isValid(value) {
            if (!value) return null;
            if (IBAN.isInvalid(value)) throw new Error('accountNumber value is invalid');
          }
        }
      },
      /** Bank Identifier Code (BIC) */
      bankIdentificationCode: {
        field: 'BankIdentificationCode',
        type: Sequelize.STRING(15),
        validate: {
          isValid(value) {
            if (!value) return null;
            if (BIC.isInvalid(value)) throw new Error('bankIdentificationCode value is invalid');
          }
        }
      },
      /** The bank's country as in ISO 3166-1 alpha2 */
      bankCountryKey: {
        field: 'BankCountryKey',
        type: Sequelize.STRING(2)
      },
      bankCode: {
        field: 'BankCode',
        type: Sequelize.STRING(12),
      },
      bankName: {
        field: 'BankName',
        type: Sequelize.STRING(50)
      },
      /** Number which is part of Swedish bank account details */
      bankgiro: {
        field: 'Bankgiro',
        type: Sequelize.STRING(30)
      },
      /** Number which is part of Swedish bank account details */
      plusgiro: {
        field: 'Plusgiro',
        type: Sequelize.STRING(30)
      },
      /** A maximum 9-digit ISR party number under Swiss IBAN. Switzerland has special legal banking
      requirements such as to print ISR Payment Slip from sales Invoices. The ISR Payment Slip is an
      In-payment Slip with Reference Number (ISR or ESR in Swiss German) to facilitate customer to
      pay Invoice in Swiss Franc or in Euro in simple manner.
      References: https://www.six-group.com/interbank-clearing/dam/downloads/en/standardization/iso/swiss-recommendations/archives/swiss-usage-guide.pdf
      and https://advendio.atlassian.net/wiki/spaces/SO/pages/130195958/6.1.9+Generate+Swiss+ISR+Code+ESR+Code */
      isrNumber: {
        field: 'ISRNumber',
        type: Sequelize.STRING(11),
        validate: {
          isValid(value) {
            if (!value) return null;
            if (ISR.isInvalid(value)) throw new Error('isrNumber value is invalid');
          }
        }
      },
      createdOn: {
        field: 'CreatedOn',
        type: Sequelize.DATE(),
        allowNull: false
      },
      createdBy: {
        field: 'CreatedBy',
        type: Sequelize.STRING(60),
        allowNull: false
      },
      changedOn: {
        field: 'ChangedOn',
        type: Sequelize.DATE(),
        allowNull: false
      },
      changedBy: {
        field: 'ChangedBy',
        type: Sequelize.STRING(60),
        allowNull: false
      },
      extBankControlKey: {
        field: 'ExtBankControlKey',
        type: Sequelize.STRING(2)
      }
    }, {
      updatedAt: 'changedOn',
      createdAt: 'createdOn',
      timestamps: true,
      freezeTableName: true,
      tableName: 'SupplierBankAccount'
    });

  return Promise.resolve();
};
