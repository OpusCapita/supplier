import React from 'react';
import CountryView from '../CountryView.react';

const BankAccountComponent = ({ supplier, i18n }) => (<div className='supplierPublic__container col-sm-12'>
    <span className='supplierPublic__label'>{ i18n.getMessage('Supplier.Title.bankAccounts') }</span>
    { supplier.bankAccounts.map((bankAccount) => <BankAccountSection key={bankAccount.id} bankAccount={ bankAccount } i18n={ i18n }/>)}
</div>);

const BankAccountSection = ({ bankAccount, i18n }) => (
  <div className='supplierPublic__section supplierPublic__bankAccount' key={bankAccount.id}>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('Supplier.BankAccount.Label.bankName') }</label>
      <span className='supplierPublic__value col-sm-4'>{ bankAccount.bankName || '-'}</span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('Supplier.BankAccount.Label.accountNumber') }</label>
      <span className='supplierPublic__value col-sm-4'>{ bankAccount.accountNumber || '-' }</span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('Supplier.BankAccount.Label.bankIdentificationCode') }</label>
      <span className='supplierPublic__value col-sm-4'>{ bankAccount.bankIdentificationCode || '-' }</span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('Supplier.BankAccount.Label.bankCode') }</label>
      <span className='supplierPublic__value col-sm-4'>{ bankAccount.bankCode || '-' }</span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('Supplier.BankAccount.Label.swiftCode') }</label>
      <span className='supplierPublic__value col-sm-4'>{ bankAccount.swiftCode || '-' }</span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('Supplier.BankAccount.Label.bankCountryKey') }</label>
      <span className='supplierPublic__value col-sm-4'>
        <CountryView countryId={ bankAccount.bankCountryKey} />
      </span>
    </div>
    <div className='col-sm-8'>
      <label className='supplierPublic__fieldLabel col-sm-4'>{ i18n.getMessage('Supplier.BankAccount.Label.extBankControlKey') }</label>
      <span className='supplierPublic__value col-sm-4'>{ bankAccount.extBankControlKey || '-'}</span>
    </div>
  </div>
);

export default BankAccountComponent;
