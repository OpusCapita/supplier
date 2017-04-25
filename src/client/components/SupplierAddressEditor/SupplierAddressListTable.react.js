import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import utils from 'underscore';
import i18n from '../../i18n/I18nDecorator.react.js';

/**
 * Supplier address list table
 *
 * @author Dmitry Divin
 */
@i18n
class SupplierAddressListTable extends Component {

  static propTypes = {
    supplierAddresses: React.PropTypes.array.isRequired,
    countries: React.PropTypes.array.isRequired,
    onEdit: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired,
    onView: React.PropTypes.func.isRequired,
    readOnly: React.PropTypes.bool
  };

  onEdit = (supplierAddress) => {
    this.props.onEdit(supplierAddress);
  };

  onDelete = (supplierAddress) => {
    if (!confirm(this.context.i18n.getMessage('SupplierAddressEditor.Confirmation.delete'))) {
      return;
    }
    this.props.onDelete(supplierAddress);
  };

  onView = (supplierAddress) => {
    this.props.onView(supplierAddress);
  };

  render() {
    const supplierAddresses = this.props.supplierAddresses;
    const countries = this.props.countries;

    return (
      <table className="table">
        <thead>
          <tr>
            <th>{this.context.i18n.getMessage('SupplierAddressEditor.Label.type')}</th>
            <th>{this.context.i18n.getMessage('SupplierAddressEditor.Label.street')}</th>
            <th>{this.context.i18n.getMessage('SupplierAddressEditor.Label.zipCode')}</th>
            <th>{this.context.i18n.getMessage('SupplierAddressEditor.Label.city')}</th>
            <th>{this.context.i18n.getMessage('SupplierAddressEditor.Label.countryId')}</th>
            <th>{this.context.i18n.getMessage('SupplierAddressEditor.Label.phoneNo')}</th>
            <th>{this.context.i18n.getMessage('SupplierAddressEditor.Label.faxNo')}</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
        {
              supplierAddresses.map((supplierAddress, index) => {
                let countryId = supplierAddress.countryId;
                let country = utils.findWhere(countries, { id: countryId });
                let countryName = country ? country.name : countryId;

                return (
                  <tr key={'address-' + index}>
                    <td>{this.context.i18n.getMessage(`SupplierAddressEditor.AddressType.${supplierAddress.type}`)}</td>
                    <td>{supplierAddress.street}</td>
                    <td>{supplierAddress.zipCode}</td>
                    <td>{supplierAddress.city}</td>
                    <td>{countryName}</td>
                    <td>{supplierAddress.phoneNo}</td>
                    <td>{supplierAddress.faxNo ? supplierAddress.faxNo : '-'}</td>
                    <td className="text-right">
                      {this.props.readOnly ? (
                        <nobr>
                          <Button onClick={this.onView.bind(this, supplierAddress)} bsSize="sm">
                            <span className='glyphicon glyphicon-eye-open' />
                          &nbsp;{this.context.i18n.getMessage('SupplierAddressEditor.Button.view')}
                          </Button>
                        </nobr>
                      ) : (
                        <nobr>
                          <Button onClick={this.onEdit.bind(this, supplierAddress)} bsSize="sm">
                            <span className="glyphicon glyphicon-edit" />
                          &nbsp;{this.context.i18n.getMessage('SupplierAddressEditor.Button.edit')}
                          </Button>
                          <Button onClick={this.onDelete.bind(this, supplierAddress)} bsSize="sm">
                            <span className="glyphicon glyphicon-trash" />
                          &nbsp;{this.context.i18n.getMessage('SupplierAddressEditor.Button.delete')}
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
