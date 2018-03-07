class SupplierConstraints {
  constructor(i18n) {
    this.constraints = allConstraints(i18n);
  }

  forUpdate() {
    let constraints = this.constraints;
    delete constraints.iban;
    delete constraints.vatIdentificationNo.uniqueIdentifier;
    delete constraints.globalLocationNo.uniqueIdentifier;
    delete constraints.dunsNo.uniqueIdentifier;

    return constraints;
  }

  forRegistration() {
    let constraints = this.constraints;

    delete constraints.homePage;
    delete constraints.foundedOn;
    delete constraints.legalForm;
    delete constraints.vatIdentificationNo.uniqueIdentifierWithBankAccount;
    delete constraints.globalLocationNo.uniqueIdentifierWithBankAccount;
    delete constraints.dunsNo.uniqueIdentifierWithBankAccount;

    return constraints;
  }

  forField(fieldName) {
    if (fieldName === 'taxIdentificationNo')
      return {
        taxIdentificationNo: this.constraints['taxIdentificationNo'],
        cityOfRegistration: this.constraints['cityOfRegistration']
      };

    if (fieldName === 'commercialRegisterNo')
      return {
        commercialRegisterNo: this.constraints['commercialRegisterNo'],
        cityOfRegistration: this.constraints['cityOfRegistration'],
        countryOfRegistration: this.constraints['countryOfRegistration']
      };

    if (fieldName === 'cityOfRegistration')
      return {
        taxIdentificationNo: this.constraints['taxIdentificationNo'],
        commercialRegisterNo: this.constraints['commercialRegisterNo'],
        cityOfRegistration: this.constraints['cityOfRegistration'],
        countryOfRegistration: this.constraints['countryOfRegistration']
      };

    if (fieldName === 'countryOfRegistration')
      return {
        commercialRegisterNo: this.constraints['commercialRegisterNo'],
        cityOfRegistration: this.constraints['cityOfRegistration'],
        countryOfRegistration: this.constraints['countryOfRegistration']
      };

    if (['vatIdentificationNo', 'dunsNo', 'globalLocationNo', 'iban'].indexOf(fieldName) > -1)
      return {
        vatIdentificationNo: this.constraints['vatIdentificationNo'],
        dunsNo: this.constraints['dunsNo'],
        globalLocationNo: this.constraints['globalLocationNo'],
        iban: this.constraints['iban'],
      };

    return { [fieldName]: this.constraints[fieldName] };
  }
}

let allConstraints = function(i18n) {
  return {
    name: {
      presence: {
        message: i18n.getMessage('SupplierValidatejs.blank.message')
      },
      length: {
        maximum: 100,
        tooLong: i18n.getMessage('SupplierValidatejs.invalid.maxSize.message', {
          limit: 100
        })
      },
      supplierNameExists: {
        message: i18n.getMessage('SupplierValidatejs.supplierExists', {
          message: i18n.getMessage('SupplierValidatejs.duplicate.name.message')
        })
      }
    },
    homePage: {
      presence: false,
      length: {
        maximum: 250,
        tooLong: i18n.getMessage('SupplierValidatejs.invalid.maxSize.message', {
          limit: 250
        })
      }
    },
    foundedOn: {
      presence: false,
      datetime: {
        message: i18n.getMessage('SupplierValidatejs.typeMismatch.util.Date')
      }
    },
    legalForm: {
      presence: false,
      length: {
        maximum: 250,
        tooLong: i18n.getMessage('SupplierValidatejs.invalid.maxSize.message', {
          limit: 250
        })
      }
    },
    commercialRegisterNo: {
      presence: false,
      registerationNumberExists: {
        message: i18n.getMessage('SupplierValidatejs.supplierExists', {
          message: i18n.getMessage('SupplierValidatejs.duplicate.registerationNumber.message')
        })
      }
    },
    cityOfRegistration: {
      presence: {
        message: i18n.getMessage('SupplierValidatejs.blank.message')
      },
      length: {
        maximum: 250,
        tooLong: i18n.getMessage('SupplierValidatejs.invalid.maxSize.message', {
          limit: 250
        })
      }
    },
    countryOfRegistration: {
      presence: {
        message: i18n.getMessage('SupplierValidatejs.blank.message')
      }
    },
    taxIdentificationNo: {
      presence: false,
      taxIdNumberExists: {
        message: i18n.getMessage('SupplierValidatejs.supplierExists', {
          message: i18n.getMessage('SupplierValidatejs.duplicate.taxIdNumber.message')
        })
      }
    },
    vatIdentificationNo: {
      presence: false,
      vatNumber: {
        message: i18n.getMessage('SupplierValidatejs.invalid.vatNumber.message')
      },
      vatNumberExists: {
        message: i18n.getMessage('SupplierValidatejs.supplierExists', {
          message: i18n.getMessage('SupplierValidatejs.duplicate.vatNumber.message')
        })
      },
      uniqueIdentifier: {
        message: i18n.getMessage('SupplierValidatejs.invalid.uniqueIdentifier.message')
      },
      uniqueIdentifierWithBankAccount: {
        message: i18n.getMessage('SupplierValidatejs.invalid.uniqueIdentifierWithBankAccount.message')
      }
    },
    globalLocationNo: {
      presence: false,
      globalLocationNumber: {
        message: i18n.getMessage('SupplierValidatejs.invalid.globalLocationNumber.message')
      },
      globalLocationNumberExists: {
        message: i18n.getMessage('SupplierValidatejs.supplierExists', {
          message: i18n.getMessage('SupplierValidatejs.duplicate.globalLocationNumber.message')
        })
      },
      uniqueIdentifier: {
        message: i18n.getMessage('SupplierValidatejs.invalid.uniqueIdentifier.message')
      },
      uniqueIdentifierWithBankAccount: {
        message: i18n.getMessage('SupplierValidatejs.invalid.uniqueIdentifierWithBankAccount.message')
      }
    },
    dunsNo: {
      presence: false,
      dunsNumber: {
        message: i18n.getMessage('SupplierValidatejs.invalid.dunsNumber.message')
      },
      dunsNumberExists: {
        message: i18n.getMessage('SupplierValidatejs.supplierExists', {
          message: i18n.getMessage('SupplierValidatejs.duplicate.dunsNumber.message')
        })
      },
      uniqueIdentifier: {
        message: i18n.getMessage('SupplierValidatejs.invalid.uniqueIdentifier.message')
      },
      uniqueIdentifierWithBankAccount: {
        message: i18n.getMessage('SupplierValidatejs.invalid.uniqueIdentifierWithBankAccount.message')
      }
    },
    iban: {
      presence: false,
      iban: {
        message: i18n.getMessage('SupplierValidatejs.invalid.iban.message')
      },
      ibanExists: {
        message: i18n.getMessage('SupplierValidatejs.supplierExists', {
          message: i18n.getMessage('SupplierValidatejs.duplicate.iban.message')
        })
      },
      uniqueIdentifier: {
        message: i18n.getMessage('SupplierValidatejs.invalid.uniqueIdentifier.message')
      }
    }
  };
};

export default SupplierConstraints;
