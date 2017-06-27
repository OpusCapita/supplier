import React, { Component } from 'react';
import request from 'superagent-bluebird-promise';
import utils from 'underscore';
import i18nRegister from '../../i18n/register.js';
import i18nMessages from './i18n';
import Button from 'react-bootstrap/lib/Button';
import Alert from '../Alert';
import SupplierAddressListTable from './SupplierAddressListTable.react.js';
import SupplierAddressEditorForm from './SupplierAddressEditorForm.react.js';

/**
 * Supplier address editor
 */
class SupplierAddressEditor extends Component {

  static propTypes = {
    actionUrl: React.PropTypes.string.isRequired,
    supplierId: React.PropTypes.string.isRequired,
    username: React.PropTypes.string,
    readOnly: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    onUnauthorized: React.PropTypes.func
  };

  loadAddressesPromise = null;
  updateAddressPromise = null;
  deleteAddressPromise = null;

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
    isLoaded: false,
    supplierAddresses: [],
    supplierAddress: null,
    loadErrors: false
  };

  componentWillMount(){
    this.setState({ i18n: i18nRegister(this.props.locale, 'SupplierAddressEditor', i18nMessages) });
  }

  componentDidMount() {
    if (this.state.isLoaded) {
      return;
    }

    console.log('===== ABOUT TO REQUEST a PROMISE');
    this.loadAddressesPromise = request
      .get(`${this.props.actionUrl}/supplier/api/suppliers/${encodeURIComponent(this.props.supplierId)}/addresses`)
      .set('Accept', 'application/json').promise();

    this.loadAddressesPromise.then(response => {
      this.setState({
        isLoaded: true,
        supplierAddresses: response.body
      });
    }).
    catch(errors => {
      if (errors.status === 401) {
        this.props.onUnauthorized();
        return;
      }

      this.setState({
        isLoaded: true,
        hasErrors: true,
      });
    });

    return;
  }

  componentWillReceiveProps(newProps) {
    let editMode = this.state.editMode;

    if (editMode && this.props.readOnly !== newProps.readOnly) {
      let newState = { globalError: null };

      if (editMode === 'create') {
        newState.supplierAddress = null;
        newState.globalError = null;
      } else if (editMode === 'edit') {
        newState.editMode = 'view';
      } else if (editMode === 'view') {
        newState.editMode = 'edit';
      }
      this.setState(newState);
    }

    if(this.state.i18n && newProps.locale != this.props.locale){
      this.setState({ i18n: i18nRegister(newProps.locale, 'SupplierAddressEditor', i18nMessages) });
    }
  }

  componentWillUnmount() {
    if (!this.state.isLoaded) {
      if (this.loadAddressesPromise) {
        this.loadAddressesPromise.cancel();
      }
      if (this.updateAddressPromise) {
        this.updateAddressPromise.cancel();
      }
      if (this.deleteAddressPromise) {
        this.deleteAddressPromise.cancel();
      }
    }
  }

  handleEdit = (supplierAddress) => {
    this.setState({
      supplierAddress: utils.clone(supplierAddress),
      editMode: "edit",
      globalError: null,
      globalMessage: null,
      errors: null
    });
  };

  handleView = (supplierAddress) => {
    this.setState({
      supplierAddress: utils.clone(supplierAddress),
      editMode: "view",
      globalError: null,
      globalMessage: null,
      errors: null
    });
  };

  handleDelete = (supplierAddress) => {
    let actionUrl = this.props.actionUrl;
    let supplierId = this.props.supplierId;

    let arg0 = encodeURIComponent(supplierId);
    let arg1 = encodeURIComponent(supplierAddress.addressId);

    this.deleteAddressPromise = request.del(`${actionUrl}/supplier/api/suppliers/${arg0}/addresses/${arg1}`).set(
        'Accept', 'application/json').promise();

    return this.deleteAddressPromise.then((response) => {
      let supplierAddresses = this.state.supplierAddresses;
      let index = utils.findIndex(supplierAddresses, { id: supplierAddress.id });
      if (index === -1) {
        throw new Error(`Not found SupplierAddress by id [${supplierAddress.id}]`);
      }

      supplierAddresses.splice(index, 1);

      const message = this.state.i18n.getMessage('SupplierAddressEditor.Message.objectDeleted');
      this.setState({
        supplierAddresses: supplierAddresses,
        supplierAddress: null,
        globalMessage: message,
        globalError: null
      });
    }).catch(errors => {
      if (errors.status === 401) {
        this.props.onUnauthorized();
      }
    });
  };

  handleCreate = () => {
    this.props.onChange({ isDirty: true });
    this.setState({ supplierAddress: { address: {} }, editMode: 'create', errors: null });
  };

  handleUpdate = (supplierAddress) => {
    let actionUrl = this.props.actionUrl;
    let supplierId = this.props.supplierId;
    supplierAddress.changedBy = this.props.username;// eslint-disable-line no-param-reassign

    let arg0 = encodeURIComponent(supplierId);
    let arg1 = encodeURIComponent(supplierAddress.addressId);

    this.updateAddressPromise = request.put(`${actionUrl}/supplier/api/suppliers/${arg0}/addresses/${arg1}`).set(
      'Accept', 'application/json').send(supplierAddress).promise();

    return this.updateAddressPromise.then((response) => {
      let updatedSupplierAddress = response.body;

      let supplierAddresses = this.state.supplierAddresses;
      let index = utils.findIndex(supplierAddresses, { id: supplierAddress.id });

      if (index === -1) {
        throw new Error(`Not found SupplierAddress by id [${supplierAddress.id}]`);
      }
      supplierAddresses[index] = updatedSupplierAddress;

      this.props.onChange({ isDirty: false });

      const message = this.state.i18n.getMessage('SupplierAddressEditor.Message.objectUpdated');
      this.setState({
        supplierAddresses: supplierAddresses,
        supplierAddress: null,
        globalMessage: message,
        globalError: null
      });
    }).catch(errors => {
      if (errors.status === 401) {
        this.props.onUnauthorized();
      }
    });
  };

  generateUUID() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    return s4() + s4() + '-' + s4() + s4();
  }

  handleSave = (supplierAddress) => {
    let actionUrl = this.props.actionUrl;
    let supplierId = this.props.supplierId;

    /* eslint-disable no-param-reassign*/
    supplierAddress.supplierId = supplierId;
    supplierAddress.createdBy = this.props.username;
    supplierAddress.changedBy = this.props.username;

    // generate unique value
    supplierAddress.addressId = this.generateUUID();
    /* eslint-enable no-param-reassign*/

    request.post(`${actionUrl}/supplier/api/suppliers/${encodeURIComponent(supplierId)}/addresses`).set(
          'Accept', 'application/json').send(supplierAddress).then((response) => {
            let supplierAddresses = this.state.supplierAddresses;
            supplierAddresses.push(response.body);

            this.props.onChange({ isDirty: false });

            const message = this.state.i18n.getMessage('SupplierAddressEditor.Message.objectSaved');
            this.setState({
              supplierAddresses: supplierAddresses,
              supplierAddress: null,
              globalMessage: message,
              globalError: null
            });
          }).catch(errors => {
            if (errors.status === 401) {
              this.props.onUnauthorized();
            } else {
              console.log('Error during create SupplierAddress:');
            }
          });
  };

  handleCancel = () => {
    this.props.onChange({ isDirty: false });
    this.setState({ supplierAddress: null, globalError: null, globalMessage: null });
  };

  handleChange = (supplierAddress, name, oldValue, newValue) => {
    // check only updated objects
    // if (supplierAddress.addressId) {
    this.props.onChange({ isDirty: true });
    // }
  };

  addButton() {
    if (this.state.supplierAddress || this.state.readOnly) {
      return;
    }

    return (
      <div>
        <Button onClick={this.handleCreate}>{this.state.i18n.getMessage('SupplierAddressEditor.Button.add')}
        </Button>
      </div>
    )
  }

  render() {

    const { supplierAddresses, supplierAddress, loadErrors, errors, editMode, isLoaded } = this.state;

    let readOnly = this.props.readOnly;

    let result;

    if (!isLoaded) {
      result = <div>Loading...</div>;
    }

    if (loadErrors) {
      result = <div>Load errors</div>;
    }

    if (supplierAddresses.length > 0) {
      result = (
        <div className="table-responsive">
          <SupplierAddressListTable
            actionUrl={this.props.actionUrl}
            supplierAddresses={supplierAddresses}
            i18n={this.state.i18n}
            readOnly={readOnly}
            onEdit={this.handleEdit}
            onDelete={this.handleDelete}
            onView={this.handleView}
          />
        </div>
      );
    }

    return (
      <div>
        <div>
          <h4 className="tab-description">{this.state.i18n.getMessage('SupplierAddressEditor.Title')}</h4>
        </div>

        {this.state.globalMessage && !readOnly ? (
          <Alert bsStyle="info" message={this.state.globalMessage}/>
        ) : null}

        {result}

        {supplierAddress ? (
          <div className="row">
            <div className="col-md-6">
              {this.state.globalError && !readOnly ? (
                <Alert bsStyle="danger" message={this.state.globalError}/>
              ) : null}

              <SupplierAddressEditorForm
                actionUrl={this.props.actionUrl}
                onChange={this.handleChange}
                supplierAddress={supplierAddress}
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

        {this.addButton()}
      </div>
    );
  }
}

export default SupplierAddressEditor;
