const Sequelize = require("sequelize");

module.exports = {

  up: function(db) {
    var queryInterface = db.getQueryInterface();

    return queryInterface.changeColumn('SupplierBankAccount', 'AccountNumber', { allowNull: true, type: Sequelize.STRING(35) });
  },

  down: function(db) {

    var queryInterface = db.getQueryInterface();

    return queryInterface.changeColumn('SupplierBankAccount', 'AccountNumber', { allowNull: false, type: Sequelize.STRING(35) });
  }
};
