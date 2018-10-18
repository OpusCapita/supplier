'use strict';
const Sequelize = require('sequelize');

module.exports.init = function(db, config) {
  /**
   * Supplier2User. This class is used to manage user access to supplier workflow
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
    /** supplier Id of the supplier the user wants access to */
    supplierId: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    /** user Id of the user requesting access to supplier */
    userId: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    /** status of the access request. It can be requested, approved, or rejected */
    status: {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: 'requested',
      validate: {
        isIn: [['requested', 'approved', 'rejected']]
      }
    },
    /** reason why the user wants access to the supplier */
    accessReason: {
      type: Sequelize.STRING(1000)
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
    tableName: 'Supplier2User'
  });

  return Promise.resolve();
};
