import React, { PropTypes, Component } from 'react';
import BusinessPartnerFormRow from '../AttributeValueEditorRow.react.js';
import './BusinessPartner.css';
import Constraints from './BusinessPartnerConstraints';
import DateInput from '@opuscapita/react-dates/lib/DateInput';
import { BusinessPartner } from '../../api';
import serviceComponent from '@opuscapita/react-loaders/lib/serviceComponent';
import validator from './formValidator.js';

class BusinessPartnerForm extends Component {
  static propTypes = {
    businessPartner: PropTypes.object,
    onBusinessPartnerChange: PropTypes.func.isRequired,
    onChange: React.PropTypes.func,
    onCancel: React.PropTypes.func
  };

  static contextTypes = {
    i18n: React.PropTypes.object.isRequired,
    userData: React.PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      businessPartner: this.props.businessPartner,
      businessPartners: [],
      fieldErrors: {},
      hasVATId: Boolean(this.props.businessPartner.vatIdentificationNo)
    };
    this.api = new BusinessPartner();
  }

  componentWillMount() {
    let serviceRegistry = (service) => ({ url: `/isodata` });
    const CountryField = serviceComponent({ serviceRegistry, serviceName: 'isodata' , moduleName: 'isodata-countries', jsFileName: 'countries-bundle' });
    const CurrencyField = serviceComponent({ serviceRegistry, serviceName: 'isodata' , moduleName: 'isodata-currencies', jsFileName: 'currencies-bundle' });

    this.externalComponents = { CountryField, CurrencyField };

    this.constraints = new Constraints(this.context.i18n);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (JSON.stringify(this.props.businessPartner) !== JSON.stringify(nextProps.businessPartner)) {
      this.setState({
        businessPartner: nextProps.businessPartner,
        fieldErrors: {},
        hasVATId: Boolean(nextProps.businessPartner.vatIdentificationNo)
      });
    }

    this.constraints = new Constraints(nextContext.i18n);
  }

  componentDidMount() {
    this.api.all().then(businessPartners => {
      this.setState({ businessPartners: this.transformBusinessPartners(businessPartners) });
    });
  }

  transformBusinessPartners = businessPartners => {
    const businessPartnerId = this.state.businessPartner.id;
    let filteredBusinessPartners = businessPartners.filter(businessPartner => businessPartner.id !== businessPartnerId);
    filteredBusinessPartners.unshift('');
    return filteredBusinessPartners;
  };

  setFieldErrorsStates = (errors) => {
    this.setState({
      fieldErrors: Object.keys(errors).reduce((rez, fieldName) => ({
        ...rez,
        [fieldName]: errors[fieldName].map(msg => ({ message: msg }))
      }), this.state.fieldErrors)
    });
  };

  handleChange = (fieldName, event) => {
    let newValue;

    if (event && event.target) {
      newValue = event.target.value;
    } else {
      newValue = event;
    }

    if (this.props.onChange) {
      this.props.onChange(fieldName, this.state.businessPartner[fieldName], newValue);
    }

    this.setState({
      businessPartner: {
        ...this.state.businessPartner,
        [fieldName]: newValue
      }
    });
  };

  handleBlur = (fieldName) => {
    let constraints = this.constraints.forField(fieldName);

    this.setState({
      fieldErrors: Object.keys(constraints).reduce((rez, fieldName) => ({
        ...rez,
        [fieldName]: []
      }), this.state.fieldErrors)
    });

    const error = (errors) => {
      this.setFieldErrorsStates(errors);
    };

    constraints.id = {};
    constraints.parentId = {};

    validator.forUpdate(this.context.i18n).
      async(this.state.businessPartner, constraints, { fullMessages: false }).then(null, error);
  };

  handleCancel = event => {
    event.preventDefault();
    this.props.onCancel();
  };

  handleUpdate = event => {
    event.preventDefault();

    const { onBusinessPartnerChange } = this.props;
    const businessPartner = this.state.businessPartner;
    const constraints = { ...this.constraints.forUpdate(), id: {}, parentId: {} };

    if (!businessPartner.vatIdentificationNo && this.state.hasVATId) {
      this.setFieldErrorsStates({ noVatReason: [this.context.i18n.getMessage('BusinessPartner.Messages.clickCheckBox')] });
    } else {
      const success = () => {
        businessPartner.noVatReason = businessPartner.vatIdentificationNo ? null : 'No VAT Registration Number';
        if (!businessPartner.parentId) businessPartner.subEntityCode = null;
        onBusinessPartnerChange(businessPartner);
      };

      const error = (errors) => {
        this.setFieldErrorsStates(errors);
        onBusinessPartnerChange(null);
      };

      validator.forUpdate(this.context.i18n).
        async(businessPartner, constraints, { fullMessages: false }).then(success, error);
    }
  };

  handleCheckboxChange = () => {
    this.setFieldErrorsStates({ noVatReason: [] });
    this.setState({hasVATId: !this.state.hasVATId});
  };

  handleManagedChange = () => {
    const managed = !this.state.businessPartner.managed;
    if (managed) {
      this.constraints.addPresence('cityOfRegistration');
      this.constraints.addPresence('countryOfRegistration');
    } else {
      this.constraints.removePresence('cityOfRegistration');
      this.constraints.removePresence('countryOfRegistration');
    }

    this.setState({ businessPartner: { ...this.state.businessPartner, managed: managed } });
  };

  userIsAdmin = () => {
    return this.context.userData.roles.includes('admin');
  };

  comRegTooltiptext() {
    return (
      `${this.context.i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.text')}
      <ul>
        <li>${this.context.i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.de')}</li>
        <li>${this.context.i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.at')}</li>
        <li>${this.context.i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.fi')}</li>
        <li>${this.context.i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.se')}</li>
        <li>${this.context.i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.no')}</li>
        <li>${this.context.i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.ch')}</li>
        <li>${this.context.i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.us')}</li>
        <li>${this.context.i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.pl')}</li>
        <li>${this.context.i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.fr')}</li>
      </ul>`
    );
  }

  renderField = (attrs) => {
    const { businessPartner, fieldErrors } = this.state;
    const { fieldName } = attrs;
    const fieldNames = attrs.fieldNames || [fieldName];
    const constraints = this.constraints.forUpdate();

    let component = attrs.component ||
      <input className="form-control"
        type="text"
        value={ typeof businessPartner[fieldName] === 'string' ? businessPartner[fieldName] : '' }
        onChange={ this.handleChange.bind(this, fieldName) }
        onBlur={ this.handleBlur.bind(this, fieldName) }
        disabled={ attrs.disabled || false }
      />;

    let isRequired = fieldNames.some(name => {
      return constraints[name] && constraints[name].presence;
    });

    let rowErrors = fieldNames.reduce((rez, name) => rez.concat(fieldErrors[name] || []), []);

    return (
      <BusinessPartnerFormRow
        labelText={ attrs.labelText || this.context.i18n.getMessage(`BusinessPartner.Label.${fieldName}`) }
        required={ isRequired }
        marked={ attrs.marked }
        info={ attrs.info }
        rowErrors={ rowErrors }
      >
        { component }
      </BusinessPartnerFormRow>
    );
  };

  renderSubEntityField = () => {
    if (!this.state.businessPartner.parentId) return null;

    return this.renderField({ fieldName: 'subEntityCode' });
  };

  renderVirtualField = () => {
    if (!this.userIsAdmin()) return null;

    return this.renderField({
      fieldName: 'managed',
      component: (
        <div style={{ marginTop: '5px' }}>
          <input className='fa fa-fw' type='checkbox' onChange={this.handleManagedChange} checked={!this.state.businessPartner.managed}></input>
        </div>
      )
    });
  };

  render() {
    const i18n = this.context.i18n;
    const { businessPartner } = this.state;
    const { CountryField, CurrencyField } = this.externalComponents;

    return (
      <div>
        <form className="form-horizontal business-partner-form">
          {this.renderVirtualField()}
          {this.renderField({
            fieldName: 'parentId',
            component: (
              <select
                className="form-control"
                value={businessPartner.parentId}
                onChange={this.handleChange.bind(this, 'parentId')}
                onBlur={() => null}
                disabled={!this.userIsAdmin()}>
                  {this.state.businessPartners.map((sup, index) => {
                    return <option key={index} value={sup.id}>{sup.name}</option>;
                  })}
              </select>
            )
          })}
          { this.renderSubEntityField() }
          { this.renderField({ fieldName: 'name' }) }
          { this.renderField({ fieldName: 'homePage' }) }
          { this.renderField({
            fieldName: 'foundedOn',
            component: (
              <DateInput
                className="form-control"
                locale={['en', 'de'].includes(i18n.locale) ? i18n.locale : 'en'}
                dateFormat={i18n.dateFormat}
                value={businessPartner.foundedOn ? new Date(businessPartner.foundedOn) : ''}
                onChange={this.handleChange.bind(this, 'foundedOn')}
                onBlur={this.handleBlur.bind(this, 'foundedOn')}
                variants={[]}
              />
            )
          }) }

          { this.renderField({ fieldName: 'legalForm' }) }
          { this.renderField({ fieldName: 'cityOfRegistration' }) }
          { this.renderField({
            fieldName: 'countryOfRegistration',
            component: (
              <CountryField
                actionUrl=''
                value={this.state.businessPartner.countryOfRegistration}
                onChange={this.handleChange.bind(this, 'countryOfRegistration')}
                onBlur={this.handleBlur.bind(this, 'countryOfRegistration')}
                locale={i18n.locale}
              />
            )
          })}
          { this.renderField({
            fieldName: 'currencyId',
            component: (
              <CurrencyField
                actionUrl=''
                optional={true}
                value={this.state.businessPartner.currencyId}
                onChange={this.handleChange.bind(this, 'currencyId')}
                onBlur={this.handleBlur.bind(this, 'currencyId')}
                locale={i18n.locale}
              />
            )
          })}
          { this.renderField({ fieldName: 'commercialRegisterNo', info: this.comRegTooltiptext() }) }
          { this.renderField({ fieldName: 'taxIdentificationNo' }) }
          { this.renderField({ fieldName: 'vatIdentificationNo', marked: true, disabled: !this.userIsAdmin() }) }
          { this.renderField({
                  fieldName: 'noVatReason',
                  labelText: ' ',
                  component: (
                    <p>
                      <input className='fa fa-fw' type='checkbox' onChange={this.handleCheckboxChange} checked={!this.state.hasVATId} disabled={!this.userIsAdmin()}></input>
                      {this.context.i18n.getMessage('BusinessPartner.Messages.noVatId')}
                    </p>
                  )
                }) }
          { this.renderField({ fieldName: 'globalLocationNo', marked: true, disabled: !this.userIsAdmin() }) }
          { this.renderField({ fieldName: 'dunsNo', marked: true, disabled: !this.userIsAdmin() }) }
          { this.renderField({ fieldName: 'ovtNo', marked: true, disabled: !this.userIsAdmin() }) }

          <div className='business-partner-form-submit'>
            <div className='text-right form-submit'>
              <button id='business-partner-editor__form-submit' className="btn btn-primary" onClick={ this.handleUpdate }>
                { i18n.getMessage('BusinessPartner.Button.save') }
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default BusinessPartnerForm;
