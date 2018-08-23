import React, { Component } from 'react';
import validationMessages from '../../utils/validatejs/i18n';
import i18nMessages from '../../i18n';
import DisplayRow from '../../components/DisplayTable/DisplayRow.react';
import DisplayField from '../../components/DisplayTable/DisplayField.react';
import DisplayTable from '../../components/DisplayTable/DisplayTable.react';
import SupplierAddressEditorForm from './SupplierAddressEditorForm.react.js';
import ActionButton from '../../components/ActionButton.react';
import SupplierAddressView from './SupplierAddressView.react';
import CountryView from '../CountryView.react.js';
import { Address } from '../../api';
import UserAbilities from '../../UserAbilities';

class SupplierAddressEditor extends Component {

  static propTypes = {
    supplierId: React.PropTypes.string.isRequired,
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
      supplierAddresses: [],
      supplierAddress: null,
      loadErrors: false
    };

    this.addressApi = new Address();
    this.userAbilities = new UserAbilities(props.userRoles);
  }

  componentWillMount(){
    this.context.i18n.register('SupplierValidatejs', validationMessages);
    this.context.i18n.register('Supplier', i18nMessages);
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
    if(nextContext.i18n){
      nextContext.i18n.register('SupplierValidatejs', validationMessages);
      nextContext.i18n.register('Supplier', i18nMessages);
    }
  }

  viewOnClick = (address) => {
    this.setState({ supplierAddress: JSON.parse(JSON.stringify(address)), editMode: 'view' });
  };

  editOnClick = (address) => {
    this.setState({ supplierAddress: JSON.parse(JSON.stringify(address)), editMode: 'edit', errors: null });
  };

  deleteOnClick = (supplierAddress) => {
    if (!confirm(this.context.i18n.getMessage('Supplier.Address.Confirmation.delete'))) {
      return;
    }
    this.handleDelete(supplierAddress);
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

      const message = this.context.i18n.getMessage('Supplier.Address.Messages.deleted');
      if(this.context.showNotification) this.context.showNotification(message, 'info');
    }).catch(errors => {
      if (errors.status === 401) {
        this.props.onUnauthorized();
      }
    });
  };

  addOnClick = () => {
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

      const message = this.context.i18n.getMessage('Supplier.Address.Messages.updated');
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

      const message = this.context.i18n.getMessage('Supplier.Address.Messages.saved');
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

  renderEditor() {
    const { errors, editMode, supplierAddress } = this.state;
    if (editMode === 'view') return <SupplierAddressView supplierAddress={supplierAddress} onClose={this.handleCancel}/>;

    return (
      <SupplierAddressEditorForm
        onChange={this.handleChange}
        supplierAddress={supplierAddress}
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
    if (this.state.supplierAddress) return null;
    if (!this.userAbilities.canCreateAddress()) return null;

    return (
      <ActionButton
        id='supplier-address-editor__add'
        onClick={this.addOnClick}
        label={this.context.i18n.getMessage('Supplier.Button.add')}
      />
    );
  }

  renderActionButtons(address) {
    return this.userAbilities.actionGroupForAddresses().map((action, index) => {
      return <ActionButton
                id={ `supplier-address-editor__${action}` }
                key={index}
                action={action}
                onClick={this[`${action}OnClick`].bind(this, address)}
                label={this.context.i18n.getMessage(`Supplier.Button.${action}`)}
                isSmall={true}
                showIcon={true}
              />
    });
  }

  render() {

    const { supplierAddresses, supplierAddress, loadErrors, errors, editMode, isLoaded } = this.state;
    let result;

    if (!isLoaded) {
      result = <div>Loading...</div>;
    }

    if (loadErrors) {
      result = <div>Load errors</div>;
    }

    if (supplierAddresses.length > 0) {
      result = (
        <div className='table-responsive'>
          <DisplayTable headers={[
              {label: this.context.i18n.getMessage('Supplier.Address.Label.type')},
              {label: this.context.i18n.getMessage('Supplier.Address.Label.street1')},
              {label: this.context.i18n.getMessage('Supplier.Address.Label.zipCode')},
              {label: this.context.i18n.getMessage('Supplier.Address.Label.city')},
              {label: this.context.i18n.getMessage('Supplier.Address.Label.countryId')},
              {label: this.context.i18n.getMessage('Supplier.Address.Label.phoneNo')},
              {label: this.context.i18n.getMessage('Supplier.Address.Label.faxNo')}
          ]}>
            { supplierAddresses.map((address, index) =>
              (<DisplayRow key={index}>
                <DisplayField>{this.context.i18n.getMessage(`Supplier.Address.Type.${address.type}`)}</DisplayField>
                <DisplayField>{address.street1}</DisplayField>
                <DisplayField>{address.zipCode}</DisplayField>
                <DisplayField>{address.city}</DisplayField>
                <DisplayField><CountryView countryId={address.countryId}/></DisplayField>
                <DisplayField>{address.phoneNo}</DisplayField>
                <DisplayField>{address.faxNo || '-'}</DisplayField>
                <DisplayField classNames='text-right'>
                  {this.renderActionButtons(address)}
                </DisplayField>
              </DisplayRow>))
            }
          </DisplayTable>
        </div>
      );
    }

    return (
      <div>
        <div>
          <h4 className='tab-description'>{this.context.i18n.getMessage('Supplier.Heading.address')}</h4>
        </div>

        {result}

        {supplierAddress ? (
          <div className='row'>
            <div className='col-md-6'>
              {this.renderEditor()}
            </div>
          </div>
        ) : null}

        {this.addButton()}
      </div>
    );
  }
}

export default SupplierAddressEditor;
