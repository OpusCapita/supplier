import Sequelize from 'sequelize';

module.exports = function(sequelize) {
  const Country = sequelize.define('Country', {
    countryId: {
      type: Sequelize.STRING(2),
      primaryKey: true,
      field: "CountryID",
      validate: {
        is: /^[A-Z]{2}$/
      },
    },
    countryName: {
      type: Sequelize.STRING(20),
      field: "CountryName",
      allowNull: false
    }

  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'Country'
  });

  return Country;
};
