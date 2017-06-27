import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import CountryTableField from '../CountryTableField.react.js';

class SupplierAddressListTable extends Component {
  static propTypes = {
    actionUrl: React.PropTypes.string.isRequired,
    supplierAddresses: React.PropTypes.array.isRequired,
    onEdit: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired,
    onView: React.PropTypes.func.isRequired,
    readOnly: React.PropTypes.bool
  };

  onEdit = (supplierAddress) => {
    this.props.onEdit(supplierAddress);
  };

  onDelete = (supplierAddress) => {
    if (!confirm(this.props.i18n.getMessage('SupplierAddressEditor.Confirmation.delete'))) {
      return;
    }
    this.props.onDelete(supplierAddress);
  };

  onView = (supplierAddress) => {
    this.props.onView(supplierAddress);
  };

  render() {
    const supplierAddresses = this.props.supplierAddresses;

    return (
      <table className="table">
        <thead>
          <tr>
            <th>{this.props.i18n.getMessage('SupplierAddressEditor.Label.type')}</th>
            <th>{this.props.i18n.getMessage('SupplierAddressEditor.Label.street')}</th>
            <th>{this.props.i18n.getMessage('SupplierAddressEditor.Label.zipCode')}</th>
            <th>{this.props.i18n.getMessage('SupplierAddressEditor.Label.city')}</th>
            <th>{this.props.i18n.getMessage('SupplierAddressEditor.Label.countryId')}</th>
            <th>{this.props.i18n.getMessage('SupplierAddressEditor.Label.phoneNo')}</th>
            <th>{this.props.i18n.getMessage('SupplierAddressEditor.Label.faxNo')}</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
        {
              supplierAddresses.map((supplierAddress, index) => {
                return (
                  <tr key={'address-' + index}>
                    <td>{this.props.i18n.getMessage(`SupplierAddressEditor.AddressType.${supplierAddress.type}`)}</td>
                    <td>{supplierAddress.street}</td>
                    <td>{supplierAddress.zipCode}</td>
                    <td>{supplierAddress.city}</td>
                    <CountryTableField countryId={supplierAddress.countryId} actionUrl={this.props.actionUrl} />
                    <td>{supplierAddress.phoneNo}</td>
                    <td>{supplierAddress.faxNo ? supplierAddress.faxNo : '-'}</td>
                    <td className="text-right">
                      {this.props.readOnly ? (
                        <nobr>
                          <Button onClick={this.onView.bind(this, supplierAddress)} bsSize="sm">
                            <span className='glyphicon glyphicon-eye-open' />
                          &nbsp;{this.props.i18n.getMessage('SupplierAddressEditor.Button.view')}
                          </Button>
                        </nobr>
                      ) : (
                        <nobr>
                          <Button onClick={this.onEdit.bind(this, supplierAddress)} bsSize="sm">
                            <span className="glyphicon glyphicon-edit" />
                          &nbsp;{this.props.i18n.getMessage('SupplierAddressEditor.Button.edit')}
                          </Button>
                          <Button onClick={this.onDelete.bind(this, supplierAddress)} bsSize="sm">
                            <span className="glyphicon glyphicon-trash" />
                          &nbsp;{this.props.i18n.getMessage('SupplierAddressEditor.Button.delete')}
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

export default SupplierAddressListTable;
