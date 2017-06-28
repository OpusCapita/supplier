module.exports.vatNumber = function(validate) {
  return validate.validators.vatNumber = function(value, options, key, attributes) {
    if (!value) return null;

    const vatNumberValidator = require('../../../server/utils/validators/vatNumber.js');

    if (vatNumberValidator.isValid(value)) return null;

    return options.message;
  };
};

module.exports.iban = function(validate) {
  return validate.validators.iban = function(value, options, key, attributes) {
    if (!value) return null;

    const IBAN = require('../../../server/utils/validators/iban.js');

    if (IBAN.isValid(value)) return null;

    return options.message;
  };
};

module.exports.bic = function(validate) {
  return validate.validators.bic = function(value, options, key, attributes) {
    if (!value) return null;

    const BIC = require('../../../server/utils/validators/bic.js');

    if (BIC.isValid(value)) return null;

    return options.message;
  };
};
