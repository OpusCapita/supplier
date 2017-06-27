import React, { PropTypes, Component } from 'react';
import _ from 'underscore';
import validatejs from 'validate.js';
import SupplierEditorFormRow from '../AttributeValueEditorRow.react.js';
import './SupplierEditor.css';
import SupplierFormConstraints from './SupplierFormConstraints';
import DateInput from '@opuscapita/react-dates/lib/DateInput';
import serviceComponent from '@opuscapita/react-loaders/lib/serviceComponent';
import customValidation from '../../utils/validatejs/custom.js';

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

  customValidation.vatNumber(validatejs);

  return validatejs;
}

class SupplierEditorForm extends Component {
  static propTypes = {
    supplier: PropTypes.object,
    onSupplierChange: PropTypes.func.isRequired,
    dateTimePattern: PropTypes.string.isRequired,
    onChange: React.PropTypes.func,
    onCancel: React.PropTypes.func,
    actionUrl: React.PropTypes.string.isRequired
  };

  static defaultProps = {
    readOnly: false
  };

  state = {
    supplier: {
      ...this.props.supplier
    },
    fieldErrors: {}
  };

  componentWillMount() {
    let serviceRegistry = (service) => ({ url: `${this.props.actionUrl}/isodata` });
    const CountryField = serviceComponent({ serviceRegistry, serviceName: 'isodata' , moduleName: 'isodata-countries', jsFileName: 'countries-bundle' });

    this.externalComponents = { CountryField };

    this.SUPPLIER_CONSTRAINTS = SupplierFormConstraints(this.props.i18n);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.supplier, nextProps.supplier)) {
      this.setState({
        supplier: {
          ...nextProps.supplier
        },
        fieldErrors: {},
      });
    }

    this.SUPPLIER_CONSTRAINTS = SupplierFormConstraints(nextProps.i18n);
  }

  handleDateChange = (fieldName, date) => {
    if (this.props.onChange) {
      this.props.onChange(fieldName, this.state.supplier[fieldName], date);
    }

    this.setState({
      supplier: {
        ...this.state.supplier,
        [fieldName]: date
      },
      fieldErrors: {
        ...this.state.fieldErrors,
        [fieldName]: []
      }
    });
  }

  handleCountryChange = (fieldName, country) => {
    if (this.props.onChange) {
      this.props.onChange(fieldName, this.state.supplier[fieldName], country);
    }

    this.setState({
      supplier: {
        ...this.state.supplier,
        [fieldName]: country
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
    const errors = getValidator(this.props.i18n)(
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

    const errors = getValidator(this.props.i18n)(
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
        labelText={ this.props.i18n.getMessage(`SupplierEditor.Label.${fieldName}.label`) }
        required={ isRequired }
        rowErrors={ rowErrors }
      >
        { component }
      </SupplierEditorFormRow>
    );
  };

  render() {
    const { locale, i18n, dateTimePattern } = this.props;
    const { supplier } = this.state;
    const { CountryField } = this.externalComponents;
    const foundedOn = supplier['foundedOn'] ? new Date(supplier['foundedOn']) : '';

    return (
      <div>
        <h4 className="tab-description">
          { i18n.getMessage(`SupplierEditor.Description.viewSupplierOrChooseAnother`) }
        </h4>
        <form className="form-horizontal">
          { this.renderField({ fieldName: 'supplierName' }) }
          { this.renderField({ fieldName: 'homePage' }) }
          { this.renderField({
            fieldName: 'foundedOn',
            component: (
              <DateInput
                className="form-control"
                locale={locale}
                dateFormat={this.props.dateTimePattern}
                value={foundedOn}
                onChange={this.handleDateChange.bind(this, 'foundedOn')}
                onBlur={this.handleBlur.bind(this, 'foundedOn')}
                variants={[]}
              />
            )
          }) }

          { this.renderField({ fieldName: 'legalForm' }) }
          { this.renderField({ fieldName: 'commercialRegisterNo' }) }
          { this.renderField({ fieldName: 'cityOfRegistration' }) }

          { this.renderField({
            fieldName: 'countryOfRegistration',
            component: (
              <CountryField
                actionUrl={this.props.actionUrl}
                value={this.state.supplier['countryOfRegistration']}
                onChange={this.handleCountryChange.bind(this, 'countryOfRegistration')}
                onBlur={this.handleBlur.bind(this, 'countryOfRegistration')}
              />
            )
          })}

          { this.renderField({ fieldName: 'taxIdentificationNo' }) }
          { this.renderField({ fieldName: 'vatIdentificationNo' }) }
          { this.renderField({ fieldName: 'globalLocationNo' }) }
          { this.renderField({ fieldName: 'dunsNo' }) }

          <div className='supplier-form-submit'>
            <div className='text-right form-submit'>
              <button className="btn btn-primary" onClick={ this.handleUpdate }>
                { i18n.getMessage('SupplierEditor.ButtonLabel.save') }
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default SupplierEditorForm;
