const Sequelize = require("sequelize");

module.exports = {

  up: function(db) {
    var queryInterface = db.getQueryInterface();
    var fields = [
      'SupplierName',
      'CityOfRegistration',
      'TaxIdentificationNo',
      'VatIdentificationNo',
      'CommercialRegisterNo',
      'DUNSNo',
      'GlobalLocationNo'
    ];

    return queryInterface.addIndex('Supplier', fields, { indexName: 'SupplierSearchIndex', indicesType: 'FULLTEXT' });
  },

  down: function(db) {
    var queryInterface = db.getQueryInterface();

    return queryInterface.removeIndex('Supplier', 'SupplierSearchIndex');
  }
};
