import React, { Component, PropTypes } from 'react';
import { Supplier, Address } from '../../api';
import CountryView from '../CountryView.react';
require('./SupplierPublic.css');

export default class SupplierPublic extends Component {
  
  static propTypes = {
    supplierId: PropTypes.string.isRequired
  };
  
  constructor(props) {
    super(props);
    this.state = {
      supplier : null,
      addresses: null,
    };
  
    this.supplierApi = new Supplier();
    this.addressApi = new Address();
  }
  
  render() {
    return (
      <div className="form-horizontal">
        { this.state.supplier && (
          <div>
            <div className="row">
              <div className="col-sm-6">
                <div className='supplierPublic__header'>Organisation</div>
                <div>
                  <div className='supplierPublic__label'>Name</div>
                  <div className='supplierPublic__value'>{ this.state.supplier.supplierName }</div>
                  <span className='supplierPublic__label'>City of registration:</span>
                  <div>{ this.state.supplier.countryOfRegistration }</div>
                  <span className='supplierPublic__label'>Country of registration:</span>
                  <CountryView countryId={ this.state.supplier.countryOfRegistration} />
                  <span className='supplierPublic__label'>VAT registration number</span>
                  <div>{ this.state.supplier.vatIdentificationNo || 'VAT-12345'}</div>
                  <span className='supplierPublic__label'>Tax registration number</span>
                  <div>{ this.state.supplier.taxIdentificationNo || 'TAX-12345'}</div>
                  <div  className='supplierPublic__label'>Address</div>
                  <div>{ this.state.addresses.map((address) => <div key={address.id}>
                    <div>{ address.name }</div>
                    <div>{ address.street }</div>
                    <div>{ address.street1 }</div>
                    <div>{ address.street2 }</div>
                    <div>{ address.street3 }</div>
                  </div>) }</div>
                </div>
              </div>
            </div>
          </div>
        ) }
      </div>
    );
  }
  
  componentDidMount() {
    Promise.all([
      this.supplierApi.getSupplier(this.props.supplierId)
        .then(supplier => {
          console.log('supplier', supplier);
          this.setState({
            isLoaded: true,
            supplier: supplier
          });
        })
        .catch(errors => {
          if (errors.status === 401) {
            this.props.onUnauthorized();
            return;
          }
        }),
      this.addressApi.getAddresses(this.props.supplierId)
        .then(addresses => {
          console.log(addresses);
          this.setState({
            addresses: addresses
          })
        }),
    ]);
  }
};
