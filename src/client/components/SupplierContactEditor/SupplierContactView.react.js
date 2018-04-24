import React, { Component, PropTypes } from 'react';
import SupplierContactViewRow from '../AttributeValueEditorRow.react.js';
import ActionButton from '../ActionButton.react';

export default class SupplierContactView extends Component {
  static propTypes = {
    contact: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired
  };

  translatedFieldValue = (name, value) => {
    return value ? this.context.i18n.getMessage(`Supplier.Contact.${name}.${value}`) : '-';
  };

  renderField = (attrs) => {
    const { contact } = this.props;
    const fieldName = attrs.fieldName;
    const labelText = this.context.i18n.getMessage(`Supplier.Contact.Label.${fieldName}`);
    const component = attrs.component || contact[fieldName] || '-'
    return (
      <SupplierContactViewRow labelText={ labelText }>
        <p style={ { marginTop: '7px' } }>{ component }</p>
      </SupplierContactViewRow>
    );
  };

  render() {
    const contact = this.props.contact;

    return (
      <div className="form-horizontal">
        { this.renderField({
          fieldName: 'contactType',
          component:  this.translatedFieldValue('Type', contact.contactType) }) }
        { this.renderField({
          fieldName: 'department',
          component:  this.translatedFieldValue('Department', contact.department) }) }
        { this.renderField({ fieldName: 'title' }) }
        { this.renderField({ fieldName: 'firstName' }) }
        { this.renderField({ fieldName: 'lastName' }) }
        { this.renderField({ fieldName: 'email' }) }
        { this.renderField({ fieldName: 'phone' }) }
        { this.renderField({ fieldName: 'mobile' }) }
        { this.renderField({ fieldName: 'fax' }) }
        <ActionButton
          id='supplier-contact-editor__close'
          onClick={this.props.onClose}
          label={this.context.i18n.getMessage('Supplier.Button.close')}
        />
      </div>
    );
  }
};
