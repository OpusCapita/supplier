const pathjs = require('path');
const supplier2user = require(pathjs.resolve(__dirname + '/../data/supplier2user.json'));

/**
 * Inserts test data into existing database structures.
 * If all migrations were successul, this method will never be executed again.
 * To identify which migrations have successfully been processed, a migration's filename is used.
 *
 * @param {object} data - [Sequelize]{@link https://github.com/sequelize/sequelize} instance.
 * @param {object} config - A model property for database models and everything from [config.data]{@link https://github.com/OpusCapitaBusinessNetwork/db-init} passed when running the db-initialization.
 * @returns {Promise} [Promise]{@link http://bluebirdjs.com/docs/api-reference.html}
 * @see [Applying data migrations]{@link https://github.com/OpusCapitaBusinessNetwork/db-init#applying-data-migrations}
 */
module.exports.up = function(db, config)
{
  return db.queryInterface.bulkInsert('Supplier2User', supplier2user)
};

/**
 * Reverts all migrations for databse tables and data.
 * If the migration process throws an error, this method is called in order to revert all changes made by the up() method.
 *
 * @param {object} data - [Sequelize]{@link https://github.com/sequelize/sequelize} instance.
 * @param {object} config - A model property for database models and everything from [config.data]{@link https://github.com/OpusCapitaBusinessNetwork/db-init} passed when running the db-initialization.
 * @returns {Promise} [Promise]{@link http://bluebirdjs.com/docs/api-reference.html}
 * @see [Applying data migrations]{@link https://github.com/OpusCapitaBusinessNetwork/db-init#applying-data-migrations}
 */
module.exports.down = function(db, config)
{
  return db.queryInterface.bulkDelete('Supplier2User', { $in: supplier2user.map(rec => rec.supplierId)});
};
