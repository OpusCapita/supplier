class SupplierBankAccountConstraints {
  constructor(i18n) {
    this.constraints = allConstraints(i18n);
  }

  forField(fieldName) {
    if (['accountNumber', 'bankgiro', 'plusgiro'].indexOf(fieldName) > -1)
      return {
        accountNumber: this.constraints['accountNumber'],
        bankgiro: this.constraints['bankgiro'],
        plusgiro: this.constraints['plusgiro']
      };

    if (fieldName === this.constraints['bankIdentificationCode'])
      return {
        accountNumber: this.constraints['accountNumber'],
        bankIdentificationCode: this.constraints['bankIdentificationCode']
      };

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
      iban: {
        message: i18n.getMessage('SupplierValidatejs.invalid.iban.message')
      },
      ibanExists: {
        message: i18n.getMessage('SupplierValidatejs.duplicate.iban.message')
      },
      uniqueIdentifier: {
        message: i18n.getMessage('SupplierValidatejs.invalid.uniqueIdentifierBankAccount.message')
      }
    },
    bankIdentificationCode: {
      bic: {
        message: i18n.getMessage('SupplierValidatejs.invalid.bic.message')
      },
      bicRequired: {
        message: i18n.getMessage('SupplierValidatejs.blank.bic.message')
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
    },
    bankgiro: {
      length: {
        maximum: 100,
        tooLong: i18n.getMessage('SupplierValidatejs.invalid.maxSize.message', {
          limit: 100
        })
      },
      uniqueIdentifier: {
        message: i18n.getMessage('SupplierValidatejs.invalid.uniqueIdentifierBankAccount.message')
      }
    },
    plusgiro: {
      length: {
        maximum: 100,
        tooLong: i18n.getMessage('SupplierValidatejs.invalid.maxSize.message', {
          limit: 100
        })
      },
      uniqueIdentifier: {
        message: i18n.getMessage('SupplierValidatejs.invalid.uniqueIdentifierBankAccount.message')
      }
    },
    isrNumber: {
      isrNumber: {
        message: i18n.getMessage('SupplierValidatejs.invalid.isrNumber.message')
      }
    }
  };
};

export default SupplierBankAccountConstraints;
