const Sequelize = require("sequelize");

module.exports = {

  up: function(db) {
    var queryInterface = db.getQueryInterface();

    return queryInterface.changeColumn('Supplier', 'SupplierName', { allowNull: false, type: Sequelize.STRING(100) });
  },

  down: function(db) {

    var queryInterface = db.getQueryInterface();

    return queryInterface.changeColumn('Supplier', 'SupplierName', { allowNull: false, type: Sequelize.STRING(50) });
  }
};
