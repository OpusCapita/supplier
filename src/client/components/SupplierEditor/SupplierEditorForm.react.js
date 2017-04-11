import React, { PropTypes, Component } from 'react';
import _ from 'underscore';
import validatejs from 'validate.js';
import i18n from '../../i18n/I18nDecorator.react.js';
import SupplierEditorFormRow from './SupplierEditorFormRow.react.js';
import DatePicker from '../DatePicker';
import './SupplierEditor.css';
import { SupplierInput } from '../ReferenceSearch';
import { I18nManager } from 'opuscapita-i18n';
import globalMessages from '../../utils/validatejs/i18n';

function isValidDate(d) {
  if (Object.prototype.toString.call(d) !== "[object Date]") {
    return false;
  }
  return !isNaN(d.getTime());
}

// extends standard validator
function getValidator(i18n) {
  validatejs.extend(validatejs.validators.datetime, {
    // The value is guaranteed not to be null or undefined but otherwise it could be anything.
    parse: function(value) {
      let date = new Date(value);
      if (isValidDate(date)) {
        return date.getTime();
      }
      return value.toString;
    },
    // Input is a unix timestamp
    format: function(value) {
      const date = new Date(value);
      if (isValidDate(value)) {
        return i18n.formatDate(date);
      }
      return value;
    }
  });

  return validatejs;
}

function StandardWrapper({ supplierId, supplier, username, i18n, children }) {
  return (
    <div>
      <h4 className="tab-description">
        { i18n.getMessage(`SupplierEditor.Description.${
                supplierId ?
            (supplier && supplier.createdBy === username ?
              'modifySupplierOrChooseAnother' :
                'viewSupplierOrChooseAnother'
            ) :
                  'chooseSupplier'
              }`)
        }
      </h4>
      <form className="form-horizontal">
        {children}
      </form>
    </div>
  );
}

StandardWrapper.propTypes = {
  supplier: PropTypes.object,
  supplierId: PropTypes.string,
  username: React.PropTypes.string,
  i18n: PropTypes.object
};

const OnboardingWrapper = ({ children }) =>
  <div
    className="container"
    style={{
      zIndex: '2'
    }}
  >
    <div
      className="box"
      style={{
        width: '87%',
        marginTop: '15px',
        padding: '3%',
        textAlign: 'left',
        zIndex: '3',
        backgroundColor: 'white'
      }}
    >
      <div className="row">
        <div className="col-md-8">
          <h2>Company Info</h2>
          <form className="form-horizontal">
            <div className="row">
              <div className="col-md-12">
                {children}
              </div>
            </div>
          </form>
        </div>
        <div className="col-md-4">
          <p style={{ margin: '25% 0 0 10%', fontSize: '150%' }}>Company Info</p>
          <br />
          <p>Choose an existing company or provide information for a new one.</p>
          <p>After giving this information you are ready to login.</p>
        </div>
      </div>
    </div>
  </div>;

@i18n
class SupplierEditorForm extends Component {
  static propTypes = {
    supplier: PropTypes.object,
    onSupplierChange: PropTypes.func.isRequired,
    dateTimePattern: PropTypes.string.isRequired,
    onChange: React.PropTypes.func,
    onCancel: React.PropTypes.func,
    readOnly: PropTypes.bool,
    countries: PropTypes.array,
    supplierId: PropTypes.string,
    username: React.PropTypes.string,
    actionUrl: React.PropTypes.string.isRequired,
    isOnboarding: PropTypes.bool
  };

  static defaultProps = {
    readOnly: false,
    countries: []
  };

  state = {
    supplier: {
      ...this.props.supplier
    },
    fieldErrors: {},
    isNewSupplier: true
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
    supplierId: {
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
    homePage: {
      presence: false,
      length: {
        maximum: 250,
        tooLong: this.validatejsI18N.getMessage('validatejs.invalid.maxSize.message', {
          limit: 250
        })
      }
    },
    role: {
      presence: {
        message: this.validatejsI18N.getMessage('validatejs.blank.message')
      }
    },
    foundedOn: {
      presence: false,
      datetime: {
        message: this.validatejsI18N.getMessage('validatejs.typeMismatch.java.util.Date')
      }
    },
    legalForm: {
      presence: false,
      length: {
        maximum: 250,
        tooLong: this.validatejsI18N.getMessage('validatejs.invalid.maxSize.message', {
          limit: 250
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

  handleDateChange = (fieldName, event) => {
    let date;
    try {
      date = this.context.i18n.parseDate(event.target.value);
    } catch (e) {
      date = this.state.supplier.foundedOn;
    }

    this.setState({
      supplier: {
        ...this.state.supplier,
        [fieldName]: isValidDate(date) ?
          date.toJSON() :
          date || ''
      },
      fieldErrors: {
        ...this.state.fieldErrors,
        [fieldName]: []
      }
    });
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
    const errors = getValidator(this.context.i18n)(
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

    const { onSupplierChange, isOnboarding } = this.props;
    const supplier = { ...this.state.supplier };

    if (isOnboarding) {
      if (!supplier.supplierId && supplier.supplierName) {
        supplier.supplierId = supplier.supplierName.replace(/[^0-9a-z_\-]/gi, '');
      }

      if (!supplier.role) {
        supplier.role = 'selling';
      }
    }

    const errors = getValidator(this.context.i18n)(
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
    const { fieldName, readOnly } = attrs;
    const fieldNames = attrs.fieldNames || [fieldName];

    let component = attrs.component ||
      <input className="form-control"
        type="text"
        value={ typeof supplier[fieldName] === 'string' ? supplier[fieldName] : '' }
        onChange={ this.handleChange.bind(this, fieldName) }
        onBlur={ this.handleBlur.bind(this, fieldName) }
        disabled={ readOnly }
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
      <SupplierEditorFormRow
        labelText={ this.context.i18n.getMessage(`SupplierEditor.Label.${fieldName}.label`) }
        required={ isRequired }
        rowErrors={ rowErrors }
        isOnboarding={ this.props.isOnboarding }
      >
        { component }
      </SupplierEditorFormRow>
    );
  };

  render() {
    const { i18n } = this.context;
    const locale = i18n.locale;
    const { countries, isOnboarding } = this.props;
    const { supplier } = this.state;

    let readOnly = this.props.readOnly || (supplier.createdBy && supplier.createdBy !== this.props.username);

    let foundedOn = supplier['foundedOn'];
    if (foundedOn) {
      let date = new Date(foundedOn);
      if (isValidDate(date)) {
        foundedOn = i18n.formatDate(date);
      }
    }

    let companiesSearchValue = {};

    if (supplier.supplierId) {
      companiesSearchValue.supplierId = supplier.supplierId;
    }

    if (Object.keys(companiesSearchValue).length === 0) {
      companiesSearchValue = null;
    }

    let Wrapper = isOnboarding ? OnboardingWrapper : StandardWrapper;

    return (
      <Wrapper
        supplierId={this.props.supplierId}
        supplier={this.props.supplier}
        username={this.props.username}
        i18n={i18n}
      >
        { isOnboarding || this.renderField({
          fieldName: 'isNewSupplier',
          component: (
            <div className="checkbox">
              <input
                type="checkbox"
                checked={this.state.isNewSupplier}
                onChange={() => this.setState({
                  isNewSupplier: !this.state.isNewSupplier,
                  supplier: !readOnly && this.props.supplier || {}
                })}
              />
            </div>
          )
        })  }

        {/* TODO: search for role==='selling' when isOnboarding===true */}
        { this.state.isNewSupplier ?
          this.renderField({
            fieldName: 'supplier',
            fieldNames: ['supplierId', 'supplierName'],
            component: (
              <SupplierInput
                serviceRegistry={serviceName => ({ url: this.props.actionUrl })}
                value={companiesSearchValue}
                onChange={supplier => this.setState({
                  supplier: supplier || {}
                })}
                onBlur={() => {
                  this.handleBlur('supplierId');
                  this.handleBlur('supplierName');
                }}
              />
            )
          }) :
          (
            <div>
              { this.renderField({ fieldName: 'supplierName', readOnly }) }
              { isOnboarding || this.renderField({ fieldName: 'supplierId', readOnly }) }
            </div>
          )
        }

        { isOnboarding || this.renderField({ fieldName: 'homePage', readOnly }) }

        { isOnboarding || this.renderField({
          fieldName: 'role',
          readOnly,
          component: (
            <div>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="buying"
                  checked={ supplier.role === 'buying' }
                  onChange={ this.handleChange.bind(this, 'role') }
                  disabled={readOnly}
                  className="radio-inline"
                />
                <span style={{ fontWeight: 'normal' }}>
                  { this.context.i18n.getMessage('SupplierEditor.Label.buying.label') }
                </span>
              </label>
              {'\u00a0\u00a0\u00a0\u00a0'}
              <label>
                <input
                  type="radio"
                  name="role"
                  value="selling"
                  checked={ supplier.role === 'selling' }
                  onChange={ this.handleChange.bind(this, 'role') }
                  disabled={readOnly}
                  className="radio-inline"
                />
                <span style={{ fontWeight: 'normal' }}>
                  { this.context.i18n.getMessage('SupplierEditor.Label.selling.label') }
                </span>
              </label>
            </div>
          )
        }) }

        { isOnboarding || this.renderField({
          fieldName: 'foundedOn',
          readOnly,
          component: (
            <DatePicker className="form-control"
              locale={locale}
              format={i18n.dateFormat}
              disabled={readOnly}
              value={foundedOn || ''}
              onChange={this.handleDateChange.bind(this, 'foundedOn')}
              onBlur={this.handleBlur.bind(this, 'foundedOn')}
            />
          )
        }) }

        { this.renderField({ fieldName: 'legalForm', readOnly }) }
        { isOnboarding || this.renderField({ fieldName: 'registrationNumber', readOnly }) }
        { this.renderField({ fieldName: 'cityOfRegistration', readOnly }) }

        { this.renderField({
          fieldName: 'countryOfRegistration',
          readOnly,
          component: (
            <select className="form-control"
              disabled={readOnly}
              value={supplier['countryOfRegistration'] || ''}
              onChange={this.handleChange.bind(this, 'countryOfRegistration')}
              onBlur={this.handleBlur.bind(this, 'countryOfRegistration')}
            >
              <option disabled={true} value="">{i18n.getMessage('SupplierEditor.Select.country')}</option>
              {countries.map((country, index) => {
                return (<option key={index} value={country.id}>{country.name}</option>);
              })}
            </select>
          )
        }) }

        {  this.renderField({ fieldName: 'taxId', readOnly }) }
        {  this.renderField({ fieldName: 'vatRegNo', readOnly }) }
        {  this.renderField({ fieldName: 'globalLocationNo', readOnly }) }
        {  this.renderField({ fieldName: 'dunsNo', readOnly }) }

        {!this.props.readOnly && <div style={{ paddingTop: '20px' }}>
          <div className={`text-right form-submit${isOnboarding ? '' : ' col-sm-10 col-md-8'}`}>
            {isOnboarding && <button className="btn btn-link" onClick={this.handleCancel}>Cancel</button>}
            <button className="btn btn-primary" onClick={ this.handleUpdate }>
              { isOnboarding ? 'Continue' : i18n.getMessage('SupplierEditor.ButtonLabel.save') }
            </button>
          </div>
        </div>}
      </Wrapper>
    );
  }
}

export default SupplierEditorForm;
