module.exports = function(validatejsI18N) {
  return {
    supplierName: {
      presence: {
        message: validatejsI18N.getMessage('validatejs.blank.message')
      },
      length: {
        maximum: 50,
        tooLong: validatejsI18N.getMessage('validatejs.invalid.maxSize.message', {
          limit: 50
        })
      }
    },
    commercialRegisterNo: {
      presence: false,
      length: {
        maximum: 250,
        tooLong: validatejsI18N.getMessage('validatejs.invalid.maxSize.message', {
          limit: 250
        })
      }
    },
    cityOfRegistration: {
      presence: {
        message: validatejsI18N.getMessage('validatejs.blank.message')
      },
      length: {
        maximum: 250,
        tooLong: validatejsI18N.getMessage('validatejs.invalid.maxSize.message', {
          limit: 250
        })
      }
    },
    countryOfRegistration: {
      presence: {
        message: validatejsI18N.getMessage('validatejs.blank.message')
      },
      length: {
        maximum: 250,
        tooLong: validatejsI18N.getMessage('validatejs.invalid.maxSize.message', {
          limit: 250
        })
      }
    },
    taxIdentificationNo: {
      presence: false,
      length: {
        maximum: 250,
        tooLong: validatejsI18N.getMessage('validatejs.invalid.maxSize.message', {
          limit: 250
        })
      }
    },
    vatIdentificationNo: {
      presence: false,
      vatNumber: {
        message: validatejsI18N.getMessage('validatejs.invalid.vatNumber.message')
      },
      vatNumberExists: {
        message: validatejsI18N.getMessage('validatejs.supplierExists', {
          message: validatejsI18N.getMessage('validatejs.duplicate.vatNumber.message')
        })
      }
    },
    globalLocationNo: {
      presence: false,
      globalLocationNumber: {
        message: validatejsI18N.getMessage('validatejs.invalid.globalLocationNumber.message')
      }
    },
    dunsNo: {
      presence: false,
      dunsNumber: {
        message: validatejsI18N.getMessage('validatejs.invalid.dunsNumber.message')
      }
    }
  };
};
