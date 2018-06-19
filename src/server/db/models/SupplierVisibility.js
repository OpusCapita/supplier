'use strict';
const Sequelize = require('sequelize');

module.exports.init = function(db) {
  /**
   * SupplierVisibility.
   * @class SupplierVisibility
   */
  let SupplierVisibility = db.define('SupplierVisibility',
  /** @lends SupplierVisibility */
  {
    /** Unique identifier */
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    supplierId: {
      type: Sequelize.STRING(30),
      allowNull: false
    },
    contacts: {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: 'public',
      validate: {
        isIn: [['public', 'private', 'businessPartners']]
      }
    },
    bankAccounts: {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: 'public',
      validate: {
        isIn: [['public', 'private', 'businessPartners']]
      }
    },
    createdOn: {
      type: Sequelize.DATE(),
      allowNull: false
    },
    changedOn: {
      type: Sequelize.DATE(),
      allowNull: false
    }
  }, {
    updatedAt: 'changedOn',
    createdAt: 'createdOn',
    timestamps: true,
    freezeTableName: true,
    tableName: 'SupplierVisibility'
  });

  return Promise.resolve();
};
