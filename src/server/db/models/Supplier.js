'use strict';
const Sequelize = require('sequelize');
const { VAT, DUNS, GLN, OVT } = require('@opuscapita/field-validators');

module.exports.init = function(db, config) {
  /**
   * Supplier - organization that provides Products to buyers.
   * @class Supplier
   */
  let Supplier = db.define('Supplier',
  /** @lends Supplier */
  {
    /** Unique identifier. It is generated based on name field by stripping spaces and invalid special
    chars and if required, a number is appended for uniqueness, e.g. OpusCapita Software GmbH -> OpuscapitaSoftwareGmbh */
    id: {
      type: Sequelize.STRING(30),
      primaryKey: true,
      allowNull: false,
      validate: {
        isValid(value) {
          if (value.match(/^[a-zA-Z]+[a-zA-Z0-9-]*[a-zA-Z0-9]+$/g)) return;

          throw new Error('ID is invalid. Only characters, hyphens and numbers are allowed. may not start with number or hyphen.');
        }
      },
      field: "ID"
    },
    /** Deprecated. Same as id. */
    supplierId: {
      type: Sequelize.VIRTUAL,
      get: function() {
        const id = this.getDataValue('id');
        this.setDataValue('supplierId', id)
        return id;
      }
    },
    /** supplier id of parent company */
    parentId: {
      allowNull: true,
      type: Sequelize.STRING(30),
      field: "ParentId"
    },
    /** supplier ids of all parent companies in descending order, seperated by special character | */
    hierarchyId: {
      allowNull: true,
      type: Sequelize.STRING(900),
      field: "HierarchyId"
    },
    /** Company name */
    name: {
      allowNull: false,
      type: Sequelize.STRING(100),
      field: "Name",
      validate: {
        notEmpty: true
      }
    },
    /** Deprecated. Same as name. */
    supplierName: {
      type: Sequelize.VIRTUAL,
      get: function() {
        const name = this.getDataValue('name');
        this.setDataValue('supplierName', name)
        return name;
      }
    },
    /** Date of establishment */
    foundedOn: {
      allowNull: true,
      type: Sequelize.DATE(),
      field: "FoundedOn"
    },
    /** company legal form. E.g. Gmbh, AG for Germany*/
    legalForm: {
      allowNull: true,
      type: Sequelize.STRING(250),
      field: "LegalForm"
    },
    /** Companies are usually registered officially into a commercial register or trading register.
    The actual rules differ by country but generally allow to uniquely identify a company and
    inspect some of the related information in a public register. */
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
    /** A supplier's default currency as in ISO 4217 ID of currency */
    currencyId: {
      allowNull: true,
      type: Sequelize.STRING(3),
      field: "CurrencyId"
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
    /** A Global Location Number (GLN) is a unique number that is assigned to locations to enable them to be identified uniquely worldwide. See https://en.wikipedia.org/wiki/Global_Location_Number */
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
    /** The Finnish Party Identification number (OVT-number) is a 12-17 digit number and it is generated from Business ID. */
    ovtNo: {
      allowNull: true,
      type: Sequelize.STRING(250),
      field: 'OVTNo',
      validate: {
        isValid(value) {
          if (value.length === 0) return;

          if (OVT.isInvalid(value)) throw new Error('ovtNo value is invalid');
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
    subEntityCode: {
      allowNull: true,
      type: Sequelize.STRING(30),
      field: 'SubEntityCode'
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
      type: Sequelize.DATE(),
      field: "CreatedOn"
    },
    changedOn: {
      type: Sequelize.DATE(),
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
