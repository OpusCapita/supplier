const Sequelize = require("sequelize");

module.exports = {

  up: function(db) {
    var queryInterface = db.getQueryInterface();

    return queryInterface.addColumn('Supplier', 'managed', { type: Sequelize.BOOLEAN, defaultValue: true });
  },

  down: function(db) {

    var queryInterface = db.getQueryInterface();

    return queryInterface.removeColumn('Supplier', 'managed');
  }
};
