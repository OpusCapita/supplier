import React, { PropTypes, Component } from 'react';
import './SupplierCreator.css';
import SupplierCreatorFormRow from '../AttributeValueEditorRow.react.js';
import SupplierConstraints from '../../utils/validatejs/supplierConstraints';
import DateInput from '@opuscapita/react-dates/lib/DateInput';
import { Supplier } from '../../api';
import serviceComponent from '@opuscapita/react-loaders/lib/serviceComponent';
import validator from '../../utils/validatejs/supplierValidator.js';

class SupplierCreatorForm extends Component {
  static propTypes = {
    supplier: PropTypes.object,
    onSupplierCreate: PropTypes.func.isRequired,
    onChange: React.PropTypes.func,
    onCancel: React.PropTypes.func
  };

  static contextTypes = {
    i18n: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      supplier: this.props.supplier,
      suppliers: [],
      fieldErrors: {},
      hasVATId: Boolean(this.props.supplier.vatIdentificationNo)
    };
    this.supplierApi = new Supplier();
  }

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
        supplier: nextProps.supplier,
        fieldErrors: {},
        hasVATId: Boolean(nextProps.supplier.vatIdentificationNo)
      });
    }

    this.constraints = new SupplierConstraints(nextContext.i18n);
  }

  componentDidMount() {
    this.supplierApi.getSuppliers().then(suppliers => {
      this.setState({ suppliers: this.transformSuppliers(suppliers) });
    });
  }

  transformSuppliers = suppliers => {
    const supplierId = this.state.supplier.id;
    let filteredSuppliers = suppliers.filter(supplier => supplier.id !== supplierId);
    filteredSuppliers.unshift('');
    return filteredSuppliers;
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

    constraints.parentId = {};

    validator.forCreate(this.context.i18n).
      async(this.state.supplier, constraints, { fullMessages: false }).then(null, error);
  };

  handleCancel = event => {
    event.preventDefault();
    this.props.onCancel();
  };

  handleCreate = event => {
    event.preventDefault();

    const { onSupplierCreate } = this.props;
    const supplier = this.state.supplier;
    const constraints = { ...this.constraints.forCreate(), parentId: {} };

    if (!supplier.vatIdentificationNo && this.state.hasVATId) {
      this.setFieldErrorsStates({ noVatReason: [this.context.i18n.getMessage('Supplier.Messages.clickCheckBox')] });
    } else {
      const success = () => {
        supplier.noVatReason = supplier.vatIdentificationNo ? null : 'No VAT Registration Number';
        if (!supplier.parentId) supplier.subEntityCode = null;
        onSupplierCreate(supplier);
      };

      const error = (errors) => {
        this.setFieldErrorsStates(errors);
        onSupplierCreate(null);
      };

      validator.forCreate(this.context.i18n).
        async(supplier, constraints, { fullMessages: false }).then(success, error);
    }
  };

  handleHasVatidChange = () => {
    this.setFieldErrorsStates({ noVatReason: [] });
    this.setState({hasVATId: !this.state.hasVATId});
  };

  handleManagedChange = () => {
    const managed = !this.state.supplier.managed;
    if (managed) {
      this.constraints.addPresence('cityOfRegistration');
      this.constraints.addPresence('countryOfRegistration');
    } else {
      this.constraints.removePresence('cityOfRegistration');
      this.constraints.removePresence('countryOfRegistration');
    }

    this.setState({ supplier: { ...this.state.supplier, managed: managed } });
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
    const constraints = this.constraints.forCreate();

    let component = attrs.component ||
      <input className="form-control"
        type="text"
        value={ typeof supplier[fieldName] === 'string' ? supplier[fieldName] : '' }
        onChange={ this.handleChange.bind(this, fieldName) }
        onBlur={ this.handleBlur.bind(this, fieldName) }
      />;

    let isRequired = fieldNames.some(name => {
      return constraints[name] && constraints[name].presence;
    });

    let rowErrors = fieldNames.reduce((rez, name) => rez.concat(fieldErrors[name] || []), []);

    return (
      <SupplierCreatorFormRow
        labelText={ attrs.labelText || this.context.i18n.getMessage(`Supplier.Label.${fieldName}`) }
        required={ isRequired }
        marked = { attrs.marked }
        info = { attrs.info }
        rowErrors={ rowErrors }
      >
        { component }
      </SupplierCreatorFormRow>
    );
  };

  renderSubEntityField = () => {
    if (!this.state.supplier.parentId) return null;

    return this.renderField({ fieldName: 'subEntityCode' });
  };

  render() {
    const i18n = this.context.i18n;
    const { supplier } = this.state;
    const { CountryField, CurrencyField } = this.externalComponents;
    const foundedOn = supplier['foundedOn'] ? new Date(supplier['foundedOn']) : '';

    return (
      <div>
        <form className="form-horizontal supplier-form">
          {this.renderField({
            fieldName: 'managed',
            component: (
              <div style={{ marginTop: '5px' }}>
                <input className='fa fa-fw' type='checkbox' onChange={this.handleManagedChange} checked={!supplier.managed}></input>
              </div>
            )
          })}
          {this.renderField({
            fieldName: 'parentId',
            component: (
              <select
                className="form-control"
                value={supplier.parentId}
                onChange={this.handleChange.bind(this, 'parentId')}
                onBlur={() => null}
                disabled={!this.props.userRoles.includes('admin')}>
                  {this.state.suppliers.map((sup, index) => {
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
                value={foundedOn}
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
                value={this.state.supplier['countryOfRegistration']}
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
                value={this.state.supplier['currencyId']}
                onChange={this.handleChange.bind(this, 'currencyId')}
                onBlur={this.handleBlur.bind(this, 'currencyId')}
                locale={i18n.locale}
              />
            )
          })}
          { this.renderField({ fieldName: 'commercialRegisterNo', info: this.comRegTooltiptext() }) }
          { this.renderField({ fieldName: 'taxIdentificationNo' }) }
          { this.renderField({ fieldName: 'vatIdentificationNo', marked: true }) }
          { this.renderField({
              fieldName: 'noVatReason',
              labelText: ' ',
              component: (
                <p>
                  <input className='fa fa-fw' type='checkbox' onChange={this.handleHasVatidChange} checked={!this.state.hasVATId}></input>
                  {this.context.i18n.getMessage('Supplier.Messages.noVatId')}
                </p>
              )
            }) }
          { this.renderField({ fieldName: 'globalLocationNo', marked: true }) }
          { this.renderField({ fieldName: 'dunsNo', marked: true }) }
          { this.renderField({ fieldName: 'ovtNo', marked: true }) }

          <div className='supplier-form-submit'>
            <div className='text-right form-submit'>
              <button id='supplier-editor__form-submit' className="btn btn-primary" onClick={ this.handleCreate }>
                { i18n.getMessage('Supplier.Button.save') }
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default SupplierCreatorForm;
