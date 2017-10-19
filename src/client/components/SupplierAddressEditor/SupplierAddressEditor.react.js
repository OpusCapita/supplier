import React, { Component } from 'react';
import validationMessages from '../../utils/validatejs/i18n';
import i18nMessages from './i18n';
import Button from 'react-bootstrap/lib/Button';
import SupplierAddressListTable from './SupplierAddressListTable.react.js';
import SupplierAddressEditorForm from './SupplierAddressEditorForm.react.js';
import { Address } from '../../api';

class SupplierAddressEditor extends Component {

  static propTypes = {
    supplierId: React.PropTypes.string.isRequired,
    username: React.PropTypes.string,
    readOnly: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    onUnauthorized: React.PropTypes.func
  };

  static contextTypes = {
    i18n: React.PropTypes.object.isRequired,
    showNotification: React.PropTypes.func
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

  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      supplierAddresses: [],
      supplierAddress: null,
      loadErrors: false
    };

    this.addressApi = new Address();
  }

  componentWillMount(){
    this.context.i18n.register('SupplierValidatejs', validationMessages);
    this.context.i18n.register('SupplierAddressEditor', i18nMessages);
  }

  componentDidMount() {
    if (this.state.isLoaded) return;

    this.addressApi.getAddresses(this.props.supplierId).then(addresses => {
      this.setState({
        isLoaded: true,
        supplierAddresses: addresses
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

  componentWillReceiveProps(newProps, nextContext) {
    let editMode = this.state.editMode;

    if (editMode && this.props.readOnly !== newProps.readOnly) {

      if (editMode === 'create') {
        newState.supplierAddress = null;
      } else if (editMode === 'edit') {
        newState.editMode = 'view';
      } else if (editMode === 'view') {
        newState.editMode = 'edit';
      }
      this.setState(newState);
    }

    if(nextContext.i18n){
      nextContext.i18n.register('SupplierValidatejs', validationMessages);
      nextContext.i18n.register('SupplierAddressEditor', i18nMessages);
    }
  }

  handleEdit = (supplierAddress) => {
    this.setState({
      supplierAddress: JSON.parse(JSON.stringify(supplierAddress)),
      editMode: "edit",
      errors: null
    });
  };

  handleView = (supplierAddress) => {
    this.setState({
      supplierAddress: JSON.parse(JSON.stringify(supplierAddress)),
      editMode: "view",
      errors: null
    });
  };

  handleDelete = (supplierAddress) => {
    return this.addressApi.deleteAddress(this.props.supplierId, supplierAddress.id).then(() => {
      let supplierAddresses = this.state.supplierAddresses;
      const index = supplierAddresses.findIndex(address => address.id === supplierAddress.id);

      if (index === -1) {
        throw new Error(`Not found SupplierAddress by id [${supplierAddress.id}]`);
      }
      supplierAddresses.splice(index, 1);

      this.setState({ supplierAddresses: supplierAddresses, supplierAddress: null });

      const message = this.context.i18n.getMessage('SupplierAddressEditor.Message.objectDeleted');
      if(this.context.showNotification) this.context.showNotification(message, 'info');
    }).catch(errors => {
      if (errors.status === 401) {
        this.props.onUnauthorized();
      }
    });
  };

  handleCreate = () => {
    this.props.onChange({ isDirty: true });
    this.setState({ supplierAddress: {}, editMode: 'create', errors: null });
  };

  handleUpdate = (supplierAddress) => {
    supplierAddress.changedBy = this.props.username;// eslint-disable-line no-param-reassign

    return this.addressApi.updateAddress(this.props.supplierId, supplierAddress.id, supplierAddress).then(updatedAddress => {
      let supplierAddresses = this.state.supplierAddresses;
      const index = supplierAddresses.findIndex(address => address.id === supplierAddress.id);

      if (index === -1) {
        throw new Error(`Not found SupplierAddress by id [${supplierAddress.id}]`);
      }
      supplierAddresses[index] = updatedAddress;

      this.props.onChange({ isDirty: false });

      this.setState({ supplierAddresses: supplierAddresses, supplierAddress: null });

      const message = this.context.i18n.getMessage('SupplierAddressEditor.Message.objectUpdated');
      if(this.context.showNotification) this.context.showNotification(message, 'info');
    }).catch(errors => {
      if (errors.status === 401) {
        this.props.onUnauthorized();
      }
    });
  };

  handleSave = (supplierAddress) => {
    let supplierId = this.props.supplierId;

    supplierAddress.supplierId = supplierId;
    supplierAddress.createdBy = this.props.username;
    supplierAddress.changedBy = this.props.username;

    this.addressApi.createAddress(supplierId, supplierAddress).then(address => {
      let supplierAddresses = this.state.supplierAddresses;
      supplierAddresses.push(address);

      this.props.onChange({ isDirty: false });

      this.setState({ supplierAddresses: supplierAddresses, supplierAddress: null });

      const message = this.context.i18n.getMessage('SupplierAddressEditor.Message.objectSaved');
      if(this.context.showNotification) this.context.showNotification(message, 'info');
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
    this.setState({ supplierAddress: null });
  };

  handleChange = (supplierAddress, name, oldValue, newValue) => {
    this.props.onChange({ isDirty: true });
  };

  addButton() {
    if (this.state.supplierAddress || this.state.readOnly) {
      return;
    }

    return (
      <div>
        <Button onClick={this.handleCreate}>{this.context.i18n.getMessage('SupplierAddressEditor.Button.add')}
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
            supplierAddresses={supplierAddresses}
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
          <h4 className="tab-description">{this.context.i18n.getMessage('SupplierAddressEditor.Title')}</h4>
        </div>

        {result}

        {supplierAddress ? (
          <div className="row">
            <div className="col-md-6">

              <SupplierAddressEditorForm
                onChange={this.handleChange}
                supplierAddress={supplierAddress}
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
