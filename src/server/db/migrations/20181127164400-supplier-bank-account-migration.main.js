const Sequelize = require("sequelize");

module.exports = {

  up: function(db) {
    var queryInterface = db.getQueryInterface();

    return queryInterface.removeColumn('SupplierBankAccount', 'SwiftCode');
  },

  down: function(db) {

    var queryInterface = db.getQueryInterface();

    return queryInterface.addColumn('SupplierBankAccount', 'SwiftCode', { type: Sequelize.STRING(11), allowNull: true });
  }
};
