'use strict';
const Sequelize = require('sequelize');

module.exports.init = function(db) {
  /**
   * Supplier2User.
   * @class Supplier2User
   */
  let Supplier2User = db.define('Supplier2User',
  /** @lends Supplier2User */
  {
    /** Unique identifier */
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    supplierId: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    userId: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    status: {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: 'requested',
      validate: {
        isIn: [['requested', 'approved', 'rejected']]
      }
    },
    accessReason: {
      type: Sequelize.STRING(1000)
    },
    createdOn: {
      type: Sequelize.DATE,
      allowNull: false
    },
    changedOn: {
      type: Sequelize.DATE,
      allowNull: false
    }
  }, {
    updatedAt: 'changedOn',
    createdAt: 'createdOn',
    timestamps: true,
    freezeTableName: true,
    tableName: 'Supplier2User'
  });

  return Promise.resolve();
};
