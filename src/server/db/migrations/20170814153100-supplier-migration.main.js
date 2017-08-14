const Sequelize = require("sequelize");

module.exports = {

  up: function(db) {
    var queryInterface = db.getQueryInterface();
    var dataTypeOrOptions = { type: Sequelize.STRING(50), allowNull: false };

    return queryInterface.changeColumn('Supplier', 'VatIdentificationNo', dataTypeOrOptions);
  },

  down: function(db) {

    var queryInterface = db.getQueryInterface();
    var dataTypeOrOptions = { type: Sequelize.STRING(50), allowNull: true };

    return queryInterface.changeColumn('Supplier', 'VatIdentificationNo', dataTypeOrOptions);
  }
};
