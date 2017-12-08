import React, { Component, PropTypes } from 'react';
import { Address, Supplier } from '../../api';
import CountryView from '../CountryView.react';
require('./SupplierPublic.css');

const AddressComponent = ({ supplier }) => (<div className='supplierPublic__container col-sm-12'>
    <span className='supplierPublic__label'>Addresses</span>
    { supplier.addresses.map((address) => <AddressSection key={address.id} supplier={ supplier } address={ address }/>)}
</div>);

const AddressSection = ({ address, supplier }) => (
  <div className='supplierPublic__section supplierPublic__address' key={address.id}>
    <div className='col-sm-8'>
      <label className='col-sm-4'>Type</label>
      <span className='col-sm-4'>{ address.type }</span>
    </div>
    <div className='col-sm-8'>
      <label className='col-sm-4'>Name</label>
      <span className='col-sm-4'>{ address.name }</span>
    </div>
    
    <div className='col-sm-8'>
      <label className='col-sm-4'>Street</label>
      <span className='col-sm-4'>{ address.street1 }</span>
    </div>
    <div className='col-sm-8'>
      <label className='col-sm-4'>City</label>
      <span className='col-sm-4'>{ address.city }</span>
    </div>
    <div className='col-sm-8'>
      <label className='col-sm-4'>Zip Code</label>
      <span className='col-sm-4'>{ address.zipCode }</span>
    </div>
    <div className='col-sm-8'>
      <label className='col-sm-4'>Email</label>
      <span className='col-sm-4'>{ address.email }</span>
    </div>
    <div className='col-sm-8'>
      <label className='col-sm-4'>Phone number</label>
      <span className='col-sm-4'>{ address.phoneNo }</span>
    </div>
    <div className='col-sm-8'>
      <label className='col-sm-4'>Country</label>
      <span className='col-sm-4'>
        <CountryView countryId={ supplier.countryOfRegistration} />
      </span>
    </div>
  </div>
);

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
  
  renderDefault(argument, defaultValue) {
    return argument ? argument : defaultValue;
  }
  
  render() {
    return (
      <div className="form-horizontal">
        { this.state.supplier && (
          <div>
            <div className="col-sm-12">
                <span className='supplierPublic__label'>Company</span>
                <div className='supplierPublic__section'>
                  <div className='col-sm-8'>
                    <label className='col-sm-4'>Name</label>
                    <span className='col-sm-4'>{ this.state.supplier.supplierName }</span>
                  </div>
                  <div className='col-sm-8'>
                    <label className='col-sm-4'>City of registration:</label>
                    <span className='col-sm-4'>{ this.state.supplier.cityOfRegistration }</span>
                  </div>
                  <div className='col-sm-8'>
                    <label className='col-sm-4'>Legal form</label>
                    <span className='col-sm-4'>{ this.state.supplier.legalForm }</span>
                  </div>
                  <div className='col-sm-8'>
                    <label className='col-sm-4'>Homepage</label>
                    <span className='col-sm-4'>{ this.state.supplier.homePage }</span>
                  </div>
                  <div className='col-sm-8'>
                    <label className='col-sm-4'>Tax identification number</label>
                    <span className='col-sm-4'>{ this.renderDefault(this.state.supplier.taxIdNumber, '-') }</span>
                  </div>
                  <div className='col-sm-8'>
                    <label className='col-sm-4'>Global location</label>
                    <span className='col-sm-4'>{ this.renderDefault(this.state.supplier.globalLocationNo, '-') }</span>
                  </div>
                  <div className='col-sm-8'>
                    <label className='col-sm-4'>Country of registration:</label>
                    <span className='col-sm-4'><CountryView countryId={ this.state.supplier.countryOfRegistration} /></span>
                  </div>
                </div>
              </div>
            <div className="col-sm-12">
              <span className='supplierPublic__label'>Company Identifiers</span>
              <div className='supplierPublic__section'>
                <div className='col-sm-8'>
                  <label className='col-sm-4'>VAT identification number</label>
                  <span className='col-sm-4'>{ this.renderDefault(this.state.supplier.vatIdentificationNo, '-') }</span>
                </div>
                <div className='col-sm-8'>
                  <label className='col-sm-4'>DUNS Number:</label>
                  <span className='col-sm-4'>{ this.renderDefault(this.state.supplier.dunsNo, '-')}</span>
                </div>
                <div className='col-sm-8'>
                  <label className='col-sm-4'>Commercial register number</label>
                  <span className='col-sm-4'>{ this.renderDefault(this.state.supplier.commercialRegisterNo, '-') }</span>
                </div>
              </div>
            </div>
            <AddressComponent supplier={ this.state.supplier } />
            { this.state.supplier.capabilities && this.state.supplier.capabilities.length > 0 &&
              <div className='col-sm-12'>
                <span className='supplierPublic__label'>Capabilities</span>
                { this.state.supplier.capabilities.map((capabilities) => <div key={capabilities.capabilityId}>
                    <ul className='col-sm-8'>
                      <li className='col-sm-4'>{ capabilities.capabilityId }</li>
                    </ul>
                  </div>
                ) }
              </div> }
          </div>
        ) }
      </div>
    );
  }
  
  componentDidMount() {
    const queryParam = { include: 'addresses,capabilities' };
    this.supplierApi.getSupplier(this.props.supplierId, queryParam)
      .then(supplier => {
        this.setState({
          isLoaded: true,
          supplier: supplier
        });
      });
  }
};
