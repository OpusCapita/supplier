const { Supplier, BankAccount } = require('../../api');
const supplierApi = new Supplier();
const bankAccountApi = new BankAccount();

module.exports.supplierNameExists = function(validate) {
  return validate.validators.supplierNameExists = function(value, options, key, attributes) {
    let queryParams = { name: value };

    return recordExists(value, validate, queryParams, options.message, attributes.id);
  };
};

module.exports.vatNumberExists = function(validate) {
  return validate.validators.vatNumberExists = function(value, options, key, attributes) {
    let queryParams = { vatIdentificationNo: value, parentId: attributes.parentId || attributes.id, notEqual: true };

    return recordExists(value, validate, queryParams, options.message, attributes.id);
  };
};

module.exports.dunsNumberExists = function(validate) {
  return validate.validators.dunsNumberExists = function(value, options, key, attributes) {
    let queryParams = { dunsNo: value };

    return recordExists(value, validate, queryParams, options.message, attributes.id);
  };
};

module.exports.ovtNumberExists = function(validate) {
  return validate.validators.ovtNumberExists = function(value, options, key, attributes) {
    let queryParams = { ovtNo: value };

    return recordExists(value, validate, queryParams, options.message, attributes.id);
  };
};

module.exports.globalLocationNumberExists = function(validate) {
  return validate.validators.globalLocationNumberExists = function(value, options, key, attributes) {
    let queryParams = { globalLocationNo: value }

    return recordExists(value, validate, queryParams, options.message, attributes.id);
  };
};

module.exports.ibanExists = function(validate) {
  return validate.validators.ibanExists = function(value, options, key, attributes) {
    let queryParams = { iban: value }

    return recordExists(value, validate, queryParams, options.message, attributes.supplierId);
  };
};

module.exports.taxIdNumberExists = function(validate) {
  return validate.validators.taxIdNumberExists = function(value, options, key, attributes) {
    let queryParams = {
      taxIdentificationNo: attributes.taxIdentificationNo,
      cityOfRegistration: attributes.cityOfRegistration
    };

    return recordExists(attributes.taxIdentificationNo, validate, queryParams, options.message, attributes.id);
  };
};

module.exports.registerationNumberExists = function(validate) {
  return validate.validators.registerationNumberExists = function(value, options, key, attributes) {
    let queryParams = {
      commercialRegisterNo: attributes.commercialRegisterNo,
      cityOfRegistration: attributes.cityOfRegistration,
      countryOfRegistration: attributes.countryOfRegistration
    };

    return recordExists(attributes.commercialRegisterNo, validate, queryParams, options.message, attributes.id);
  };
};

module.exports.subEntityCodeExists = function(validate) {
  return validate.validators.subEntityCodeExists = function(value, options, key, attributes) {
    let queryParams = {
      subEntityCode: attributes.subEntityCode,
      parentId: attributes.parentId,
      vatIdentificationNo: attributes.vatIdentificationNo
    };

    return recordExists(attributes.subEntityCode, validate, queryParams, options.message, attributes.id);
  };
};

module.exports.uniqueIdentifierWithBankAccount = function(validate) {
  return validate.validators.uniqueIdentifierWithBankAccount = function(value, options, key, attributes) {
    return new validate.Promise((resolve, reject) => {
      const uniqueIdentifier = require('../../../server/utils/validators/uniqueIdentifier.js');
      const fields = [attributes.vatIdentificationNo, attributes.dunsNo, attributes.globalLocationNo, attributes.ovtNo];
      if (uniqueIdentifier.isValid(fields)) { resolve(); return; }

      if (!attributes.id) { resolve(); return; }

      bankAccountApi.getBankAccounts(attributes.id).then(accounts => {
        if (accounts.length > 0) {
          resolve();
        } else {
          resolve(options.message);
        }
      }).catch(error => reject());
    });
  };
};

let recordExists = function(value, validate, queryParams, errorMessage, supplierId) {
  return new validate.Promise((resolve, reject) => {
    if (!value) { resolve(); return; }

    if (supplierId) queryParams.id = supplierId;

    supplierApi.supplierExists(queryParams).then(supplier => {
      if (supplier) {
        resolve(errorMessage);
      } else {
        resolve();
      }
    }).catch(error => reject());
  });
};
