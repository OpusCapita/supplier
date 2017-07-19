import React, { PropTypes, Component } from 'react';
import _ from 'underscore';
import validatejs from 'validate.js';
import SupplierRegistrationEditorFormRow from '../AttributeValueEditorRow.react.js';
import './SupplierRegistrationEditor.css';
import SupplierFormConstraints from './SupplierFormConstraints';
import serviceComponent from '@opuscapita/react-loaders/lib/serviceComponent';
import customValidation from '../../utils/validatejs/custom.js';
import customValidationAsync from '../../utils/validatejs/customAsync.js';

function getValidator() {
  customValidation.vatNumber(validatejs);
  customValidation.dunsNumber(validatejs);
  customValidation.globalLocationNumber(validatejs);
  customValidationAsync.registerationNumberExists(validatejs);
  customValidationAsync.taxIdNumberExists(validatejs);
  customValidationAsync.vatNumberExists(validatejs);
  customValidationAsync.dunsNumberExists(validatejs);
  customValidationAsync.globalLocationNumberExists(validatejs);

  return validatejs;
};

class SupplierRegistrationEditorForm extends Component {
  static propTypes = {
    supplier: PropTypes.object,
    onSupplierChange: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
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

  fieldConstraints = (fieldName) => {
    if (fieldName === 'taxIdentificationNo')
      return {
        taxIdentificationNo: this.SUPPLIER_CONSTRAINTS['taxIdentificationNo'],
        countryOfRegistration: this.SUPPLIER_CONSTRAINTS['countryOfRegistration']
      };

    if (['commercialRegisterNo', 'cityOfRegistration'].indexOf(fieldName) > -1)
      return {
        commercialRegisterNo: this.SUPPLIER_CONSTRAINTS['commercialRegisterNo'],
        cityOfRegistration: this.SUPPLIER_CONSTRAINTS['cityOfRegistration'],
        countryOfRegistration: this.SUPPLIER_CONSTRAINTS['countryOfRegistration']
      };

    if (fieldName === 'countryOfRegistration')
      return {
        commercialRegisterNo: this.SUPPLIER_CONSTRAINTS['commercialRegisterNo'],
        taxIdentificationNo: this.SUPPLIER_CONSTRAINTS['taxIdentificationNo'],
        cityOfRegistration: this.SUPPLIER_CONSTRAINTS['cityOfRegistration'],
        countryOfRegistration: this.SUPPLIER_CONSTRAINTS['countryOfRegistration']
      };

    return { [fieldName]: this.SUPPLIER_CONSTRAINTS[fieldName] };
  };

  handleChange = (fieldName, event) => {
    let newValue;

    if (event.target) {
      newValue = event.target.value;
    } else {
      newValue = event;
    }

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

  handleBlur = (fieldName) => {
    const constraints = this.fieldConstraints(fieldName);

    this.setState({
      fieldErrors: Object.keys(constraints).reduce((rez, fieldName) => ({
        ...rez,
        [fieldName]: []
      }), this.state.fieldErrors)
    });

    const error = (errors) => {
      this.setState({
        fieldErrors: Object.keys(errors).reduce((rez, fieldName) => ({
          ...rez,
          [fieldName]: errors[fieldName].map(msg => ({ message: msg }))
        }), this.state.fieldErrors)
      });
    };

    getValidator().async(this.state.supplier, constraints, { fullMessages: false }).then(null, error);
  };

  handleCancel = event => {
    event.preventDefault();
    this.props.onCancel();
  };

  handleUpdate = event => {
    event.preventDefault();

    const { onSupplierChange } = this.props;
    const supplier = { ...this.state.supplier };
    supplier.role = 'selling';

    const success = () => {
      onSupplierChange(supplier);
    };

    const error = (errors) => {
      this.setState({
        fieldErrors: Object.keys(errors).reduce((rez, fieldName) => ({
          ...rez,
          [fieldName]: errors[fieldName].map(msg => ({ message: msg }))
        }), {})
      });

      onSupplierChange(null);
    };

    getValidator().async(supplier, this.SUPPLIER_CONSTRAINTS, { fullMessages: false }).
      then(success, error);
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
                      onChange={this.handleChange.bind(this, 'countryOfRegistration')}
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
                    <button className="btn btn-link" onClick={this.handleCancel}>
                      {this.props.i18n.getMessage('SupplierRegistrationEditor.ButtonLabel.cancel')}
                    </button>
                    <button className="btn btn-primary" onClick={ this.handleUpdate }>
                      {this.props.i18n.getMessage('SupplierRegistrationEditor.ButtonLabel.continue')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="col-md-4">
          <p>{this.props.i18n.getMessage('SupplierRegistrationEditor.Messages.information1')}</p>
          <p>{this.props.i18n.getMessage('SupplierRegistrationEditor.Messages.information2')}</p>
        </div>
      </div>
    );
  }
}

export default SupplierRegistrationEditorForm;
