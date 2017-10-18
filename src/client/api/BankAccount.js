import ApiBase from './ApiBase';

class BankAccount extends ApiBase {
  getBankAccounts(supplierId) {
    return this.ajax.get(`/supplier/api/suppliers/${supplierId}/bank_accounts`).
      set('Accept', 'application/json').then(response => response.body);
  }

  createBankAccount(supplierId, bankAccount) {
    return this.ajax.post(`/supplier/api/suppliers/${supplierId}/bank_accounts`).
      set('Accept', 'application/json').send(bankAccount).then(response => response.body);
  }

  updateBankAccount(supplierId, bankAccountId, bankAccount) {
    return this.ajax.put(`/supplier/api/suppliers/${supplierId}/bank_accounts/${bankAccountId}`).
      set('Accept', 'application/json').send(bankAccount).then(response => response.body);
  }

  deleteBankAccount(supplierId, bankAccountId) {
    return this.ajax.del(`/supplier/api/suppliers/${supplierId}/bank_accounts/${bankAccountId}`).
      set('Accept', 'application/json')
  }
}

export default BankAccount;
