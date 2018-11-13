import React, { Component } from 'react';
import ActionButton from '../ActionButton.react';
import validator from './supplierBankAccountValidator';
import './SupplierBankAccountEditForm.css';
import SupplierBankAccountConstraints from './supplierBankAccountConstraints';
import SupplierBankAccountEditFormRow from '../AttributeValueEditorRow.react.js';
import serviceComponent from '@opuscapita/react-loaders/lib/serviceComponent';


class SupplierBankAccountEditForm extends Component {
  static propTypes = {
    account: React.PropTypes.object.isRequired,
    errors: React.PropTypes.object,
    editMode: React.PropTypes.oneOf(['edit', 'create']),
    onSave: React.PropTypes.func.isRequired,
    onUpdate: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func.isRequired
  };

  static contextTypes = {
    i18n: React.PropTypes.object.isRequired
  };

  static defaultProps = {
    editMode: 'create',
    errors: {}
  };

  state = {
    account: this.props.account,
    errors: this.props.errors || {}
  };

  componentWillMount() {
    let serviceRegistry = (service) => ({ url: `/isodata` });
    const CountryField = serviceComponent({
      serviceRegistry,
      serviceName: 'isodata',
      moduleName: 'isodata-countries',
      jsFileName: 'countries-bundle'
    });

    this.externalComponents = {CountryField};

    this.constraints = new SupplierBankAccountConstraints(this.context.i18n);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.account) {
      this.setState({account: nextProps.account, errors: nextProps.errors || {}});
    }

    this.constraints = new SupplierBankAccountConstraints(nextContext.i18n);
  }

  setFieldErrorsStates = (errors) => {
    this.setState({
      errors: Object.keys(errors).reduce((rez, fieldName) => ({
        ...rez,
        [fieldName]: errors[fieldName].map(msg => ({ message: msg }))
      }), this.state.errors)
    });
  };

  handleSaveOrUpdate = (event) => {
    event.preventDefault();
    const account = this.state.account;
    const constraints = { ...this.constraints.all, supplierId: {} };

    let success = () => {
      if (this.props.editMode === 'edit') {
        this.props.onUpdate(account);
      } else {
        this.props.onSave(account);
      }
    };

    let error = (errors) => {
      this.setFieldErrorsStates(errors);
    };

    validator.validate().async(account, constraints, { fullMessages: false }).then(success, error);
  };

  handleCancel = () => {
    this.props.onCancel(this.state.account);
  };

  handleCountryChange = (fieldName, country) => {
    if (this.props.onChange) this.props.onChange(fieldName, this.state.account[fieldName], country);

    this.setState({
      account: {
        ...this.state.account,
        [fieldName]: country
      }
    });
  };

  handleChange = (fieldName, event) => {
    let newValue = event.target.value;

    if (this.props.onChange) {
      this.props.onChange(fieldName, this.state.account[fieldName], newValue);
    }

    this.setState({
      account: {
        ...this.state.account,
        [fieldName]: newValue
      }
    });
  };

  handleBlur = (fieldName) => {
    const constraints = { ...this.constraints.forField(fieldName), supplierId: {} };

    this.setState({
      errors: Object.keys(constraints).reduce((rez, fieldName) => ({
        ...rez,
        [fieldName]: []
      }), this.state.errors)
    });

    let error = (errors) => {
      this.setFieldErrorsStates(errors);
    };

    validator.validate().async(this.state.account, constraints, { fullMessages: false }).then(null, error);
  };

  renderField = (attrs) => {
    const { account, errors } = this.state;
    const { fieldName } = attrs;
    const fieldNames = attrs.fieldNames || [fieldName];
    const constraints = this.constraints.all;

    let component = attrs.component ||
      <input className='form-control'
        type='text'
        value={ typeof account[fieldName] === 'string' ? account[fieldName] : '' }
        onChange={ this.handleChange.bind(this, fieldName) }
        onBlur={ this.handleBlur.bind(this, fieldName) }
      />;

    const isRequired = fieldNames.some(name => constraints[name] && constraints[name].presence);
    let rowErrors = fieldNames.reduce((rez, name) => rez.concat(errors[name] || []), []);

    return (
      <SupplierBankAccountEditFormRow
        labelText={ this.context.i18n.getMessage(`Supplier.BankAccount.Label.${fieldName}`) }
        required={ isRequired }
        marked = { attrs.marked }
        rowErrors={ rowErrors }
      >
        { component }
      </SupplierBankAccountEditFormRow>
    );
  };

  render() {
    const { account } = this.state;
    const { CountryField } = this.externalComponents;

    return (
      <div>
        <form className='form-horizontal' onSubmit={this.handleSaveOrUpdate}>
          { this.renderField({ fieldName: 'bankName' }) }
          { this.renderField({ fieldName: 'accountNumber', marked: true }) }
          { this.renderField({ fieldName: 'bankIdentificationCode' }) }
          { this.renderField({ fieldName: 'bankCode' }) }
          { this.renderField({
            fieldName: 'bankCountryKey',
            component: (
              <CountryField
                actionUrl=''
                value={account['bankCountryKey']}
                onChange={this.handleCountryChange.bind(this, 'bankCountryKey')}
                onBlur={this.handleBlur.bind(this, 'bankCountryKey')}
                optional={true}
                locale={this.context.i18n.locale}
              />
            )
          })}

          { this.renderField({ fieldName: 'extBankControlKey' }) }
          { this.renderField({ fieldName: 'bankgiro', marked: true }) }
          { this.renderField({ fieldName: 'plusgiro', marked: true }) }
          { this.renderField({ fieldName: 'isrNumber' }) }

          <div className='col-sm-12 text-right address-form-submit'>
            <ActionButton
              style='link'
              onClick={this.handleCancel}
              label={this.context.i18n.getMessage('Supplier.Button.cancel')}
            />
            <ActionButton
              style='primary'
              type='submit'
              label={this.context.i18n.getMessage('Supplier.Button.save')}
            />
          </div>
        </form>
        <p>{this.context.i18n.getMessage('Supplier.BankAccount.Message.identifierRequired')}</p>
      </div>
    );
  }
}

export default SupplierBankAccountEditForm;
