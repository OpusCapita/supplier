import React, { PropTypes, Component } from 'react';
import _ from 'underscore';
import validatejs from 'validate.js';
import SupplierRegistrationEditorFormRow from '../AttributeValueEditorRow.react.js';
import './SupplierRegistrationEditor.css';
import SupplierFormConstraints from './SupplierFormConstraints';
import serviceComponent from '@opuscapita/react-loaders/lib/serviceComponent';
import customValidation from '../../utils/validatejs/custom.js';

function getValidator() {
  customValidation.vatNumber(validatejs);

  return validatejs;
};

class SupplierRegistrationEditorForm extends Component {
  static propTypes = {
    supplier: PropTypes.object,
    onSupplierChange: PropTypes.func.isRequired,
    onChange: React.PropTypes.func,
    onCancel: React.PropTypes.func,
    actionUrl: React.PropTypes.string.isRequired
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
    if (_.isEqual(this.props.supplier, nextProps.supplier)) {
      return;
    }

    this.setState({
      supplier: {
        ...nextProps.supplier
      },
      fieldErrors: {},
    });

    this.SUPPLIER_CONSTRAINTS = SupplierFormConstraints(nextProps.i18n);
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
  };

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
  };

  handleBlur = (fieldName/* , event*/) => {
    const errors = getValidator()(
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
  };

  handleCancel = event => {
    event.preventDefault();
    this.props.onCancel();
  };

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
        labelText={ this.props.i18n.getMessage(`SupplierRegistrationEditor.Label.${fieldName}.label`) }
        required={ isRequired }
        rowErrors={ rowErrors }
      >
        { component }
      </SupplierRegistrationEditorFormRow>
    );
  };

  render() {
    const { supplier } = this.state;
    const { CountryField } = this.externalComponents;

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
                }) }

                { this.renderField({ fieldName: 'taxIdentificationNo' }) }
                { this.renderField({ fieldName: 'vatIdentificationNo' }) }
                { this.renderField({ fieldName: 'globalLocationNo' }) }
                { this.renderField({ fieldName: 'dunsNo' }) }

                <div className='supplier-registration-form-submit'>
                  <div className='text-right form-submit'>
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
