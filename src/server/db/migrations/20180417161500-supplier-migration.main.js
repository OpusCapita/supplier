const Sequelize = require("sequelize");

module.exports = {

  up: function(db) {
    var queryInterface = db.getQueryInterface();

    return Promise.all([
      queryInterface.addColumn('Supplier', 'ParentId', { type: Sequelize.STRING(30), allowNull: true }),
      queryInterface.addColumn('Supplier', 'HierarchyId', { type: Sequelize.STRING(900), allowNull: true })
    ]);
  },

  down: function(db) {

    var queryInterface = db.getQueryInterface();

    return Promise.all([
      queryInterface.removeColumn('Supplier', 'ParentId'),
      queryInterface.removeColumn('Supplier', 'HierarchyId'),
    ]);
  }
};
