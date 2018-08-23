import React, { Component, PropTypes } from 'react';
import SupplierAddressViewRow from '../AttributeValueEditorRow.react.js';
import ActionButton from '../ActionButton.react';
import CountryView from '../CountryView.react';

export default class SupplierAddressView extends Component {
  static propTypes = {
    address: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired
  };

  translatedFieldValue = (name, value) => {
    return value ? this.context.i18n.getMessage(`Supplier.Address.${name}.${value}`) : '-';
  };

  renderField = (attrs) => {
    const { supplierAddress } = this.props;
    const fieldName = attrs.fieldName;
    const labelText = this.context.i18n.getMessage(`Supplier.Address.Label.${fieldName}`);
    const component = attrs.component || supplierAddress[fieldName] || '-'
    return (
      <SupplierAddressViewRow labelText={ labelText }>
        <p style={ { marginTop: '7px' } }>{ component }</p>
      </SupplierAddressViewRow>
    );
  };

  render() {
    const address = this.props.supplierAddress;

    return (
      <div className="form-horizontal">
        { this.renderField({
          fieldName: 'type',
          component:  this.translatedFieldValue('Type', address.type) }) }
        { this.renderField({ fieldName: 'name' }) }
        { this.renderField({ fieldName: 'street1' }) }
        { this.renderField({ fieldName: 'street2' }) }
        { this.renderField({ fieldName: 'street3' }) }
        { this.renderField({ fieldName: 'zipCode' }) }
        { this.renderField({ fieldName: 'city' }) }
        { this.renderField({
          fieldName: 'countryId',
          component: <CountryView countryId={address.countryId} /> }) }
        { this.renderField({ fieldName: 'areaCode' }) }
        { this.renderField({ fieldName: 'state' }) }
        { this.renderField({ fieldName: 'pobox' }) }
        { this.renderField({ fieldName: 'poboxZipCode' }) }
        { this.renderField({ fieldName: 'phoneNo' }) }
        { this.renderField({ fieldName: 'faxNo' }) }
        { this.renderField({ fieldName: 'email' }) }
        <ActionButton
          id='supplier-address-editor__close'
          onClick={this.props.onClose}
          label={this.context.i18n.getMessage('Supplier.Button.close')}
        />
      </div>
    );
  }
};
