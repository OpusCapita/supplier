import React, { Component } from 'react';
import request from 'superagent-bluebird-promise';
import utils from 'underscore';
import Button from 'react-bootstrap/lib/Button';
import i18nRegister from '../../i18n/register.js';
import i18nMessages from './i18n';
import Alert from '../Alert';
import SupplierBankAccountListTable from './SupplierBankAccountListTable.react.js';
import SupplierBankAccountEditForm from './SupplierBankAccountEditForm.react.js';

/**
 * Supplier contact editor
 *
 * @author Dmitry Divin
 */
class SupplierBankAccountEditor extends Component {

  static propTypes = {
    actionUrl: React.PropTypes.string,
    supplierId: React.PropTypes.string,
    username: React.PropTypes.string,
    readOnly: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    onUnauthorized: React.PropTypes.func
  };

  static defaultProps = {
    readOnly: false,
    onChange: function(event) {
      if (event.isDirty) {
        console.log('data in form changed');
      } else {
        console.log('data in form committed or canceled')
      }
    }
  };

  state = {
    loadErrors: false
  };

  componentWillMount(){
    this.setState({ i18n: i18nRegister(this.props.locale, 'SupplierBankAccountEditor', i18nMessages) });
  }

  componentDidMount() {
    this.loadBankAccounts();
  }

  componentWillReceiveProps(newProps) {
    let editMode = this.state.editMode;

    if (editMode && this.props.readOnly !== newProps.readOnly) {
      let newState = { globalError: null };

      if (editMode === 'create') {
        newState.account = null;
        newState.globalError = null;
      } else if (editMode === 'edit') {
        newState.editMode = 'view';
      } else if (editMode === 'view') {
        newState.editMode = 'edit';
      }
      this.setState(newState);
    }

    if(this.state.i18n && newProps.locale != this.props.locale){
      this.setState({ i18n: i18nRegister(newProps.locale, 'SupplierBankAccountEditor', i18nMessages) });
    }
  }

  handleDelete = (account) => {

    let actionUrl = this.props.actionUrl;
    let supplierId = this.props.supplierId;

    let arg0 = encodeURIComponent(supplierId);
    let arg1 = encodeURIComponent(account.bankAccountId);

    request.del(`${actionUrl}/supplier/api/suppliers/${arg0}/bank_accounts/${arg1}`).
      set('Accept', 'application/json').
      then((response) => {
        let accounts = this.state.accounts;
        let index = utils.findIndex(accounts, { bankAccountId: account.bankAccountId });
        if (index === -1) {
          throw new Error(`Not found bank account for bankAccountId [${account.bankAccountId}]`);
        }

        accounts.splice(index, 1);

        const message = this.state.i18n.getMessage('SupplierBankAccountEditor.Message.objectDeleted');
        this.setState({ accounts: accounts, account: null, globalMessage: message, globalError: null });
      }).catch((response) => {
        if (response.status === 401) {
          this.props.onUnauthorized();
        } else {
          console.log(`Bad request by SupplierID=${supplierId} and ContactID=${account.bankAccountId}`);

          const message = this.state.i18n.getMessage('SupplierBankAccountEditor.Message.deleteFailed');
          this.setState({ globalError: message, globalMessage: null });
        }
      });
  };

  handleCreate = () => {
    this.props.onChange({ isDirty: true });
    this.setState({ account: {}, editMode: "create", errors: null });
  };

  handleUpdate = (account) => {
    let actionUrl = this.props.actionUrl;
    let supplierId = this.props.supplierId;
    account.changedBy = this.props.username;// eslint-disable-line no-param-reassign

    let arg0 = encodeURIComponent(supplierId);
    let arg1 = encodeURIComponent(account.bankAccountId);
    request.put(`${actionUrl}/supplier/api/suppliers/${arg0}/bank_accounts/${arg1}`).
      set('Accept', 'application/json').
      send(account).
      then((response) => {

        let updatedContact = response.body;

        let accounts = this.state.accounts;
        let index = utils.findIndex(accounts, { bankAccountId: account.bankAccountId });

        if (index === -1) {
          throw new Error(`Not found account by ContactID=${account.bankAccountId}`);
        }
        accounts[index] = updatedContact;

        this.props.onChange({ isDirty: false });

        const message = this.state.i18n.getMessage('SupplierBankAccountEditor.Message.objectUpdated');
        this.setState({ accounts: accounts, account: null, globalMessage: message, globalError: null });
      }).catch((response) => {
        if (response.status === 401) {
          this.props.onUnauthorized();
        } else {
          console.log(`Bad request by SupplierID=${supplierId} and ContactID=${account.bankAccountId}`);

          const message = this.state.i18n.getMessage('SupplierBankAccountEditor.Message.updateFailed');
          this.setState({ globalError: message, globalMessage: null });
        }
      });
  };

  generateUUID() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + s4();
  }

  handleSave = (account) => {
    let actionUrl = this.props.actionUrl;
    let supplierId = this.props.supplierId;

    /* eslint-disable no-param-reassign*/
    account.supplierId = supplierId;
    account.createdBy = this.props.username;
    account.changedBy = this.props.username;

    // generate unique value
    account.bankAccountId = this.generateUUID();
    /* eslint-enable no-param-reassign*/

    request.post(`${actionUrl}/supplier/api/suppliers/${encodeURIComponent(supplierId)}/bank_accounts`).
      set('Accept', 'application/json').
      send(account).
      then((response) => {
        let accounts = this.state.accounts;
        accounts.push(response.body);

        this.props.onChange({ isDirty: false });

        const message = this.state.i18n.getMessage('SupplierBankAccountEditor.Message.objectSaved');
        this.setState({ accounts: accounts, account: null, globalMessage: message, globalError: null });
      }).catch((response) => {
        if (response.status === 401) {
          this.props.onUnauthorized();
        } else {
          console.log(`Bad request by SupplierID=${supplierId} and ContactID=${account.bankAccountId}`);

          let message = this.state.i18n.getMessage('SupplierBankAccountEditor.Message.saveFailed');
          this.setState({ globalError: message, globalMessage: null });
        }
      });
  };

  handleCancel = () => {
    this.props.onChange({ isDirty: false });
    this.setState({ account: null, globalError: null, globalMessage: null });
  };

  handleChange = (account, name, oldValue, newValue) => {
    // check only updated objects
    // if (account.bankAccountId) {
    this.props.onChange({ isDirty: true });
    // }
  };

  handleView = (account) => {
    this.setState({
      account: utils.clone(account),
      editMode: "view",
      globalError: null,
      globalMessage: null,
      errors: null
    });
  };

  handleEdit = (account) => {
    this.setState({
      account: utils.clone(account),
      editMode: "edit",
      globalError: null,
      globalMessage: null,
      errors: null
    });
  };

  loadBankAccounts = () => {
    let actionUrl = this.props.actionUrl;
    let supplierId = this.props.supplierId;
    request.
      get(`${actionUrl}/supplier/api/suppliers/${encodeURIComponent(supplierId)}/bank_accounts`).
      set('Accept', 'application/json').
      then((response) => {
        this.setState({ accounts: response.body });
      }).catch((response) => {
        if (response.status === 401) {
          this.props.onUnauthorized();
        } else {
          console.log(`Error loading accounts by SupplierID=${supplierId}`);
          this.setState({ loadErrors: true });
        }
      });
  };

  render() {
    const accounts = this.state.accounts;
    const loadErrors = this.state.loadErrors;

    let account = this.state.account;
    let errors = this.state.errors;
    let editMode = this.state.editMode;
    let readOnly = this.props.readOnly;
    let result;

    if (accounts !== undefined) {
      if (accounts.length > 0) {
        result = (
          <div className="table-responsive">
            <SupplierBankAccountListTable
              accounts={accounts}
              readOnly={readOnly}
              actionUrl={this.props.actionUrl}
              i18n={this.state.i18n}
              onEdit={this.handleEdit}
              onDelete={this.handleDelete}
              onView={this.handleView}
            />
          </div>
        );
      } else if (readOnly) {
        account = null;
      } else {
        // show create new account if empty
        account = {};
        errors = {};
        editMode = 'create-first';
      }
    } else if (loadErrors) {
      result = (<div>Load errors</div>);
    } else {
      result = (<div>Loading...</div>);
    }

    return (
      <div>
        <h4 className="tab-description">{this.state.i18n.getMessage('SupplierBankAccountEditor.Title')}</h4>

        {this.state.globalMessage && !readOnly ? (
          <Alert bsStyle="info" message={this.state.globalMessage}/>
        ) : null}

        {result}

        {account ? (
          <div className="row">
            <div className="col-sm-6">
              {this.state.globalError && !readOnly ? (
                <Alert bsStyle="danger" message={this.state.globalError}/>
              ) : null}

              <SupplierBankAccountEditForm
                onChange={this.handleChange}
                actionUrl={this.props.actionUrl}
                account={account}
                i18n={this.state.i18n}
                errors={errors}
                editMode={editMode}
                onSave={this.handleSave}
                onUpdate={this.handleUpdate}
                onCancel={this.handleCancel}
              />
            </div>
          </div>
        ) : null}

        {!account && !readOnly ? (
          <div>
            <Button onClick={this.handleCreate}>{this.state.i18n.getMessage('SupplierBankAccountEditor.Button.add')}
            </Button>
          </div>
        ) : null}
      </div>
    );
  }
}

export default SupplierBankAccountEditor;
