const Promise = require('bluebird');
import React, { Component, PropTypes } from 'react';
import { Supplier, Visibility } from '../../api';
import CountryView from '../CountryView.react';
import i18nMessages from '../../i18n';
import AddressComponent from './AddressPublic.react';
import ContactComponent from './ContactPublic.react';
import BankAccountComponent from './BankAccountPublic.react';
require('./SupplierPublic.css');

export default class SupplierPublic extends Component {

  static propTypes = {
    supplierId: PropTypes.string.isRequired
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props);
    this.state = { supplier : null, visibility: null };

    this.supplierApi = new Supplier();
    this.visibilityApi = new Visibility();
  }

  componentWillMount(){
    this.context.i18n.register('Supplier', i18nMessages);
  }

  componentDidMount() {
    this.loadSupplierAndVisibility(this.props.supplierId);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextContext.i18n){
      nextContext.i18n.register('Supplier', i18nMessages);
    }

    this.loadSupplierAndVisibility(nextProps.supplierId);
  }

  renderDefault(argument, defaultValue) {
    return argument ? argument : defaultValue;
  }

  loadSupplierAndVisibility(supplierId) {
    if (!supplierId) return;

    const queryParam = { include: 'addresses,capabilities,contacts,bankAccounts' };
    this.supplierApi.getSupplier(supplierId, queryParam).then(supplier => this.setState({ supplier: supplier }));
    this.visibilityApi.get(supplierId).then(visibility => this.setState({ visibility: visibility })).
      catch(() => this.setState({ visibility: {} }));
  }

  renderContactComponent() {
    if (!this.state.visibility) return null;

    if (this.state.visibility.contacts === 'private') return null;

    return <ContactComponent supplier={ this.state.supplier } i18n={ this.context.i18n } />;
  }

  renderBankAccountComponent() {
    if (!this.state.visibility) return null;

    if (this.state.visibility.bankAccounts === 'private') return null;

    return <BankAccountComponent supplier={ this.state.supplier } i18n={ this.context.i18n } />;
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
            { this.renderContactComponent() }
            { this.renderBankAccountComponent() }
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
