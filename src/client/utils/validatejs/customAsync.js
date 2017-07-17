const request = require('superagent-bluebird-promise');
const url = '/supplier/api/suppliers';

module.exports.vatNumberExists = function(validate) {
  return validate.validators.vatNumberExists = function(value, options, key, attributes) {

    return new validate.Promise((resolve, reject) => {
      if (value) {
        request.get(url).query({ vatIdentificationNo: value }).set('Accept', 'application/json').
          then(response => {
            if (response.body.length === 0) {
              resolve();
            } else {
              resolve(options.message);
            }
          }).catch(error => reject());
      } else {
        resolve();
      }
    })
  };
};
