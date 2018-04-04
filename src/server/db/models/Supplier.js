'use strict';
const Sequelize = require('sequelize');
const { VAT, DUNS, GLN } = require('@opuscapita/field-validators');

module.exports.init = function(db) {
  /**
   * Supplier - organization that provides Products to buyers.
   * @class Supplier
   */
  let Supplier = db.define('Supplier',
  /** @lends Supplier */
  {
    /** Unique identifier */
    id: {
      type: Sequelize.STRING(30),
      primaryKey: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        is: ["[a-zA-Z_\\-0-9]+"]
      },
      field: "ID"
    },
    supplierId: {
      type: Sequelize.VIRTUAL,
      get: function() {
        const id = this.getDataValue('id');
        this.setDataValue('supplierId', id)
        return id;
      }
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING(100),
      field: "Name",
      validate: {
        notEmpty: true
      }
    },
    supplierName: {
      type: Sequelize.VIRTUAL,
      get: function() {
        const name = this.getDataValue('name');
        this.setDataValue('supplierName', name)
        return name;
      }
    },
    foundedOn: {
      allowNull: true,
      type: Sequelize.DATE(),
      field: "FoundedOn"
    },
    legalForm: {
      allowNull: true,
      type: Sequelize.STRING(250),
      field: "LegalForm"
    },
    commercialRegisterNo: {
      allowNull: true,
      type: Sequelize.STRING(250),
      field: "CommercialRegisterNo"
    },
    /** A supplier's city of registration */
    cityOfRegistration: {
      allowNull: false,
      type: Sequelize.STRING(250),
      field: "CityOfRegistration",
      validate: {
        notEmpty: true
      }
    },
    /** A supplier's country of registration as in ISO 3166-1 alpha2 */
    countryOfRegistration: {
      allowNull: false,
      type: Sequelize.STRING(250),
      field: "CountryOfRegistration",
      validate: {
        notEmpty: true
      }
    },
    /** A Tax Identification Number or TIN */
    taxIdentificationNo: {
      allowNull: true,
      type: Sequelize.STRING(250),
      field: "TaxIdentificationNo"
    },
    /** A value added tax identification number or VAT identification number (VATIN) */
    vatIdentificationNo: {
      allowNull: true,
      type: Sequelize.STRING(250),
      field: "VatIdentificationNo",
      validate: {
        isValid(value) {
          if (value.length === 0) return;

          if (VAT.isInvalid(value)) throw new Error('vatIdentificationNo value is invalid');
        }
      }
    },
    globalLocationNo: {
      allowNull: true,
      type: Sequelize.STRING(250),
      field: "GlobalLocationNo",
      validate: {
        isValid(value) {
          if (value.length === 0) return;

          if (GLN.isInvalid(value)) throw new Error('globalLocationNo value is invalid');
        }
      }
    },
    /** Company homepage url */
    homePage: {
      allowNull: true,
      type: Sequelize.STRING(250),
      field: "HomePage"
    },
    role: {
      allowNull: false,
      type: Sequelize.STRING(25),
      field: "Role"
    },
    /** Duns stands for 'Data Universal Numbering System'. It is a nine-digit number issued by D&B (Dun & Bradstreet) and assigned to each business location in the D&B database */
    dunsNo: {
      allowNull: true,
      type: Sequelize.STRING(250),
      field: "DUNSNo",
      validate: {
        isValid(value) {
          if (value.length === 0) return;

          if (DUNS.isInvalid(value)) throw new Error('dunsNo value is invalid');
        }
      }
    },
    status: {
      allowNull: true,
      type: Sequelize.STRING(100),
      field: "Status"
    },
    noVatReason: {
      allowNull: true,
      type: Sequelize.STRING(500),
      field: "NoVatReason"
    },
    rejectionReason: {
      allowNull: true,
      type: Sequelize.STRING(2000),
      field: "RejectionReason"
    },
    changedBy: {
      type: Sequelize.STRING(60),
      field: "ChangedBy"
    },
    createdBy: {
      type: Sequelize.STRING(60),
      field: "CreatedBy"
    },
    createdOn: {
      type: Sequelize.DATE,
      field: "CreatedOn"
    },
    changedOn: {
      type: Sequelize.DATE,
      field: "ChangedOn"
    }
  }, {
    getterMethods: {
      _objectLabel: function() {
        return this.supplierName ? this.supplierName + ' (' + this.supplierId + ')' : this.supplierId
      }
    },
    updatedAt: 'changedOn',
    createdAt: 'createdOn',
    timestamps: true,
    freezeTableName: true,
    tableName: 'Supplier' // needs to be just supplier in future
  });

  return Promise.resolve();
};
