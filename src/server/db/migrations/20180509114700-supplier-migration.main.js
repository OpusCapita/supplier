const Sequelize = require("sequelize");

module.exports = {

  up: function(db) {
    var queryInterface = db.getQueryInterface();

    return Promise.all([
      queryInterface.addColumn('Supplier', 'SubEntityCode', { type: Sequelize.STRING(30), allowNull: true }),
      queryInterface.addColumn('Supplier', 'OVTNo', { type: Sequelize.STRING(250), allowNull: true })
    ]);
  },

  down: function(db) {

    var queryInterface = db.getQueryInterface();

    return Promise.all([
      queryInterface.removeColumn('Supplier', 'SubEntityCode'),
      queryInterface.removeColumn('Supplier', 'OVTNo'),
    ]);
  }
};
