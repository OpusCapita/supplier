const Sequelize = require("sequelize");

module.exports = {

  up: function (db) {
    let queryInterface = db.getQueryInterface();

    return queryInterface.createTable('Capability', {

      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      changedOn: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: function (db) {
    let queryInterface = db.getQueryInterface();
    return queryInterface.dropTable('Capability');
  }
};
