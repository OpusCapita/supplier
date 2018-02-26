const Supplier = require('../queries/suppliers');
const SupplierBank = require('../queries/supplier_bank_accounts');
const RedisEvents = require('ocbesbn-redis-events');
const userService = require('../services/user');
const Promise = require('bluebird');

module.exports = function(app, db, config) {
  Promise.all([Supplier.init(db, config), SupplierBank.init(db, config)]).then(() =>
  {
    this.events = new RedisEvents({ consul : { host : 'consul' } });
    app.get('/api/suppliers', (req, res) => sendSuppliers(req, res));
    app.get('/api/suppliers/exists', (req, res) => existsSuppliers(req, res));
    app.get('/api/suppliers/search', (req, res) => querySupplier(req, res));
    app.post('/api/suppliers', (req, res) => createSuppliers(req, res));
    app.get('/api/suppliers/:supplierId', (req, res) => sendSupplier(req, res));
    app.put('/api/suppliers/:supplierId', (req, res) => updateSupplier(req, res));
  });
};

let sendSupplier = function(req, res)
{
  const includes = req.query.include ? req.query.include.split(',') : [];

  Supplier.find(req.params.supplierId, includes).then(supplier =>
  {
    if (supplier) {
      res.json(supplier);
    } else {
      res.status('404').json(supplier);
    }
  });
};


let sendSuppliers = function(req, res)
{
  if (req.query.search !== undefined) {
    const capabilities = req.query.capabilities ? req.query.capabilities.split(',') : [];
    Supplier.searchAll(req.query.search, capabilities).then(suppliers => res.json(suppliers));
  } else {
    const includes = req.query.include ? req.query.include.split(',') : [];
    delete req.query.include
    Supplier.all(req.query, includes).then(suppliers => res.json(suppliers));
  }
};

let existsSuppliers = function(req, res)
{
  Supplier.recordExists(req.query).then(exists => res.json(exists));
};

let querySupplier = function(req, res)
{
  Supplier.searchRecord(req.query).then(supplier => {
    if (supplier) {
      res.json(supplier);
    } else {
      res.status('404').json(supplier);
    }
  });
};

let createSuppliers = function(req, res)
{
  const newSupplier = req.body;
  Supplier.recordExists(newSupplier).then(exists =>
  {
    if (exists) return res.status('409').json({ message : 'A supplier already exists' });

    return userService.get(req.opuscapita.serviceClient, newSupplier.createdBy).then(userObj => {
      if (userObj.supplierId) return res.status('403').json({ message : 'User already has a supplier' });

      const iban = newSupplier.iban;
      delete newSupplier.iban;

      newSupplier.status = 'new';

      return Supplier.create(newSupplier)
        .then(supplier => this.events.emit(supplier, 'supplier').then(() => supplier))
        .then(supplier => {
          const supplierId = supplier.supplierId;
          const user = { supplierId: supplierId, status: 'registered', roles: ['supplier-admin'] };

          return userService.update(req.opuscapita.serviceClient, supplier.createdBy, user).then(() => {
              supplier.status = 'assigned';
              const supp = supplier.dataValues;
              Promise.all([Supplier.update(supplierId, supp), createBankAccount(iban, supp)]).spread((supplier, account) => {
                return this.events.emit(supplier, 'supplier').then(() => res.status('200').json(supplier));
              });
            })
            .catch(error => {
              Supplier.delete(supplierId).then(() => null);
              req.opuscapita.logger.error('Error when creating Supplier: %s', error.message);

              return res.status((error.response && error.response.statusCode) || 400).json({ message : error.message });
            });
        })
        .catch(error => {
          req.opuscapita.logger.error('Error when creating Supplier: %s', error.message);

          return res.status((error.response && error.response.statusCode) || 400).json({ message : error.message });
        });
    });
  })
  .catch(error => {
    req.opuscapita.logger.error('Error when creating Supplier: %s', error.message);
    return res.status('400').json({ message : error.message });
  });
}

let updateSupplier = function(req, res)
{
  let supplierId = req.params.supplierId;

  if (supplierId !== req.body.supplierId) {
    const message = 'Inconsistent data';
    req.opuscapita.logger.error('Error when updating Supplier: %s', message);
    return res.status('422').json({ message: message });
  }

  Supplier.isAuthorized(supplierId, req.body.changedBy).then(authorized => {
    if (!authorized) {
      const message = 'Operation is not authorized';
      req.opuscapita.logger.error('Error when updating Supplier: %s', message);
      return res.status('403').json({ message: message });
    }
  });

  Supplier.exists(supplierId).then(exists =>
  {
    if(exists) {
      req.body.status = 'updated';
      return Supplier.update(supplierId, req.body).then(supplier => {
        return this.events.emit(supplier, 'supplier').then(() => res.status('200').json(supplier));
      });
    } else {
      const message = 'A supplier with ID ' + supplierId + ' does not exist.';
      req.opuscapita.logger.error('Error when updating Supplier: %s', message);
      return res.status('404').json({ message : message });
    }
  })
  .catch(error => {
    req.opuscapita.logger.error('Error when updating Supplier: %s', error.message);
    return res.status('400').json({ message : error.message });
  });
}

let createBankAccount = function(iban, supplier)
{
  if (!iban) return Promise.resolve();

  const bankAccount = {
    accountNumber: iban,
    supplierId: supplier.supplierId,
    createdBy: supplier.createdBy,
    changedBy: supplier.createdBy
  };
  return SupplierBank.create(bankAccount);
}
