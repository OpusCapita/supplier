'use strict';
const Sequelize = require('sequelize');

module.exports.init = function(db, config) {
  /**
   * SupplierAddress - Address information for a supplier.
   * @class SupplierAddress
   */
  let SupplierAddress = db.define('SupplierAddress',
  /** @lends SupplierAddress */
  {
    /** Unique identifier */
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
    type: {
      type: Sequelize.STRING(10),
      allowNull: false,
      field: "Type",
      defaultValue: "default",
      validate: {
        isIn: [['default', 'invoice', 'rma', 'plant']]
      }
    },
    name: {
      type: Sequelize.STRING(100),
      field: 'Name',
      allowNull: true
    },
    street1: {
      type: Sequelize.STRING(50),
      field: 'Street1',
      allowNull: true
    },
    street2: {
      type: Sequelize.STRING(100),
      field: 'Street2',
      allowNull: true
    },
    street3: {
      type: Sequelize.STRING(100),
      field: 'Street3',
      allowNull: true
    },
    zipCode: {
      type: Sequelize.STRING(10),
      field: 'ZipCode',
      allowNull: true
    },
    city: {
      type: Sequelize.STRING(50),
      field: 'City',
      allowNull: true
    },
    poboxZipCode: {
      type: Sequelize.STRING(10),
      field: 'POBoxZipCode',
      allowNull: true
    },
    pobox: {
      type: Sequelize.STRING(10),
      field: 'POBox',
      allowNull: true
    },
    areaCode: {
      type: Sequelize.STRING(10),
      field: 'AreaCode',
      allowNull: true
    },
    phoneNo: {
      type: Sequelize.STRING(50),
      field: 'PhoneNo',
      allowNull: true
    },
    faxNo: {
      type: Sequelize.STRING(50),
      field: 'FaxNo',
      allowNull: true
    },
    email: {
      type: Sequelize.STRING(1024),
      field: 'EMail',
      allowNull: true,
      validate: {
        isEmail: true
      }

    },
    corporateURL: {
      type: Sequelize.STRING(1024),
      field: 'CorporateURL',
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    numOfEmployees: {
      type: Sequelize.INTEGER,
      field: 'NumOfEmployees',
      allowNull: true
    },
    countryId: {
      type: Sequelize.STRING(2),
      field: 'CountryID',
      allowNull: true
    },
    state: {
      type: Sequelize.STRING(50),
      field: 'State',
      allowNull: true
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
    updatedAt: 'changedOn',
    createdAt: 'createdOn',
    timestamps: true,
    freezeTableName: true,
    tableName: 'SupplierAddress'
  });

  return Promise.resolve();
};
