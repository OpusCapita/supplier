const Sequelize = require("sequelize");

module.exports = {

  up: function (db) {
    let queryInterface = db.getQueryInterface();

    return queryInterface.createTable('SupplierVisibility', {

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
        defaultValue: 'private'
      },

      bankAccounts: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'private'
      },

      createdOn: {
        type: Sequelize.DATE(),
        allowNull: true,
        defaultValue: Sequelize.fn('NOW')
      },

      changedOn: {
        type: Sequelize.DATE(),
        allowNull: true,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  down: function (db) {
    let queryInterface = db.getQueryInterface();
    return queryInterface.dropTable('SupplierVisibility');
  }
};
