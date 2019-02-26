class SupplierBankAccount {
  constructor(db) {
    this.supplierBankAccount = db.models.SupplierBankAccount;
  }

  all(supplierId) {
    return this.supplierBankAccount.findAll({ where: { supplierId: supplierId } });
  }

  find(supplierId, bankAccountId) {
    return this.supplierBankAccount.findOne({ where: { supplierId: supplierId, id: bankAccountId } });
  }

  create(bankAccount) {
    normalize(bankAccount);
    return this.supplierBankAccount.create(bankAccount);
  }

  update(supplierId, bankAccountId, bankAccount) {
    normalize(bankAccount);
    return this.supplierBankAccount.update(bankAccount, { where: { id: bankAccountId } }).then(() => {
      return this.find(supplierId, bankAccountId);
    });
  }

  delete(supplierId, bankAccountId) {
    let deleteQuery = { supplierId: supplierId };
    if (bankAccountId) deleteQuery.id = bankAccountId;
    return this.supplierBankAccount.destroy({ where: deleteQuery }).then(() => null);
  }

  exists(supplierId, bankAccountId) {
    return this.find(supplierId, bankAccountId).then(accounts => Boolean(accounts));
  }
};

let normalize = function(bankAccount)
{
  for (const fieldName of ['accountNumber', 'bankIdentificationCode', 'bankCode']) {
    if (bankAccount[fieldName]) bankAccount[fieldName] = bankAccount[fieldName].replace(/\W+/g, '');
  }
};

module.exports = SupplierBankAccount;
