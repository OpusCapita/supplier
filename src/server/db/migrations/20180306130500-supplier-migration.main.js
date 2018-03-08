const Sequelize = require("sequelize");

module.exports = {

  up: function(db) {
    var queryInterface = db.getQueryInterface();

    return Promise.all([
      queryInterface.renameColumn('Supplier', 'SupplierID', 'ID'),
      queryInterface.renameColumn('Supplier', 'SupplierName', 'Name')
    ]);
  },

  down: function(db) {

    var queryInterface = db.getQueryInterface();

    return Promise.all([
      queryInterface.renameColumn('Supplier', 'ID', 'SupplierID'),
      queryInterface.renameColumn('Supplier', 'Name', 'SupplierName')
    ]);
  }
};
