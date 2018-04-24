const Sequelize = require("sequelize");

module.exports = {

  up: function(db) {
    var queryInterface = db.getQueryInterface();

    return queryInterface.addColumn('Supplier', 'CurrencyId', { type: Sequelize.STRING(3), allowNull: true });
  },

  down: function(db) {

    var queryInterface = db.getQueryInterface();

    return queryInterface.removeColumn('Supplier', 'CurrencyId');
  }
};
