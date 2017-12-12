import React, { Component, PropTypes } from 'react';
import { Address, Supplier } from '../../api';
import CountryView from '../CountryView.react';
import i18nMessages from './i18n';
require('./SupplierPublic.css');

const AddressComponent = ({ supplier, i18n }) => (<div className='supplierPublic__container col-sm-12'>
    <span className='supplierPublic__label'>{ i18n.getMessage('SupplierPublic.Label.address.addresses') }</span>
    { supplier.addresses.map((address) => <AddressSection key={address.id} supplier={ supplier } address={ address } i18n={ i18n }/>)}
</div>);

const AddressSection = ({ address, supplier, i18n }) => (
  <div className='supplierPublic__section supplierPublic__address' key={address.id}>
    <div className='col-sm-8'>
      <label className='supplierPublic__subheading col-sm-4'>{ i18n.getMessage('SupplierPublic.Label.address.type') }</label>
      <span className='supplierPublic__subheading col-sm-4'>{ i18n.getMessage(`SupplierPublic.Label.address.${address.type}`) }</span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('SupplierPublic.Label.address.name') }</label>
      <span className='supplierPublic__value col-sm-4'>{ address.name }</span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('SupplierPublic.Label.address.street') }</label>
      <span className='supplierPublic__value col-sm-4'>{ address.street1 }</span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('SupplierPublic.Label.address.city') }</label>
      <span className='supplierPublic__value col-sm-4'>{ address.city }</span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('SupplierPublic.Label.address.zipCode') }</label>
      <span className='supplierPublic__value col-sm-4'>{ address.zipCode }</span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('SupplierPublic.Label.address.country') }</label>
      <span className='supplierPublic__value col-sm-4'>
        <CountryView countryId={ supplier.countryOfRegistration} />
      </span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('SupplierPublic.Label.address.email') }</label>
      <span className='supplierPublic__value col-sm-4'>{ address.email }</span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('SupplierPublic.Label.address.phoneNumber') }</label>
      <span className='supplierPublic__value col-sm-4'>{ address.phoneNo }</span>
    </div>
  </div>
);

export default class SupplierPublic extends Component {

  static propTypes = {
    supplierId: PropTypes.string.isRequired
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired,
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

  componentWillMount(){
    this.context.i18n.register('SupplierPublic', i18nMessages);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextContext.i18n){
      nextContext.i18n.register('SupplierPublic', i18nMessages);
    }
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
                <span className='supplierPublic__label'>{ this.context.i18n.getMessage('SupplierPublic.Label.supplier.company') }</span>
                <div className='supplierPublic__section'>
                  <div className='col-sm-8'>
                    <h5 className='supplierPublic__fieldLabel col-sm-4'>{ this.context.i18n.getMessage('SupplierPublic.Label.supplier.supplierName') }</h5>
                    <span className='supplierPublic__value col-sm-4'>{ this.state.supplier.supplierName }</span>
                  </div>
                  <div className='col-sm-8'>
                    <h5 className='supplierPublic__fieldLabel col-sm-4'>{ this.context.i18n.getMessage('SupplierPublic.Label.supplier.cityOfRegistration') } </h5>
                    <span className='supplierPublic__value col-sm-4'>{ this.state.supplier.cityOfRegistration }</span>
                  </div>
                  <div className='col-sm-8'>
                    <h5 className='supplierPublic__fieldLabel col-sm-4'>{ this.context.i18n.getMessage('SupplierPublic.Label.supplier.legalForm') }</h5>
                    <span className='supplierPublic__value col-sm-4'>{ this.state.supplier.legalForm }</span>
                  </div>
                  <div className='col-sm-8'>
                    <h5 className='supplierPublic__fieldLabel col-sm-4'>{ this.context.i18n.getMessage('SupplierPublic.Label.supplier.homePage') }</h5>
                    <span className='supplierPublic__value col-sm-4'>{ this.state.supplier.homePage }</span>
                  </div>
                  <div className='col-sm-8'>
                    <h5 className='supplierPublic__fieldLabel col-sm-4'>{ this.context.i18n.getMessage('SupplierPublic.Label.supplier.taxIdNumber') }</h5>
                    <span className='supplierPublic__value col-sm-4'>{ this.renderDefault(this.state.supplier.taxIdNumber, '-') }</span>
                  </div>
                  <div className='col-sm-8'>
                    <h5 className='supplierPublic__fieldLabel col-sm-4'>{ this.context.i18n.getMessage('SupplierPublic.Label.supplier.commercialRegisterNo') }</h5>
                    <span className='csupplierPublic__value ol-sm-4'>{ this.renderDefault(this.state.supplier.commercialRegisterNo, '-') }</span>
                  </div>
                  <div className='col-sm-8'>
                    <h5 className='supplierPublic__fieldLabel col-sm-4'>{ this.context.i18n.getMessage('SupplierPublic.Label.supplier.countryOfRegistration') }</h5>
                    <span className='supplierPublic__value col-sm-4'><CountryView countryId={ this.state.supplier.countryOfRegistration } /></span>
                  </div>
                </div>
              </div>
            <div className="col-sm-12">
              <span className='supplierPublic__label'>{ this.context.i18n.getMessage('SupplierPublic.Label.supplier.companyIdentifiers') }</span>
              <div className='supplierPublic__section'>
                <div className='col-sm-8'>
                  <h5 className='supplierPublic__fieldLabel col-sm-4'>{ this.context.i18n.getMessage('SupplierPublic.Label.supplier.vatIdentificationNo') }</h5>
                  <span className='supplierPublic__value col-sm-4'>{ this.renderDefault(this.state.supplier.vatIdentificationNo, '-') }</span>
                </div>
                <div className='col-sm-8'>
                  <h5 className='supplierPublic__fieldLabel col-sm-4'>{ this.context.i18n.getMessage('SupplierPublic.Label.supplier.dunsNo') }</h5>
                  <span className='supplierPublic__value col-sm-4'>{ this.renderDefault(this.state.supplier.dunsNo, '-') }</span>
                </div>
                <div className='col-sm-8'>
                  <h5 className='supplierPublic__fieldLabel col-sm-4'>{ this.context.i18n.getMessage('SupplierPublic.Label.supplier.globalLocationNo') }</h5>
                  <span className='supplierPublic__value col-sm-4'>{ this.renderDefault(this.state.supplier.globalLocationNo, '-') }</span>
                </div>
              </div>
            </div>
            <AddressComponent supplier={ this.state.supplier } i18n={ this.context.i18n } />
            { this.state.supplier.capabilities && this.state.supplier.capabilities.length > 0 &&
              <div className='col-sm-12'>
                <span className='supplierPublic__label'>{ this.context.i18n.getMessage('SupplierPublic.Label.supplier.capabilities') }</span>
                { this.state.supplier.capabilities.map((capabilities) => <div key={capabilities.capabilityId}>
                    <ul className='col-sm-8'>
                      <li className='col-sm-4'>{  this.context.i18n.getMessage(`SupplierPublic.Label.supplier.capabilities.${capabilities.capabilityId}`) }</li>
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
