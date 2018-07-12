const custom = require('../../utils/validatejs/custom.js');
const customAsync = require('../../utils/validatejs/customAsync.js');
const validatejs = require('validate.js');

module.exports.validate = function() {
  custom.iban(validatejs);
  custom.bic(validatejs);
  custom.isrNumber(validatejs);
  customAsync.ibanExists(validatejs);

  return validatejs;
};
