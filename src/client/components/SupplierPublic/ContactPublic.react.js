import React from 'react';

const ContactComponent = ({ supplier, i18n }) => (<div className='supplierPublic__container col-sm-12'>
    <span className='supplierPublic__label'>{ i18n.getMessage('Supplier.Title.contacts') }</span>
    { supplier.contacts.map((contact) => <ContactSection key={contact.id} supplier={ supplier } contact={ contact } i18n={ i18n }/>)}
</div>);

const ContactSection = ({ contact, supplier, i18n }) => (
  <div className='supplierPublic__section supplierPublic__contact' key={contact.id}>
    <div className='col-sm-8'>
      <label className='supplierPublic__subheading col-sm-4'>{ i18n.getMessage('Supplier.Contact.Label.contactType') }</label>
      <span className='supplierPublic__subheading col-sm-4'>{ i18n.getMessage(`Supplier.Contact.Type.${contact.contactType}`) }</span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('Supplier.Contact.Label.department') }</label>
      <span className='supplierPublic__value col-sm-4'>{ contact.department ? i18n.getMessage(`Supplier.Contact.Department.${contact.department}`) : '-'}</span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('Supplier.Contact.Label.title') }</label>
      <span className='supplierPublic__value col-sm-4'>{ contact.title || '-'}</span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('Supplier.Contact.Label.firstName') }</label>
      <span className='supplierPublic__value col-sm-4'>{ contact.firstName || '-' }</span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('Supplier.Contact.Label.lastName') }</label>
      <span className='supplierPublic__value col-sm-4'>{ contact.lastName || '-' }</span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('Supplier.Contact.Label.email') }</label>
      <span className='supplierPublic__value col-sm-4'>{ contact.email || '-' }</span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('Supplier.Contact.Label.phone') }</label>
      <span className='supplierPublic__value col-sm-4'>{ contact.phone || '-' }</span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('Supplier.Contact.Label.mobile') }</label>
      <span className='supplierPublic__value col-sm-4'>{ contact.mobile || '-' }</span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('Supplier.Contact.Label.fax') }</label>
      <span className='supplierPublic__value col-sm-4'>{ contact.fax || '-'}</span>
    </div>
  </div>
);

export default ContactComponent;
