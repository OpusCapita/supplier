const Sequelize = require("sequelize");

module.exports = {

  up: function(db) {
    var queryInterface = db.getQueryInterface();

    return queryInterface.addColumn('SupplierBankAccount', 'ISRNumber', { type: Sequelize.STRING(9), allowNull: true });
  },

  down: function(db) {

    var queryInterface = db.getQueryInterface();

    return queryInterface.removeColumn('SupplierBankAccount', 'ISRNumber');
  }
};
