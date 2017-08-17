const Sequelize = require("sequelize");

module.exports = {

  up: function(db) {
    var queryInterface = db.getQueryInterface();

    return Promise.all([
      db.query('ALTER TABLE `supplier`.`SupplierAddress` DROP KEY AddressID;'),
      queryInterface.renameColumn('SupplierAddress', 'AddressSN', 'ID'),
      queryInterface.renameColumn('SupplierContact', 'ContactId', 'ID'),
      db.query('ALTER TABLE `supplier`.`SupplierBankAccount` DROP KEY BankAccountID;')
    ]);
  },

  down: function(db) {

    var queryInterface = db.getQueryInterface();

    return Promise.all([
      queryInterface.addColumn('SupplierAddress', 'AddressID', { type: Sequelize.STRING(50), allowNull: false, unique: true }),
      queryInterface.renameColumn('SupplierAddress', 'ID', 'AddressSN'),
      queryInterface.renameColumn('SupplierContact', 'ID', 'ContactId'),
      queryInterface.addColumn('SupplierBankAccount', 'BankAccountID', { type: Sequelize.STRING(50), allowNull: false, unique: true })
    ]);
  }
};
