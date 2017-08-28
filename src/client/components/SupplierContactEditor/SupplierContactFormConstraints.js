module.exports = function(validatejsI18N) {
  return {
    contactType: {
      presence: {
        message: validatejsI18N.getMessage('validatejs.blank.message')
      }
    },
    department: {
      presence: {
        message: validatejsI18N.getMessage('validatejs.blank.message')
      }
    },
    title: {
      length: {
        maximum: 20,
        tooLong: validatejsI18N.getMessage('validatejs.invalid.maxSize.message', {
          limit: 20
        })
      }
    },
    firstName: {
      presence: {
        message: validatejsI18N.getMessage('validatejs.blank.message')
      },
      length: {
        maximum: 100,
        tooLong: validatejsI18N.getMessage('validatejs.invalid.maxSize.message', {
          limit: 100
        })
      }
    },
    lastName: {
      presence: {
        message: validatejsI18N.getMessage('validatejs.blank.message')
      },
      length: {
        maximum: 100,
        tooLong: validatejsI18N.getMessage('validatejs.invalid.maxSize.message', {
          limit: 100
        })
      }
    },
    email: {
      presence: {
        message: validatejsI18N.getMessage('validatejs.blank.message')
      },
      email: {
        message: validatejsI18N.getMessage('validatejs.invalid.email.message')
      },
      length: {
        maximum: 100,
        tooLong: validatejsI18N.getMessage('validatejs.invalid.maxSize.message', {
          limit: 100
        })
      }
    },
    phone: {
      length: {
        maximum: 20,
        tooLong: validatejsI18N.getMessage('validatejs.invalid.maxSize.message', {
          limit: 20
        })
      }
    },
    mobile: {
      length: {
        maximum: 20,
        tooLong: validatejsI18N.getMessage('validatejs.invalid.maxSize.message', {
          limit: 20
        })
      }
    },
    fax: {
      length: {
        maximum: 20,
        tooLong: validatejsI18N.getMessage('validatejs.invalid.maxSize.message', {
          limit: 20
        })
      }
    }
  };
};
