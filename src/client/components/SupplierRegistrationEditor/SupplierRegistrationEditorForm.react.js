import React, { PropTypes, Component } from 'react';
import AttributeValueEditorRow from '../AttributeValueEditorRow.react.js';
import ActionButton from '../ActionButton.react';
import './SupplierRegistrationEditor.css';
import SupplierConstraints from '../../utils/validatejs/supplierConstraints';
import serviceComponent from '@opuscapita/react-loaders/lib/serviceComponent';
import validator from '../../utils/validatejs/supplierValidator.js';
import { Components } from '@opuscapita/service-base-ui';

class SupplierRegistrationEditorForm extends Component {
  static propTypes = {
    supplier: PropTypes.object,
    onSupplierChange: PropTypes.func.isRequired,
    onChange: React.PropTypes.func,
    onCancel: React.PropTypes.func,
    onAccessRequest: React.PropTypes.func.isRequired,
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired
  };

  state = {
    supplier: {
      ...this.props.supplier
    },
    fieldErrors: {},
    hasVATId: true
  };

  componentWillMount() {
    let serviceRegistry = (service) => ({ url: `/isodata` });
    const CountryField = serviceComponent({ serviceRegistry, serviceName: 'isodata' , moduleName: 'isodata-countries', jsFileName: 'countries-bundle' });
    const CurrencyField = serviceComponent({ serviceRegistry, serviceName: 'isodata' , moduleName: 'isodata-currencies', jsFileName: 'currencies-bundle' });

    this.externalComponents = { CountryField, CurrencyField };

    this.constraints = new SupplierConstraints(this.context.i18n);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (JSON.stringify(this.props.supplier) !== JSON.stringify(nextProps.supplier)) {
      this.setState({
        supplier: {
          ...nextProps.supplier
        },
        fieldErrors: {},
      });
    }

    this.constraints = new SupplierConstraints(nextContext.i18n);
  }

  setFieldErrorsStates = (errors) => {
    this.setState({
      fieldErrors: Object.keys(errors || {}).reduce((rez, fieldName) => ({
        ...rez,
        [fieldName]: errors[fieldName].map(error => {
          return {
            message: error.message,
            value: error.value,
            fieldName: fieldName,
            attributes: error.attributes,
            hasLink: error.validator && error.validator.includes('Exists'),
            linkMessage: this.context.i18n.getMessage('Supplier.Button.requestAccess')
          };
        })
      }), this.state.fieldErrors)
    });
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

  handleBlur = (fieldName, event) => {
    event.preventDefault && event.preventDefault();
    const constraints = this.constraints.forField(fieldName);

    this.setState({
      fieldErrors: Object.keys(constraints).reduce((rez, fieldName) => ({
        ...rez,
        [fieldName]: []
      }), this.state.fieldErrors)
    });

    const error = (errors) => {
      this.setFieldErrorsStates(errors);
    };

    const options = { fullMessages: false, format: 'groupedDetailed' };
    validator.forRegistration().async(this.state.supplier, constraints, options).then(null, error);
  };

  handleCancel = event => {
    event.preventDefault && event.preventDefault();
    this.props.onCancel();
  };

  handleUpdate = event => {
    event.preventDefault && event.preventDefault();

    const { onSupplierChange } = this.props;
    const supplier = this.state.supplier;
    const constraints = this.constraints.forRegistration();

    if (!supplier.vatIdentificationNo && this.state.hasVATId) {
      this.setFieldErrorsStates({ noVatReason: [{ message: this.context.i18n.getMessage('Supplier.Messages.clickCheckBox') }] });
    } else {
      const success = () => {
        supplier.noVatReason = supplier.vatIdentificationNo ? null : 'No VAT Registration Number';
        onSupplierChange(supplier);
      };

      const error = (errors) => {
        this.setFieldErrorsStates(errors);
        onSupplierChange(null);
      };

      const options = { fullMessages: false, format: 'groupedDetailed' };
      validator.forRegistration().async(supplier, constraints, options).then(success, error);
    }
  };

  requestSupplierAccess = (error) => {
    const { onAccessRequest } = this.props;
    if (onAccessRequest) onAccessRequest(error.attributes);
  };

  handleCheckboxChange = () => {
    this.setFieldErrorsStates({ noVatReason: [] });
    this.setState({hasVATId: !this.state.hasVATId});
  };

  comRegTooltiptext() {
    return (
      `${this.context.i18n.getMessage('Supplier.Messages.companyRegisterNumber.text')}
      <ul>
        <li>${this.context.i18n.getMessage('Supplier.Messages.companyRegisterNumber.de')}</li>
        <li>${this.context.i18n.getMessage('Supplier.Messages.companyRegisterNumber.at')}</li>
        <li>${this.context.i18n.getMessage('Supplier.Messages.companyRegisterNumber.fi')}</li>
        <li>${this.context.i18n.getMessage('Supplier.Messages.companyRegisterNumber.se')}</li>
        <li>${this.context.i18n.getMessage('Supplier.Messages.companyRegisterNumber.no')}</li>
        <li>${this.context.i18n.getMessage('Supplier.Messages.companyRegisterNumber.ch')}</li>
        <li>${this.context.i18n.getMessage('Supplier.Messages.companyRegisterNumber.us')}</li>
        <li>${this.context.i18n.getMessage('Supplier.Messages.companyRegisterNumber.pl')}</li>
        <li>${this.context.i18n.getMessage('Supplier.Messages.companyRegisterNumber.fr')}</li>
      </ul>`
    );
  }

  renderField = (attrs) => {
    const { supplier, fieldErrors } = this.state;
    const { fieldName } = attrs;
    const fieldNames = attrs.fieldNames || [fieldName];
    const constraints = this.constraints.forRegistration();

    let component = attrs.component ||
      <input className="form-control"
        type="text"
        value={ typeof supplier[fieldName] === 'string' ? supplier[fieldName] : '' }
        onChange={ this.handleChange.bind(this, fieldName) }
        onBlur={ this.handleBlur.bind(this, fieldName) }
        disabled={ attrs.disabled || false }
      />;

    let isRequired = fieldNames.some(name => {
      return constraints[name] && constraints[name].presence;
    });

    let rowErrors = fieldNames.reduce((rez, name) => rez.concat(fieldErrors[name] || []), []);

    return (
      <AttributeValueEditorRow
        labelText={ attrs.labelText || this.context.i18n.getMessage(`Supplier.Label.${fieldName}`) }
        required={ isRequired }
        marked = { attrs.marked }
        info = { attrs.info }
        helpText = { attrs.helpText }
        rowErrors={ rowErrors }
        onErrorLinkClick={ this.requestSupplierAccess }
      >
        { component }
      </AttributeValueEditorRow>
    );
  };

  render() {
    const { supplier } = this.state;
    const { i18n } = this.context;
    const { CountryField, CurrencyField } = this.externalComponents;

    return (
      <form className="form-horizontal .supplier-form">
        <div className="row">
          <div className="col-md-6">
            { this.renderField({ fieldName: 'name' }) }
            { this.renderField({ fieldName: 'cityOfRegistration', helpText: i18n.getMessage('Supplier.Messages.cityOfRegistration.helpText') }) }
            { this.renderField({
              fieldName: 'countryOfRegistration',
              helpText: i18n.getMessage('Supplier.Messages.countryOfRegistration.helpText'),
              component: (
                <CountryField
                  actionUrl=''
                  value={supplier.countryOfRegistration}
                  onChange={this.handleChange.bind(this, 'countryOfRegistration')}
                  onBlur={this.handleBlur.bind(this, 'countryOfRegistration')}
                  optional={true}
                  locale={this.context.i18n.locale}
                />
              )
            }) }
            { this.renderField({
              fieldName: 'commercialRegisterNo',
              info: this.comRegTooltiptext(),
              helpText: i18n.getMessage('Supplier.Messages.companyRegisterNumber.helpText')
            }) }
            { this.renderField({ fieldName: 'taxIdentificationNo' }) }
            { this.renderField({
              fieldName: 'currencyId',
              component: (
                <CurrencyField
                  actionUrl=''
                  value={supplier.currencyId}
                  onChange={this.handleChange.bind(this, 'currencyId')}
                  onBlur={this.handleBlur.bind(this, 'currencyId')}
                  optional={true}
                  locale={this.context.i18n.locale}
                />
              )
            }) }
            { this.renderField({ fieldName: 'vatIdentificationNo', disabled: Boolean(this.props.supplier.vatIdentificationNo) }) }
            { this.renderField({
              fieldName: 'noVatReason',
              labelText: ' ',
              component: (
                <p>
                  <input className='fa fa-fw' type='checkbox' onChange={this.handleCheckboxChange} disabled={Boolean(this.props.supplier.vatIdentificationNo)}></input>
                  {this.context.i18n.getMessage('Supplier.Messages.noVatId')}
                </p>
              )
            }) }
          </div>
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-offset-4 col-md-8">
                <Components.HelpBox>
                  <Components.HelpBoxItem title={this.context.i18n.getMessage('Supplier.Heading.companyRegistration')}>
                    <p>{this.context.i18n.getMessage('Supplier.Messages.pageHelpText')}</p>
                  </Components.HelpBoxItem>
                </Components.HelpBox>
              </div>
            </div>
            <br />
            { this.renderField({ fieldName: 'globalLocationNo', marked: true, disabled: Boolean(this.props.supplier.globalLocationNo) }) }
            { this.renderField({ fieldName: 'dunsNo', marked: true, disabled: Boolean(this.props.supplier.dunsNo)}) }
            { this.renderField({ fieldName: 'ovtNo', marked: true, disabled: Boolean(this.props.supplier.ovtNo)}) }
            { this.renderField({ fieldName: 'iban', marked: true }) }
          </div>
        </div>
        <div className='supplier-registration-form-submit'>
          <div className='text-right form-submit'>
            <ActionButton
              id='supplier-registration__cancel'
              style='link'
              onClick={this.handleCancel}
              label={this.context.i18n.getMessage('Supplier.Button.cancel')}
            />
            <ActionButton
              id='supplier-registration__continue'
              style='primary'
              onClick={this.handleUpdate}
              label={this.context.i18n.getMessage('Supplier.Button.continue')}
            />
          </div>
        </div>
      </form>
    );
  }
}

export default SupplierRegistrationEditorForm;
