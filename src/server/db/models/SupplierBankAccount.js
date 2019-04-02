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
      /** id of supplier having the bank account */
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
      /** Bank Country Key. It specifies the country in which the bank is located, as in ISO 3166-1 alpha2. E.g. DE for Germany. */
      bankCountryKey: {
        field: 'BankCountryKey',
        type: Sequelize.STRING(2)
      },
      /** The bank code is a code assigned by a central bank, a bank supervisory body or a Bankers Association in a country to all its licensed member banks or financial institutions. See https://en.wikipedia.org/wiki/Bank_code */
      bankCode: {
        field: 'BankCode',
        type: Sequelize.STRING(12),
      },
      /** Name of bank */
      bankName: {
        field: 'BankName',
        type: Sequelize.STRING(50)
      },
      /** The Bankgiro works with bankgiro number, which is an alias for a bank account. The Bankgiro offers structured remittance information. Creditor will be advised by his bank electronically and can enter the structured information for automatic reconciliation of his ledger. By issuing invoices with a Bankgiro number it is possible to pay the invoices for the payer and possible for the beneficiary to receive all the payments electronically and automatically reconcile the account receivables. See https://www.bankgirot.se/en/services/incoming-payments/bankgiro-number/ */
      bankgiro: {
        field: 'Bankgiro',
        type: Sequelize.STRING(30)
      },
      /** PlusGirot is a credit transfer function, which is part of Nordea, and used for mediating payments between accounts held by companies and individuals. The Plusgiro works with Plusgiro numbers, which are an address and a bank account in Nordea. By issuing invoices with a Plusgiro number it is possible to pay the invoices for the payer and possible for the beneficiary to receive all the payments electronically and reconcile the account receivables. */
      plusgiro: {
        field: 'Plusgiro',
        type: Sequelize.STRING(30)
      },
      /** A maximum 9-digit ISR party number under Swiss IBAN. Switzerland has special legal banking requirements such as to print ISR Payment Slip from sales Invoices. The ISR Payment Slip is an In-payment Slip with Reference Number (ISR or ESR in Swiss German) to facilitate customer to pay Invoice in Swiss Franc or in Euro in simple manner. References: https://www.six-group.com/interbank-clearing/dam/downloads/en/standardization/iso/swiss-recommendations/archives/swiss-usage-guide.pdf and https://advendio.atlassian.net/wiki/spaces/SO/pages/130195958/6.1.9+Generate+Swiss+ISR+Code+ESR+Code */
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
      /** External bank control key. It is the first two digits of the bank account number (IBAN). */
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
