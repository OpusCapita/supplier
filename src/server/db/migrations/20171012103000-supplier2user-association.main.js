const Sequelize = require("sequelize");

module.exports = {

  up: function(db) {
    var queryInterface = db.getQueryInterface();

    return Promise.all([
      queryInterface.changeColumn('Supplier2User', 'supplierId',
      {
        type: Sequelize.STRING(30),
        references: {
          model: 'Supplier',
          key: 'SupplierID'
        }
      }
    ),
    queryInterface.addColumn('Supplier2User', 'testcolumn', { type: Sequelize.STRING(1000) })

    ])
},

  down: function(db) {
    var queryInterface = db.getQueryInterface();

    return Promise.all([
      queryInterface.changeColumn('Supplier2User', 'supplierId'),
      queryInterface.removeColumn('Supplier2User', 'testcolumn')

    ])

  }
};
