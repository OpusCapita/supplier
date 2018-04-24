import React, { Component, PropTypes } from 'react';
import { Supplier } from '../../api';
import CountryView from '../CountryView.react';
import i18nMessages from '../../i18n';
require('./SupplierPublic.css');

const AddressComponent = ({ supplier, i18n }) => (<div className='supplierPublic__container col-sm-12'>
    <span className='supplierPublic__label'>{ i18n.getMessage('Supplier.Title.addresses') }</span>
    { supplier.addresses.map((address) => <AddressSection key={address.id} supplier={ supplier } address={ address } i18n={ i18n }/>)}
</div>);

const AddressSection = ({ address, supplier, i18n }) => (
  <div className='supplierPublic__section supplierPublic__address' key={address.id}>
    <div className='col-sm-8'>
      <label className='supplierPublic__subheading col-sm-4'>{ i18n.getMessage('Supplier.Address.Label.type') }</label>
      <span className='supplierPublic__subheading col-sm-4'>{ i18n.getMessage(`Supplier.Address.Label.${address.type}`) }</span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('Supplier.Address.Label.name') }</label>
      <span className='supplierPublic__value col-sm-4'>{ address.name }</span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('Supplier.Address.Label.street1') }</label>
      <span className='supplierPublic__value col-sm-4'>{ address.street1 || '-' }</span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('Supplier.Address.Label.street2') }</label>
      <span className='supplierPublic__value col-sm-4'>{ address.street2 || '-' }</span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('Supplier.Address.Label.street3') }</label>
      <span className='supplierPublic__value col-sm-4'>{ address.street3 || '-' }</span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('Supplier.Address.Label.city') }</label>
      <span className='supplierPublic__value col-sm-4'>{ address.city }</span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('Supplier.Address.Label.zipCode') }</label>
      <span className='supplierPublic__value col-sm-4'>{ address.zipCode || '-' }</span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('Supplier.Address.Label.countryId') }</label>
      <span className='supplierPublic__value col-sm-4'>
        <CountryView countryId={ address.countryId} />
      </span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('Supplier.Address.Label.email') }</label>
      <span className='supplierPublic__value col-sm-4'>{ address.email }</span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('Supplier.Address.Label.phoneNumber') }</label>
      <span className='supplierPublic__value col-sm-4'>{ address.phoneNo || '-' }</span>
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

  constructor(props, context) {
    super(props);
    this.state = { supplier : null };

    this.supplierApi = new Supplier();
  }

  componentWillMount(){
    this.context.i18n.register('Supplier', i18nMessages);
  }

  componentDidMount() {
    this.loadSupplier(this.props.supplierId);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextContext.i18n){
      nextContext.i18n.register('Supplier', i18nMessages);
    }

    this.loadSupplier(nextProps.supplierId);
  }

  renderDefault(argument, defaultValue) {
    return argument ? argument : defaultValue;
  }

  loadSupplier(supplierId) {
    const queryParam = { include: 'addresses,capabilities' };
    if (!supplierId) return;

    this.supplierApi.getSupplier(supplierId, queryParam).then(supplier => this.setState({ supplier: supplier }));
  }

  render() {
    return (
      <div className="form-horizontal">
        { this.state.supplier && (
          <div>
            <div className="col-sm-12">
                <span className='supplierPublic__label'>{ this.context.i18n.getMessage('Supplier.Title.company') }</span>
                <div className='supplierPublic__section'>
                  <div className='col-sm-8'>
                    <h5 className='supplierPublic__fieldLabel col-sm-4'>{ this.context.i18n.getMessage('Supplier.Label.name') }</h5>
                    <span className='supplierPublic__value col-sm-4'>{ this.state.supplier.name }</span>
                  </div>
                  <div className='col-sm-8'>
                    <h5 className='supplierPublic__fieldLabel col-sm-4'>{ this.context.i18n.getMessage('Supplier.Label.cityOfRegistration') } </h5>
                    <span className='supplierPublic__value col-sm-4'>{ this.state.supplier.cityOfRegistration }</span>
                  </div>
                  <div className='col-sm-8'>
                    <h5 className='supplierPublic__fieldLabel col-sm-4'>{ this.context.i18n.getMessage('Supplier.Label.legalForm') }</h5>
                    <span className='supplierPublic__value col-sm-4'>{ this.state.supplier.legalForm }</span>
                  </div>
                  <div className='col-sm-8'>
                    <h5 className='supplierPublic__fieldLabel col-sm-4'>{ this.context.i18n.getMessage('Supplier.Label.homePage') }</h5>
                    <span className='supplierPublic__value col-sm-4'>{ this.state.supplier.homePage }</span>
                  </div>
                  <div className='col-sm-8'>
                    <h5 className='supplierPublic__fieldLabel col-sm-4'>{ this.context.i18n.getMessage('Supplier.Label.taxIdNumber') }</h5>
                    <span className='supplierPublic__value col-sm-4'>{ this.renderDefault(this.state.supplier.taxIdNumber, '-') }</span>
                  </div>
                  <div className='col-sm-8'>
                    <h5 className='supplierPublic__fieldLabel col-sm-4'>{ this.context.i18n.getMessage('Supplier.Label.commercialRegisterNo') }</h5>
                    <span className='csupplierPublic__value ol-sm-4'>{ this.renderDefault(this.state.supplier.commercialRegisterNo, '-') }</span>
                  </div>
                  <div className='col-sm-8'>
                    <h5 className='supplierPublic__fieldLabel col-sm-4'>{ this.context.i18n.getMessage('Supplier.Label.countryOfRegistration') }</h5>
                    <span className='supplierPublic__value col-sm-4'><CountryView countryId={ this.state.supplier.countryOfRegistration } /></span>
                  </div>
                </div>
              </div>
            <div className="col-sm-12">
              <span className='supplierPublic__label'>{ this.context.i18n.getMessage('Supplier.Title.companyIdentifiers') }</span>
              <div className='supplierPublic__section'>
                <div className='col-sm-8'>
                  <h5 className='supplierPublic__fieldLabel col-sm-4'>{ this.context.i18n.getMessage('Supplier.Label.vatIdentificationNo') }</h5>
                  <span className='supplierPublic__value col-sm-4'>{ this.renderDefault(this.state.supplier.vatIdentificationNo, '-') }</span>
                </div>
                <div className='col-sm-8'>
                  <h5 className='supplierPublic__fieldLabel col-sm-4'>{ this.context.i18n.getMessage('Supplier.Label.dunsNo') }</h5>
                  <span className='supplierPublic__value col-sm-4'>{ this.renderDefault(this.state.supplier.dunsNo, '-') }</span>
                </div>
                <div className='col-sm-8'>
                  <h5 className='supplierPublic__fieldLabel col-sm-4'>{ this.context.i18n.getMessage('Supplier.Label.globalLocationNo') }</h5>
                  <span className='supplierPublic__value col-sm-4'>{ this.renderDefault(this.state.supplier.globalLocationNo, '-') }</span>
                </div>
              </div>
            </div>
            <AddressComponent supplier={ this.state.supplier } i18n={ this.context.i18n } />
            { this.state.supplier.capabilities && this.state.supplier.capabilities.length > 0 &&
              <div className='col-sm-12'>
                <span className='supplierPublic__label'>{ this.context.i18n.getMessage('Supplier.Capabilities.name') }</span>
                { this.state.supplier.capabilities.map((capabilities) => <div key={capabilities.capabilityId}>
                    <ul className='col-sm-8'>
                      <li className='col-sm-4'>{  this.context.i18n.getMessage(`Supplier.Capabilities.Type.${capabilities.capabilityId}`) }</li>
                    </ul>
                  </div>
                ) }
              </div> }
          </div>
        ) }
      </div>
    );
  }
};
