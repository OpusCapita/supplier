import React, { Component } from "react";
import validationMessages from '../../utils/validatejs/i18n';
import i18nMessages from "../../i18n";
import SupplierBankAccountEditForm from "./SupplierBankAccountEditForm.react.js";
import SupplierBankAccountView from "./SupplierBankAccountView.react.js";
import DisplayTable from "../DisplayTable/DisplayTable.react.js";
import DisplayRow from "../DisplayTable/DisplayRow.react.js";
import DisplayField from "../DisplayTable/DisplayField.react.js";
import CountryView from "../CountryView.react.js";
import ActionButton from '../ActionButton.react';
import { BankAccount } from '../../api';
import UserAbilities from '../../UserAbilities';

class SupplierBankAccountEditor extends Component {

  static propTypes = {
    supplierId: React.PropTypes.string,
    userRoles: React.PropTypes.array.isRequired,
    username: React.PropTypes.string,
    onChange: React.PropTypes.func,
    onUnauthorized: React.PropTypes.func
  };

  static contextTypes = {
    i18n: React.PropTypes.object.isRequired,
    showNotification: React.PropTypes.func
  };

  static defaultProps = {
    onChange: function(event) {
      if (event.isDirty) {
        console.log('data in form changed');
      } else {
        console.log('data in form committed or canceled')
      }
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      accounts: [],
      account: null,
      loadErrors: false
    };

    this.bankAccountApi = new BankAccount();
    this.userAbilities = new UserAbilities(props.userRoles);
  }

  componentWillMount() {
    this.context.i18n.register('SupplierValidatejs', validationMessages);
    this.context.i18n.register('Supplier', i18nMessages);
  }

  componentDidMount() {
    this.loadBankAccounts();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextContext.i18n){
      nextContext.i18n.register('SupplierValidatejs', validationMessages);
      nextContext.i18n.register('Supplier', i18nMessages);
    }
  }

  handleDelete = (account) => {
    let supplierId = this.props.supplierId;

    this.bankAccountApi.deleteBankAccount(supplierId, account.id).then(() => {
      let accounts = this.state.accounts;
      const index = accounts.findIndex(bankAccount => bankAccount.id === account.id);

      if (index === -1) {
        throw new Error(`Not found bank account for bankAccountId [${account.id}]`);
      }
      accounts.splice(index, 1);

      this.setState({ accounts: accounts, account: null });

      const message = this.context.i18n.getMessage('Supplier.BankAccount.Message.deleted');
      if(this.context.showNotification) this.context.showNotification(message, 'info');
    }).catch((response) => {
      if (response.status === 401) {
        this.props.onUnauthorized();
      } else {
        console.log(`Bad request by SupplierID=${supplierId} and ContactID=${account.id}`);

        const message = this.context.i18n.getMessage('Supplier.BankAccount.Message.deleteFailed');
        if(this.context.showNotification) this.context.showNotification(message, 'error');
      }
    });
  };

  addOnClick = () => {
    this.props.onChange({ isDirty: true });
    this.setState({ account: {}, editMode: 'create', errors: null });
  };

  handleUpdate = (account) => {
    let supplierId = this.props.supplierId;
    account.changedBy = this.props.username;// eslint-disable-line no-param-reassign

    this.bankAccountApi.updateBankAccount(supplierId, account.id, account).then(updatedAccount => {
        let accounts = this.state.accounts;
        const index = accounts.findIndex(bankAccount => bankAccount.id === account.id);

        if (index === -1) {
          throw new Error(`Not found account by ContactID=${account.id}`);
        }
        accounts[index] = updatedAccount;

        this.props.onChange({ isDirty: false });
        this.setState({ accounts: accounts, account: null });

        const message = this.context.i18n.getMessage('Supplier.BankAccount.Message.updated');
        if(this.context.showNotification) this.context.showNotification(message, 'info');
      }).catch((response) => {
        if (response.status === 401) {
          this.props.onUnauthorized();
        } else {
          console.log(`Bad request by SupplierID=${supplierId} and ContactID=${account.id}`);

          const message = this.context.i18n.getMessage('Supplier.BankAccount.Message.updateFailed');
          if(this.context.showNotification) this.context.showNotification(message, 'error');
        }
      });
  };

  handleSave = (account) => {
    let supplierId = this.props.supplierId;

    account.supplierId = supplierId;
    account.createdBy = this.props.username;
    account.changedBy = this.props.username;

    this.bankAccountApi.createBankAccount(supplierId, account).then(createdAccount => {
        let accounts = this.state.accounts;
        accounts.push(createdAccount);

        this.props.onChange({ isDirty: false });
        this.setState({ accounts: accounts, account: null });

        const message = this.context.i18n.getMessage('Supplier.BankAccount.Message.saved');
        if(this.context.showNotification) this.context.showNotification(message, 'info');
      }).catch((response) => {
        if (response.status === 401) {
          this.props.onUnauthorized();
        } else {
          console.log(`Bad request by SupplierID=${supplierId} and ContactID=${account.id}`);

          let message = this.context.i18n.getMessage('Supplier.BankAccount.Message.saveFailed');
          if(this.context.showNotification) this.context.showNotification(message, 'error');
        }
      });
  };

  handleCancel = () => {
    console.log(this.props);
    this.props.onChange({ isDirty: false });
    this.setState({ account: null });
  };

  handleChange = (account, name, oldValue, newValue) => {
    this.props.onChange({ isDirty: true });
  };

  editOnClick = (account) => {
    this.setState({ account: JSON.parse(JSON.stringify(account)), editMode: 'edit', errors: null });
  };

  viewOnClick = (account) => {
    this.setState({ account: JSON.parse(JSON.stringify(account)), editMode: 'view' });
  };

  deleteOnClick = (account) => {
    console.log(account);
    if (!confirm(this.context.i18n.getMessage('Supplier.BankAccount.Confirmation.delete'))) {
      return;
    }
    this.handleDelete(account);
  };

  loadBankAccounts = () => {
    let supplierId = this.props.supplierId;

    this.bankAccountApi.getBankAccounts(supplierId).then(accounts => {
      this.setState({ accounts: accounts, isLoaded: true });
    }).catch((response) => {
      if (response.status === 401) {
        this.props.onUnauthorized();
      } else {
        console.log(`Error loading accounts by SupplierID=${supplierId}`);
        this.setState({ isLoaded: true, loadErrors: true });
      }
    });
  };

  renderEditor() {
    const { errors, editMode, account } = this.state;
    if (editMode === 'view') return <SupplierBankAccountView account={account} onClose={this.handleCancel}/>;

    return (
      <SupplierBankAccountEditForm
        onChange={this.handleChange}
        account={account}
        errors={errors}
        editMode={editMode}
        onSave={this.handleSave}
        onUpdate={this.handleUpdate}
        onCancel={this.handleCancel}
      />
    );
  }

  addButton() {
    if (!this.state.isLoaded) return null;
    if (this.state.account) return null;
    if (!this.userAbilities.canCreateBankAccount()) return null;

    return (
      <ActionButton
        id='supplier-bank-editor__add'
        onClick={this.addOnClick}
        label={this.context.i18n.getMessage('Supplier.Button.add')}
      />
    );
  }

  renderActionButtons(account) {
    return this.userAbilities.actionGroupForBankAccounts().map((action, index) => {
      return <ActionButton
                key={index}
                id={`supplier-bank-editor__${action}`}
                action={action}
                onClick={this[`${action}OnClick`].bind(this, account)}
                label={this.context.i18n.getMessage(`Supplier.Button.${action}`)}
                isSmall={true}
                showIcon={true}
              />
    });
  }

  render() {
    const { accounts, account, isLoaded, loadErrors} = this.state;
    let result;

    if (!isLoaded) {
      result = <div>Loading...</div>;
    }

    if (loadErrors) {
      result = <div>Load errors</div>;
    }

    if (accounts.length > 0) {
      result = (
        <div className='table-responsive'>
          <DisplayTable
            headers={[
              { label: this.context.i18n.getMessage('Supplier.BankAccount.Label.accountNumber') },
              { label: this.context.i18n.getMessage('Supplier.BankAccount.Label.bankName') },
              { label: this.context.i18n.getMessage('Supplier.BankAccount.Label.bankIdentificationCode') },
              { label: this.context.i18n.getMessage('Supplier.BankAccount.Label.bankCountryKey') },
              { label: this.context.i18n.getMessage('Supplier.BankAccount.Label.bankgiro') },
              { label: this.context.i18n.getMessage('Supplier.BankAccount.Label.plusgiro') }
            ]}
          >
            { accounts.map((account, index) =>
              (<DisplayRow key={index}>
                <DisplayField>{ account.accountNumber || '-' }</DisplayField>
                <DisplayField>{ account.bankName }</DisplayField>
                <DisplayField>{ account.bankIdentificationCode || '-'}</DisplayField>
                <DisplayField><CountryView countryId={account.bankCountryKey}/></DisplayField>
                <DisplayField>{ account.bankgiro || '-' }</DisplayField>
                <DisplayField>{ account.plusgiro || '-' }</DisplayField>
                <DisplayField classNames='text-right'>
                  {this.renderActionButtons(account)}
                </DisplayField>
              </DisplayRow>))
            }
          </DisplayTable>
        </div>
      );
    }

    return (
      <div>
        <h4 className="tab-description">{this.context.i18n.getMessage('Supplier.Heading.BankAccount')}</h4>

        {result}

        {account ? (
          <div className='row'>
            <div className='col-sm-6'>
              {this.renderEditor()}
            </div>
          </div>
        ) : null}

        {this.addButton()}
      </div>
    );
  }
}

export default SupplierBankAccountEditor;
