const Sequelize = require("sequelize");

module.exports = {

  up: function(db) {
    var queryInterface = db.getQueryInterface();

    return Promise.all([
      queryInterface.changeColumn('SupplierBankAccount', 'BankIdentificationCode', { allowNull: true, type: Sequelize.STRING(15) }),
      queryInterface.changeColumn('SupplierBankAccount', 'SwiftCode', { allowNull: true, type: Sequelize.STRING(11) }),
      queryInterface.changeColumn('SupplierBankAccount', 'BankCode', { allowNull: true, type: Sequelize.STRING(12) }),
      queryInterface.changeColumn('SupplierBankAccount', 'BankName', { allowNull: true, type: Sequelize.STRING(50) }),
    ]);
  },

  down: function(db) {

    var queryInterface = db.getQueryInterface();

    return Promise.all([
      queryInterface.changeColumn('SupplierBankAccount', 'BankIdentificationCode', { allowNull: false, type: Sequelize.STRING(15) }),
      queryInterface.changeColumn('SupplierBankAccount', 'SwiftCode', { allowNull: false, type: Sequelize.STRING(11) }),
      queryInterface.changeColumn('SupplierBankAccount', 'BankCode', { allowNull: false, type: Sequelize.STRING(12) }),
      queryInterface.changeColumn('SupplierBankAccount', 'BankName', { allowNull: false, type: Sequelize.STRING(50) }),
    ]);
  }
};
