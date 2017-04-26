import React, { PropTypes, Component } from 'react';
import _ from 'underscore';
import validatejs from 'validate.js';
import i18n from '../../i18n/I18nDecorator.react.js';
import SupplierRegistrationEditorFormRow from './SupplierRegistrationEditorFormRow.react.js';
import './SupplierRegistrationEditor.css';
import { I18nManager } from 'opuscapita-i18n';
import globalMessages from '../../utils/validatejs/i18n';

@i18n
class SupplierRegistrationEditorForm extends Component {
  static propTypes = {
    supplier: PropTypes.object,
    onSupplierChange: PropTypes.func.isRequired,
    dateTimePattern: PropTypes.string.isRequired,
    onChange: React.PropTypes.func,
    onCancel: React.PropTypes.func,
    countries: PropTypes.array,
    actionUrl: React.PropTypes.string.isRequired
  };

  static defaultProps = {
    countries: []
  };

  state = {
    supplier: {
      ...this.props.supplier
    },
    fieldErrors: {}
  };

  componentWillReceiveProps(nextProps) {
    if (_.isEqual(this.props.supplier, nextProps.supplier)) {
      return;
    }

    this.setState({
      supplier: {
        ...nextProps.supplier
      },
      fieldErrors: {},
    });
  }

  validatejsI18N = new I18nManager(this.context.i18n.locale, globalMessages)

  SUPPLIER_CONSTRAINTS = {
    supplierName: {
      presence: {
        message: this.validatejsI18N.getMessage('validatejs.blank.message')
      },
      length: {
        maximum: 50,
        tooLong: this.validatejsI18N.getMessage('validatejs.invalid.maxSize.message', {
          limit: 50
        })
      }
    },
    registrationNumber: {
      presence: false,
      length: {
        maximum: 250,
        tooLong: this.validatejsI18N.getMessage('validatejs.invalid.maxSize.message', {
          limit: 250
        })
      }
    },
    cityOfRegistration: {
      presence: {
        message: this.validatejsI18N.getMessage('validatejs.blank.message')
      },
      length: {
        maximum: 250,
        tooLong: this.validatejsI18N.getMessage('validatejs.invalid.maxSize.message', {
          limit: 250
        })
      }
    },
    countryOfRegistration: {
      presence: {
        message: this.validatejsI18N.getMessage('validatejs.blank.message')
      },
      length: {
        maximum: 250,
        tooLong: this.validatejsI18N.getMessage('validatejs.invalid.maxSize.message', {
          limit: 250
        })
      }
    },
    taxId: {
      presence: false,
      length: {
        maximum: 250,
        tooLong: this.validatejsI18N.getMessage('validatejs.invalid.maxSize.message', {
          limit: 250
        })
      }
    },
    vatRegNo: {
      presence: false,
      length: {
        maximum: 250,
        tooLong: this.validatejsI18N.getMessage('validatejs.invalid.maxSize.message', {
          limit: 250
        })
      }
    },
    globalLocationNo: {
      presence: false,
      length: {
        maximum: 250,
        tooLong: this.validatejsI18N.getMessage('validatejs.invalid.maxSize.message', {
          limit: 250
        })
      }
    },
    dunsNo: {
      presence: false,
      length: {
        maximum: 250,
        tooLong: this.validatejsI18N.getMessage('validatejs.invalid.maxSize.message', {
          limit: 250
        })
      }
    }
  }

  handleChange = (fieldName, event) => {
    let newValue = event.target.value;

    if (this.props.onChange) {
      this.props.onChange(fieldName, this.state.supplier[fieldName], newValue);
    }

    this.setState({
      supplier: {
        ...this.state.supplier,
        [fieldName]: newValue
      }
    });
  }

  handleBlur = (fieldName/* , event*/) => {
    const errors = validatejs(
      this.state.supplier, {
        [fieldName]: this.SUPPLIER_CONSTRAINTS[fieldName]
      }, {
        fullMessages: false
      }
    );

    this.setState({
      fieldErrors: {
        ...this.state.fieldErrors,
        [fieldName]: errors ?
          errors[fieldName].map(msg => ({ message: msg })) :
          []
      }
    });
  }

  handleCancel = event => {
    event.preventDefault();
    this.props.onCancel();
  }
  handleUpdate = event => {
    event.preventDefault();

    const { onSupplierChange } = this.props;
    const supplier = { ...this.state.supplier };

    if (supplier.supplierName) {
      supplier.supplierId = supplier.supplierName.replace(/[^0-9a-z_\-]/gi, '');
    }

    if (!supplier.role) {
      supplier.role = 'selling';
    }

    const errors = validatejs(
      supplier,
      this.SUPPLIER_CONSTRAINTS, {
        fullMessages: false
      }
    );

    if (errors) {
      this.setState({
        fieldErrors: Object.keys(errors).reduce((rez, fieldName) => ({
          ...rez,
          [fieldName]: errors[fieldName].map(msg => ({ message: msg }))
        }), {}),
      });

      onSupplierChange(null);
      return;
    }

    onSupplierChange(supplier);
    return;
  };

  renderField = attrs => {
    const { supplier, fieldErrors } = this.state;
    const { fieldName } = attrs;
    const fieldNames = attrs.fieldNames || [fieldName];

    let component = attrs.component ||
      <input className="form-control"
        type="text"
        value={ typeof supplier[fieldName] === 'string' ? supplier[fieldName] : '' }
        onChange={ this.handleChange.bind(this, fieldName) }
        onBlur={ this.handleBlur.bind(this, fieldName) }
        autoFocus={ fieldName === 'supplierName' && !this.props.supplierId }
      />;

    let isRequired = fieldNames.some(name => {
      return this.SUPPLIER_CONSTRAINTS[name] && this.SUPPLIER_CONSTRAINTS[name].presence;
    });

    let rowErrors = fieldNames.reduce(
      (rez, name) => rez.concat(fieldErrors[name] || []),
      []
    );

    return (
      <SupplierRegistrationEditorFormRow
        labelText={ this.context.i18n.getMessage(`SupplierRegistrationEditor.Label.${fieldName}.label`) }
        required={ isRequired }
        rowErrors={ rowErrors }
      >
        { component }
      </SupplierRegistrationEditorFormRow>
    );
  };

  render() {
    const { i18n } = this.context;
    const locale = i18n.locale;
    const { countries } = this.props;
    const { supplier } = this.state;

    let companiesSearchValue = {};

    if (supplier.supplierId) {
      companiesSearchValue.supplierId = supplier.supplierId;
    }

    if (Object.keys(companiesSearchValue).length === 0) {
      companiesSearchValue = null;
    }

    return (
      <div className="row">
        <div className="col-md-8">
          <form className="form-horizontal">
            <div className="row">
              <div className="col-md-12">
                { this.renderField({ fieldName: 'supplierName' }) }
                { this.renderField({ fieldName: 'registrationNumber' }) }
                { this.renderField({ fieldName: 'cityOfRegistration' }) }

                { this.renderField({
                  fieldName: 'countryOfRegistration',
                  component: (
                    <select className="form-control"
                      value={supplier['countryOfRegistration'] || ''}
                      onChange={this.handleChange.bind(this, 'countryOfRegistration')}
                      onBlur={this.handleBlur.bind(this, 'countryOfRegistration')}
                    >
                      <option disabled={true} value="">{i18n.getMessage('SupplierRegistrationEditor.Select.country')}</option>
                      {countries.map((country, index) => {
                        return (<option key={index} value={country.id}>{country.name}</option>);
                      })}
                    </select>
                  )
                }) }

                { this.renderField({ fieldName: 'taxId' }) }
                { this.renderField({ fieldName: 'vatRegNo' }) }
                { this.renderField({ fieldName: 'globalLocationNo' }) }
                { this.renderField({ fieldName: 'dunsNo' }) }

                <div style={{ paddingTop: '20px' }}>
                  <div className={`text-right form-submit`}>
                    <button className="btn btn-link" onClick={this.handleCancel}>Cancel</button>
                    <button className="btn btn-primary" onClick={ this.handleUpdate }>
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="col-md-4">
          <p>Please provide information that helps us to uniquely identify your company and allows us to add it to our trading partner directory.</p>
          <p>After giving this information you are ready to login.</p>
        </div>
      </div>
    );
  }
}

export default SupplierRegistrationEditorForm;