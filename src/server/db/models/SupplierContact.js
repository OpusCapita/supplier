'use strict';
const Sequelize = require('sequelize');

module.exports.init = function(db, config) {
  /**
   * SupplierContact - Contact information for a supplier.
   * @class SupplierContact
   */
  let SupplierContact = db.define('SupplierContact',
  /** @lends SupplierContact */
  {
    /** Unique identifier */
    id: {
      type: Sequelize.STRING(50),
      primaryKey: true,
      allowNull: false,
      validate: {
        notEmpty: true
      },
      field: 'ID'
    },
    title: {
      type: Sequelize.STRING(20),
      field: 'Title'
    },
    contactType: {
      type: Sequelize.STRING(10),
      field: 'ContactType'
    },
    firstName: {
      type: Sequelize.STRING(100),
      allowNull: false,
      field: 'FirstName'
    },
    lastName: {
      type: Sequelize.STRING(100),
      allowNull: false,
      field: 'LastName'
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: false,
      field: 'Email',
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: Sequelize.STRING(20),
      field: 'Phone'
    },
    mobile: {
      type: Sequelize.STRING(20),
      field: 'Mobile'
    },
    department: {
      type: Sequelize.STRING(100),
      field: 'Department'
    },
    fax: {
      type: Sequelize.STRING(20),
      field: 'Fax'
    },
    supplierId: {
      type: Sequelize.STRING(30),
      field: 'SupplierId'
    },
    isLinkedToUser: {
      type: Sequelize.BOOLEAN,
      field: 'IsLinkedToUser',
      defaultValue: false
    },
    changedBy: {
      type: Sequelize.STRING(60),
      field: 'ChangedBy'
    },
    createdBy: {
      type: Sequelize.STRING(60),
      field: 'CreatedBy'
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    updatedAt: 'changedOn',
    createdAt: 'createdOn',
    timestamps: true,
    freezeTableName: true,
    tableName: 'SupplierContact'
  });

  return Promise.resolve();
};
