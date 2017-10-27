const Sequelize = require("sequelize");

module.exports = {

  up: function(db) {
    var queryInterface = db.getQueryInterface();

    return queryInterface.addColumn('SupplierContact', 'IsLinkedToUser', { type: Sequelize.BOOLEAN, defaultValue: false });
  },

  down: function(db) {

    var queryInterface = db.getQueryInterface();

    return queryInterface.removeColumn('SupplierContact', 'IsLinkedToUser');
  }
};
