const Sequelize = require("sequelize");

module.exports = {

  up: function(db) {
    var queryInterface = db.getQueryInterface();

    return queryInterface.changeColumn('SupplierBankAccount', 'ISRNumber', { allowNull: true, type: Sequelize.STRING(11) });
  },

  down: function(db) {

    var queryInterface = db.getQueryInterface();

    return queryInterface.changeColumn('SupplierBankAccount', 'ISRNumber', { allowNull: false, type: Sequelize.STRING(9) });
  }
};
