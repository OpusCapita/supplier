const Sequelize = require("sequelize");

module.exports = {

  up: function(db) {
    var queryInterface = db.getQueryInterface();

    return Promise.all([
      queryInterface.addColumn('SupplierBankAccount', 'Bankgiro', { type: Sequelize.STRING(100), allowNull: true }),
      queryInterface.addColumn('SupplierBankAccount', 'Plusgiro', { type: Sequelize.STRING(100), allowNull: true })
    ]);
  },

  down: function(db) {

    var queryInterface = db.getQueryInterface();

    return Promise.all([
      queryInterface.removeColumn('SupplierBankAccount', 'Bankgiro'),
      queryInterface.removeColumn('SupplierBankAccount', 'Plusgiro'),
    ]);
  }
};
