import React, {Component} from 'react';
import Button from 'react-bootstrap/lib/Button';
import CountryTableField from '../CountryTableField.react.js';

/**
 * Supplier contact list table
 *
 * @author Dmitry Divin
 */
class SupplierBankAccountListTable extends Component {

  static propTypes = {
    accounts: React.PropTypes.array.isRequired,
    onEdit: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired,
    onView: React.PropTypes.func.isRequired,
    readOnly: React.PropTypes.bool
  };

  onEdit = (account) => {
    this.props.onEdit(account);
  };

  onDelete = (account) => {
    if (!confirm(this.props.i18n.getMessage('SupplierBankAccountEditor.Confirmation.delete'))) {
      return;
    }
    this.props.onDelete(account);
  };

  onView = (account) => {
    this.props.onView(account);
  };

  render() {

    const accounts = this.props.accounts;

    return (
      <table className="table">
        <thead>
        <tr>
          <th>{this.props.i18n.getMessage('SupplierBankAccountEditor.Label.accountNumber')}</th>
          <th>{this.props.i18n.getMessage('SupplierBankAccountEditor.Label.bankName')}</th>
          <th>{this.props.i18n.getMessage('SupplierBankAccountEditor.Label.bankIdentificationCode')}</th>
          <th>{this.props.i18n.getMessage('SupplierBankAccountEditor.Label.bankCountryKey')}</th>
          <th>{this.props.i18n.getMessage('SupplierBankAccountEditor.Label.bankCode')}</th>
          <th>{this.props.i18n.getMessage('SupplierBankAccountEditor.Label.extBankControlKey')}</th>
          <th>{this.props.i18n.getMessage('SupplierBankAccountEditor.Label.swiftCode')}</th>
          <th>&nbsp;</th>
        </tr>
        </thead>
        <tbody>
        {accounts.map((account, index) => {
            return (
              <tr key={'account-' + index}>
                <td>{ account.accountNumber}</td>
                <td>{ account.bankIdentificationCode }</td>
                <td>{ account.bankName }</td>
                <CountryTableField countryId={account.bankCountryKey} actionUrl={this.props.actionUrl} />
                <td>{ account.bankCode }</td>
                <td>{ account.extBankControlKey }</td>
                <td>{ account.swiftCode }</td>
                <td className="text-right">
                  {this.props.readOnly ? (
                    <nobr>
                      <Button onClick={this.onView.bind(this, account)} bsSize="sm">
                        <span className='glyphicon glyphicon-eye-open'/>&nbsp;
                        {this.props.i18n.getMessage('SupplierBankAccountEditor.Button.view')}
                      </Button>
                    </nobr>
                  ) : (
                    <nobr>
                      <Button onClick={this.onEdit.bind(this, account)} bsSize="sm">
                        <span className="glyphicon glyphicon-edit"/>&nbsp;
                        {this.props.i18n.getMessage('SupplierBankAccountEditor.Button.edit')}
                      </Button>
                      <Button onClick={this.onDelete.bind(this, account)} bsSize="sm">
                        <span className="glyphicon glyphicon-trash"/>&nbsp;
                        {this.props.i18n.getMessage('SupplierBankAccountEditor.Button.delete')}
                      </Button>
                    </nobr>
                  )}
                </td>
              </tr>
            );
          }
        )}
        </tbody>
      </table>
    );
  }
}

export default SupplierBankAccountListTable;
