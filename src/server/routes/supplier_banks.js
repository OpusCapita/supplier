const SupplierBank = require('../queries/supplier_bank_accounts');

module.exports = function (app, db, config) {
  SupplierBank.init(db, config).then(() =>
  {
    app.get('/api/suppliers/:supplierId/bank_accounts', (req, res) => sendSupplierBanks(req, res));
    app.post('/api/suppliers/:supplierId/bank_accounts', (req, res) => createSupplierBank(req, res));
    app.get('/api/suppliers/:supplierId/bank_accounts/:bankAccountId', (req, res) => sendSupplierBank(req, res));
    app.put('/api/suppliers/:supplierId/bank_accounts/:bankAccountId', (req, res) => updateSupplierBank(req, res));
    app.delete('/api/suppliers/:supplierId/bank_accounts/:bankAccountId', (req, res) => deleteSupplierBank(req, res));
  });
};

let sendSupplierBanks = function (req, res) {
  SupplierBank.all(req.params.supplierId).then(accounts => {
    res.opuscapita.setNoCache();
    return res.json(accounts);
  });
};

let sendSupplierBank = function (req, res) {
  SupplierBank.find(req.params.supplierId, req.params.bankAccountId).then(account => {
    res.opuscapita.setNoCache();
    return res.json(account);
  });
};

let createSupplierBank = async function (req, res) {
  SupplierBank.create(req.body).then(async bankAccount => {
    await emitEvent(req, bankAccount, 'created');
    return res.status('200').json(bankAccount);
  }).catch(e => res.status('400').json({message: e.message}));
};

let updateSupplierBank = async function (req, res) {
  const bankAccountId = req.params.bankAccountId;
  const supplierId = req.params.supplierId;
  const exists = await SupplierBank.bankExists(supplierId, bankAccountId);

  if (!exists) return res.status('404').json({message: 'A supplier bankAccount with this ID does not exist.'});

  return SupplierBank.update(supplierId, bankAccountId, req.body).then(async bankAccount => {
    await emitEvent(req, bankAccount, 'updated');
    return res.status('200').json(bankAccount);
  }).catch(e => res.status('400').json({message: e.message}));
};

let deleteSupplierBank = function (req, res) {
  SupplierBank.delete(req.params.supplierId, req.params.bankAccountId).then(() => res.status('200').json(null))
    .catch(e => res.status('400').json({message: e.message}));
};

let emitEvent = function(req, payload, type)
{
  return req.opuscapita.eventClient.emit(`supplier.bank-account.${type}`, payload);
}
