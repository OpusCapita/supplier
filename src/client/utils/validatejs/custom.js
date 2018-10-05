const { VAT, IBAN, BIC, DUNS, GLN, OVT, ISR } = require('@opuscapita/field-validators');

module.exports.vatNumber = function(validate) {
  return validate.validators.vatNumber = function(value, options, key, attributes) {
    if (!value) return null;

    if (VAT.isValid(value)) return null;

    return options.message;
  };
};

module.exports.iban = function(validate) {
  return validate.validators.iban = function(value, options, key, attributes) {
    if (!value) return null;

    if (IBAN.isValid(value)) return null;

    return options.message;
  };
};

module.exports.bic = function(validate) {
  return validate.validators.bic = function(value, options, key, attributes) {
    if (!value) return null;

    if (BIC.isValid(value)) return null;

    return options.message;
  };
};

module.exports.dunsNumber = function(validate) {
  return validate.validators.dunsNumber = function(value, options, key, attributes) {
    if (!value) return null;

    if (DUNS.isValid(value)) return null;

    return options.message;
  };
};

module.exports.globalLocationNumber = function(validate) {
  return validate.validators.globalLocationNumber = function(value, options, key, attributes) {
    if (!value) return null;

    if (GLN.isValid(value)) return null;

    return options.message;
  };
};

module.exports.ovtNumber = function(validate) {
  return validate.validators.ovtNumber = function(value, options, key, attributes) {
    if (!value) return null;

    if (OVT.isValid(value)) return null;

    return options.message;
  };
};

module.exports.isrNumber = function(validate) {
  return validate.validators.isrNumber = function(value, options, key, attributes) {
    if (!value) return null;

    if (ISR.isValid(value)) return null;

    return options.message;
  };
};

module.exports.uniqueIdentifier = function(validate) {
  return validate.validators.uniqueIdentifier = function(value, options, key, attributes) {
    if (value) return null;

    const uniqueIdentifier = require('../../../server/utils/validators/uniqueIdentifier.js');

    const fields = [
      attributes.vatIdentificationNo,
      attributes.dunsNo,
      attributes.globalLocationNo,
      attributes.ovtNo,
      attributes.iban,
      attributes.accountNumber,
      attributes.bankgiro,
      attributes.plusgiro
    ];

    if (uniqueIdentifier.isValid(fields)) return null;

    return options.message;
  };
};

module.exports.bicRequired = function(validate) {
  return validate.validators.bicRequired = function(value, options, key, attributes) {
    if (!attributes.accountNumber) return null;

    if (value && attributes.accountNumber) return null;

    return options.message;
  };
};
