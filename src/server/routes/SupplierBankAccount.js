const SupplierBankAccountApi = require('../api/SupplierBankAccount');

const { Middlewares } = require('../helper');

class SupplierBankAccount {
  constructor(app, db) {
    this.app = app;
    this.api = new SupplierBankAccountApi(db);
  }

  init() {

    const provideStringDescriptor = Middlewares.provideStringDescriptor(true);

    this.app.get('/api/suppliers/:supplierId/bank_accounts', [provideStringDescriptor], (req, res) => this.index(req, res));
    this.app.post('/api/suppliers/:supplierId/bank_accounts', (req, res) => this.create(req, res));
    this.app.get('/api/suppliers/:supplierId/bank_accounts/:bankAccountId', [provideStringDescriptor], (req, res) => this.show(req, res));
    this.app.put('/api/suppliers/:supplierId/bank_accounts/:bankAccountId', (req, res) => this.update(req, res));
    this.app.delete('/api/suppliers/:supplierId/bank_accounts/:bankAccountId', (req, res) => this.delete(req, res));
  }

  index(req, res) {
    return this.api.all(req.params.supplierId).then(accounts => {
      if (req.params.provideSringDescriptor) accounts.forEach(this.addStringRepresentation.bind(this, req.opuscapita.i18n))
      return res.json(accounts);
    });
  }

  show(req, res) {
    return this.api.find(req.params.supplierId, req.params.bankAccountId).then(account => {
      if (!account) return res.status('404').json({ message: 'Not found' });
      if (req.params.provideSringDescriptor) this.addStringRepresentation(req.opuscapita.i18n, account);
      return res.json(account);
    });
  }

  async create(req, res) {
    if (!this.api.hasUniqueIdentifier(req.body)) return noUniqueIdentifierResponse(res);

    return this.api.create(req.body).then(async bankAccount => {
      await emitEvent(req, bankAccount, 'created');
      return res.status('201').json(bankAccount);
    }).catch(e => res.status('400').json({message: e.message}));
  }

  async update(req, res) {
    const bankAccountId = req.params.bankAccountId;
    const supplierId = req.params.supplierId;
    const exists = await this.api.exists(supplierId, bankAccountId);

    if (!exists) return res.status('404').json({message: 'A supplier bankAccount with this ID does not exist.'});

    if (!this.api.hasUniqueIdentifier(req.body)) return noUniqueIdentifierResponse(res);

    return this.api.update(supplierId, bankAccountId, req.body).then(async bankAccount => {
      await emitEvent(req, bankAccount, 'updated');
      return res.status('200').json(bankAccount);
    }).catch(e => res.status('400').json({message: e.message}));
  }

  delete(req, res) {
    this.api.delete(req.params.supplierId, req.params.bankAccountId).then(() => res.json(null))
      .catch(e => res.status('400').json({message: e.message}));
  }

  // create a string representation of a bankacocunt and add it as a property to the bankaccount
  addStringRepresentation(i18n, bankAccount) {
    console.log(bankAccount.dataValues)
    // Fields that will be used for string representation
    const mandatoryFields = ['accountNumber','bankgiro','plusgiro','isrNumber'];
    const stringRepresentation = [];
    Object.keys(bankAccount.dataValues).forEach(property => {
      // check if value is truthy and mandatory
      if (bankAccount.dataValues[property] && mandatoryFields.includes(property)) {
        // add property to descriptor object
        const label = `Labels.${property}`;
        stringRepresentation.push(`${i18n.getMessage(label)}: ${bankAccount.dataValues[property]}`)
      }
    })
    bankAccount.dataValues.stringRepresentation = stringRepresentation.join(', ');
  }

};

let emitEvent = function(req, payload, type)
{
  return req.opuscapita.eventClient.emit(`supplier.bank-account.${type}`, payload);
};

let noUniqueIdentifierResponse = function(res)
{
   return res.status('400').json({message: 'Either IBAN, bankgiro, or plusgiro must be provided.'});
};

module.exports = SupplierBankAccount;
