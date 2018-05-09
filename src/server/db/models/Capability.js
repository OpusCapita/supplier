'use strict';
const Sequelize = require('sequelize');

module.exports.init = function(db) {
  /**
   * Capability.
   * @class Capability
   */
  let Capability = db.define('Capability',
  /** @lends Capability */
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    supplierId: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    capabilityId: {
      type: Sequelize.STRING(50),
      allowNull: false
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
    tableName: 'Capability'
  });

  return Promise.resolve();
};
