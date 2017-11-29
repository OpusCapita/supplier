class SupplierBankAccountConstraints {
  constructor(i18n) {
    this.constraints = allConstraints(i18n);
  }

  forField(fieldName) {
    return { [fieldName]: this.constraints[fieldName] };
  }

  get all() {
    return this.constraints;
  }
};

let allConstraints = function(i18n) {
  return {
    bankName: {
      presence: {
        message: i18n.getMessage('SupplierValidatejs.blank.message')
      },
      length: {
        maximum: 50,
        tooLong: i18n.getMessage('SupplierValidatejs.invalid.maxSize.message', {
          limit: 50
        })
      }
    },
    accountNumber: {
      presence: {
        message: i18n.getMessage('SupplierValidatejs.blank.message')
      },
      iban: {
        message: i18n.getMessage('SupplierValidatejs.invalid.iban.message')
      },
      ibanExists: {
        message: i18n.getMessage('SupplierValidatejs.duplicate.iban.message')
      }
    },
    bankIdentificationCode: {
      presence: {
        message: i18n.getMessage('SupplierValidatejs.blank.message')
      },
      length: {
        maximum: 15,
        tooLong: i18n.getMessage('SupplierValidatejs.invalid.maxSize.message', {
          limit: 15
        })
      },
      bic: {
        message: i18n.getMessage('SupplierValidatejs.invalid.bic.message')
      }
    },
    bankCode: {
      presence: {
        message: i18n.getMessage('SupplierValidatejs.blank.message')
      },
      length: {
        maximum: 12,
        tooLong: i18n.getMessage('SupplierValidatejs.invalid.maxSize.message', {
          limit: 12
        })
      }
    },
    swiftCode: {
      presence: {
        message: i18n.getMessage('SupplierValidatejs.blank.message')
      },
      length: {
        maximum: 11,
        tooLong: i18n.getMessage('SupplierValidatejs.invalid.maxSize.message', {
          limit: 11
        })
      },
      bic: {
        message: i18n.getMessage('SupplierValidatejs.invalid.swiftCode.message')
      }
    },
    bankCountryKey: {
      presence: {
        message: i18n.getMessage('SupplierValidatejs.blank.message')
      }
    },
    extBankControlKey: {
      length: {
        maximum: 2,
        tooLong: i18n.getMessage('SupplierValidatejs.invalid.maxSize.message', {
          limit: 2
        })
      }
    }
  };
};

export default SupplierBankAccountConstraints;
