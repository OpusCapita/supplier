'use strict';
const Sequelize = require('sequelize');
const vatNumber = require('../../utils/validators/vatNumber.js');

module.exports = function(sequelize) {
  /**
   * Supplier - organization that provides Products to buyers.
   * @class Supplier
   */
  let Supplier = sequelize.define('Supplier',
  /** @lends Supplier */
  {
    /** Unique identifier */
    supplierId: {
      type: Sequelize.STRING(30),
      primaryKey: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        is: ["[a-zA-Z_\\-0-9]+"]
      },
      field: "SupplierID"
    },
    supplierName: {
      allowNull: true,
      type: Sequelize.STRING(50),
      field: "SupplierName"
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
      allowNull: true,
      type: Sequelize.STRING(250),
      field: "CityOfRegistration"
    },
    /** A supplier's country of registration as in ISO 3166-1 alpha2 */
    countryOfRegistration: {
      allowNull: true,
      type: Sequelize.STRING(250),
      field: "CountryOfRegistration"
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
          if (vatNumber.isInvalid(value)) throw new Error('vatIdentificationNo value is invalid');
        }
      }
    },
    globalLocationNo: {
      allowNull: true,
      type: Sequelize.STRING(250),
      field: "GlobalLocationNo"
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
      field: "DUNSNo"
    },
    status: {
      allowNull: true,
      type: Sequelize.STRING(100),
      field: "Status"
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
    classMethods: {
      associate: function(models) {
        Supplier.hasMany(models.Address, {
          as: 'addresses',
          foreignKey: 'supplierId',
          onDelete: 'cascade'
        });
      }
    },
    updatedAt: 'changedOn',
    createdAt: 'createdOn',
    timestamps: true,
    freezeTableName: true,
    tableName: 'Supplier' // needs to be just supplier in future
  });

  return Supplier;
};
