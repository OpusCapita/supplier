import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import validator from 'validate.js';
import './SupplierAddressEditorForm.css';
import SupplierAddressFormConstraints from './SupplierAddressFormConstraints';
import SupplierAddressEditorFormRow from '../AttributeValueEditorRow.react.js';
import ActionButton from '../../components/ActionButton.react';
const ADDRESS_TYPES = ['default', 'invoice', 'rma', 'plant'];
import serviceComponent from '@opuscapita/react-loaders/lib/serviceComponent';

/**
 * Supplier address edit form
 */
class SupplierAddressEditorForm extends Component {
  static propTypes = {
    supplierAddress: React.PropTypes.object.isRequired,
    errors: React.PropTypes.object,
    editMode: React.PropTypes.oneOf(['edit', 'create']),
    onSave: React.PropTypes.func.isRequired,
    onUpdate: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func.isRequired
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired
  };

  static defaultProps = {
    editMode: 'create',
    errors: {}
  };

  state = {
    supplierAddress: this.props.supplierAddress,
    errors: this.props.errors || {}
  };

  componentWillMount() {
    let serviceRegistry = (service) => ({ url: `/isodata` });
    const CountryField = serviceComponent({ serviceRegistry, serviceName: 'isodata' , moduleName: 'isodata-countries', jsFileName: 'countries-bundle' });

    this.externalComponents = { CountryField };
    this.constraints = SupplierAddressFormConstraints(this.context.i18n);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.supplierAddress) {
      this.setState({ supplierAddress: nextProps.supplierAddress, errors: nextProps.errors || {} });
    }

    this.constraints = SupplierAddressFormConstraints(nextContext.i18n);
  }

  handleSaveOrUpdate = (event) => {
    event.preventDefault();

    const supplierAddress = this.state.supplierAddress;
    let errors = validator(supplierAddress, this.constraints, { fullMessages: false });

    if (!errors) {
      if (this.props.editMode === 'edit') {
        this.props.onUpdate(supplierAddress);
      } else {
        this.props.onSave(supplierAddress);
      }
    } else {
      let errorsReformatted = Object.keys(errors).map(key => ({ [key]:
        errors[key].map((element)=>({
          message: element
        }))})).reduce((current, prev, {}) => {
        return Object.assign(current, prev);
      });

      this.setState({ errors: errorsReformatted });
    }
  };

  handleCancel = () => {
    this.props.onCancel(this.state.supplierAddress);
  };

  handleCountryChange = (fieldName, country) => {
    if (this.props.onChange) {
      this.props.onChange(fieldName, this.state.supplierAddress[fieldName], country);
    }

    this.setState({
      supplierAddress: {
        ...this.state.supplierAddress,
        [fieldName]: country
      }
    });
  };

  handleChange = (fieldName, event) => {
    let newValue = event.target.value;

    if (this.props.onChange) {
      this.props.onChange(fieldName, this.state.supplierAddress[fieldName], newValue);
    }

    this.setState({
      supplierAddress: {
        ...this.state.supplierAddress,
        [fieldName]: newValue
      }
    });
  };

  handleBlur = (fieldName/* , event*/) => {
    const errors = validator(
      this.state.supplierAddress, {
        [fieldName]: this.constraints[fieldName]
      }, {
        fullMessages: false
      }
    );

    this.setState({
      errors: {
        ...this.state.errors,
        [fieldName]: errors ?
          errors[fieldName].map(msg => ({ message: msg })) :
          []
      }
    });
  };

  renderField = attrs => {
    const { supplierAddress, errors } = this.state;
    const { fieldName } = attrs;
    const fieldNames = attrs.fieldNames || [fieldName];

    let component = attrs.component ||
      <input className="form-control"
        type="text"
        value={ typeof supplierAddress[fieldName] === 'string' ? supplierAddress[fieldName] : '' }
        onChange={ this.handleChange.bind(this, fieldName) }
        onBlur={ this.handleBlur.bind(this, fieldName) }
      />;

    let isRequired = fieldNames.some(name => {
      return this.constraints[name] && this.constraints[name].presence;
    });

    let rowErrors = fieldNames.reduce(
      (rez, name) => rez.concat(errors[name] || []),
      []
    );

    return (
      <SupplierAddressEditorFormRow
        labelText={ this.context.i18n.getMessage(`SupplierAddressEditor.Label.${fieldName}`) }
        required={ isRequired }
        rowErrors={ rowErrors }
      >
        { component }
      </SupplierAddressEditorFormRow>
    );
  };

  render() {
    const { supplierAddress } = this.state;
    const { CountryField } = this.externalComponents;

    let typeOptions = [];

    typeOptions.push({
      value: '',
      label: this.context.i18n.getMessage('SupplierAddressEditor.Select.type'),
      disabled: true
    });

    for (const addressType of ADDRESS_TYPES) {
      typeOptions.push({
        value: addressType,
        label: this.context.i18n.getMessage(`SupplierAddressEditor.AddressType.${addressType}`),
        disabled: false
      });
    }

    return (
      <form className="form-horizontal" onSubmit={this.handleSaveOrUpdate}>
        { this.renderField({
            fieldName: 'type',
            component: (
              <select className="form-control"
                value={supplierAddress['type'] || ''}
                onChange={this.handleChange.bind(this, 'type')}
                onBlur={this.handleBlur.bind(this, 'type')}
              >
                {typeOptions.map((item, index) => {
                  return (<option key={index} disabled={item.disabled} value={item.value}>{item.label}</option>);
                })}
              </select>
            )
          }) }

        { this.renderField({ fieldName: 'name' }) }
        { this.renderField({ fieldName: 'street1' }) }
        { this.renderField({ fieldName: 'street2' }) }
        { this.renderField({ fieldName: 'street3' }) }
        { this.renderField({ fieldName: 'zipCode' }) }
        { this.renderField({ fieldName: 'city' }) }

        { this.renderField({
            fieldName: 'countryId',
            component: (
              <CountryField
                actionUrl=''
                value={supplierAddress['countryId']}
                onChange={this.handleCountryChange.bind(this, 'countryId')}
                onBlur={this.handleBlur.bind(this, 'countryId')}
                optional={true}
                locale={this.context.i18n.locale}
              />
            )
          })}

        { this.renderField({ fieldName: 'areaCode' }) }
        { this.renderField({ fieldName: 'state' }) }
        { this.renderField({ fieldName: 'pobox' }) }
        { this.renderField({ fieldName: 'poboxZipCode' }) }
        { this.renderField({ fieldName: 'phoneNo' }) }
        { this.renderField({ fieldName: 'faxNo' }) }
        { this.renderField({ fieldName: 'email' }) }

        <div className="col-sm-12 text-right address-form-submit">
          <ActionButton
            style='link'
            onClick={this.handleCancel}
            label={this.context.i18n.getMessage('SupplierAddressEditor.Button.cancel')}
          />
          <ActionButton
            style='primary'
            type='submit'
            label={this.context.i18n.getMessage('SupplierAddressEditor.Button.save')}
          />
        </div>
      </form>
    );
  }
}

export default SupplierAddressEditorForm;
