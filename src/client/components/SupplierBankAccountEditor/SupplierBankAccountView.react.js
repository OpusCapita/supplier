import React, { Component, PropTypes } from 'react';
import SupplierBankAccountViewRow from '../AttributeValueEditorRow.react.js';
import ActionButton from '../ActionButton.react';
import CountryView from '../CountryView.react';

export default class SupplierBankAccountView extends Component {
  static propTypes = {
    account: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired
  };

  renderField = (attrs) => {
    const { account } = this.props;
    const fieldName = attrs.fieldName;
    const labelText = this.context.i18n.getMessage(`Supplier.BankAccount.Label.${fieldName}`);
    const component = attrs.component || account[fieldName] || '-';
    return (
      <SupplierBankAccountViewRow labelText={ labelText }>
        <p style={ { marginTop: '7px' } }>{ component }</p>
      </SupplierBankAccountViewRow>
    );
  };

  render() {
    return (
      <div className="form-horizontal">
        { this.renderField({ fieldName: 'bankName' }) }
        { this.renderField({ fieldName: 'accountNumber' }) }
        { this.renderField({ fieldName: 'bankIdentificationCode' }) }
        { this.renderField({ fieldName: 'bankCode' }) }
        { this.renderField({
          fieldName: 'bankCountryKey',
          component: <CountryView countryId={this.props.account.bankCountryKey} />
        }) }
        { this.renderField({ fieldName: 'extBankControlKey' })}
        { this.renderField({ fieldName: 'bankgiro' })}
        { this.renderField({ fieldName: 'plusgiro' })}
        { this.renderField({ fieldName: 'isrNumber' })}
        <ActionButton
          id='supplier-bank-editor__close'
          onClick={this.props.onClose}
          label={this.context.i18n.getMessage('Supplier.Button.close')}
        />
      </div>
    );
  }
};
