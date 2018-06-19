import React from 'react';
import CountryView from '../CountryView.react';

const AddressComponent = ({ supplier, i18n }) => (<div className='supplierPublic__container col-sm-12'>
    <span className='supplierPublic__label'>{ i18n.getMessage('Supplier.Title.addresses') }</span>
    { supplier.addresses.map((address) => <AddressSection key={address.id} supplier={ supplier } address={ address } i18n={ i18n }/>)}
</div>);

const AddressSection = ({ address, supplier, i18n }) => (
  <div className='supplierPublic__section supplierPublic__address' key={address.id}>
    <div className='col-sm-8'>
      <label className='supplierPublic__subheading col-sm-4'>{ i18n.getMessage('Supplier.Address.Label.type') }</label>
      <span className='supplierPublic__subheading col-sm-4'>{ i18n.getMessage(`Supplier.Address.Type.${address.type}`) }</span>
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
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('Supplier.Address.Label.phoneNo') }</label>
      <span className='supplierPublic__value col-sm-4'>{ address.phoneNo || '-' }</span>
    </div>
  </div>
);

export default AddressComponent;
