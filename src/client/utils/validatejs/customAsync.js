const request = require('superagent-bluebird-promise');
const url = '/supplier/api/suppliers/exists';



module.exports.vatNumberExists = function(validate) {
  return validate.validators.vatNumberExists = function(value, options, key, attributes) {
    let queryParams = { vatIdentificationNo: value };
    if (attributes['supplierId']) queryParams.supplierId = attributes['supplierId'];

    return recordExists(value, validate, queryParams, options.message);
  };
};

module.exports.dunsNumberExists = function(validate) {
  return validate.validators.dunsNumberExists = function(value, options, key, attributes) {
    let queryParams = { dunsNo: value };
    if (attributes['supplierId']) queryParams.supplierId = attributes['supplierId'];

    return recordExists(value, validate, queryParams, options.message);
  };
};

module.exports.globalLocationNumberExists = function(validate) {
  return validate.validators.globalLocationNumberExists = function(value, options, key, attributes) {
    let queryParams = { globalLocationNo: value }
    if (attributes['supplierId']) queryParams.supplierId = attributes['supplierId'];

    return recordExists(value, validate, queryParams, options.message);
  };
};

module.exports.taxIdNumberExists = function(validate) {
  return validate.validators.taxIdNumberExists = function(value, options, key, attributes) {
    let queryParams = {
      taxIdentificationNo: attributes['taxIdentificationNo'],
      countryOfRegistration: attributes['countryOfRegistration']
    };
    if (attributes['supplierId']) queryParams.supplierId = attributes['supplierId'];

    return recordExists(attributes['taxIdentificationNo'], validate, queryParams, options.message);
  };
};

module.exports.registerationNumberExists = function(validate) {
  return validate.validators.registerationNumberExists = function(value, options, key, attributes) {
    let queryParams = {
      commercialRegisterNo: attributes['commercialRegisterNo'],
      cityOfRegistration: attributes['cityOfRegistration'],
      countryOfRegistration: attributes['countryOfRegistration']
    };
    if (attributes['supplierId']) queryParams.supplierId = attributes['supplierId'];

    return recordExists(attributes['commercialRegisterNo'], validate, queryParams, options.message);
  };
};

let recordExists = function(value, validate, queryParams, errorMessage) {
  return new validate.Promise((resolve, reject) => {
    if (!value) {
      resolve();
      return;
    }

    request.get(url).query(queryParams).set('Accept', 'application/json').then(response => {
      if (response.body) {
        resolve(errorMessage);
      } else {
        resolve();
      }
    }).catch(error => reject());
  });
};
