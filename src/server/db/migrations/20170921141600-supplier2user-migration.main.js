const Sequelize = require("sequelize");

module.exports = {

  up: function(db) {
    var queryInterface = db.getQueryInterface();

    return queryInterface.addColumn('Supplier2User', 'accessReason', { type: Sequelize.STRING(1000) });
  },

  down: function(db) {
    var queryInterface = db.getQueryInterface();

    return queryInterface.removeColumn('Supplier2User', 'accessReason');
  }
};
