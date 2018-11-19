const Supplier = require('../queries/suppliers');
const SupplierBank = require('../queries/supplier_bank_accounts');
const SupplierVisibility = require('../queries/supplier_visibility');
const SupplierAddress = require('../queries/supplier_addresses');
const SupplierContact = require('../queries/supplier_contacts');
const Supplier2User = require('../queries/supplier2users');
const SupplierCapability = require('../queries/capabilities');
const userService = require('../services/user');
const businessLinkService = require('../services/businessLink');
const Promise = require('bluebird');

module.exports = function(app, db, config) {
  Promise.all([
    Supplier.init(db, config), SupplierBank.init(db, config), SupplierVisibility.init(db, config),
    SupplierAddress.init(db, config), SupplierContact.init(db, config),
    Supplier2User.init(db, config), SupplierCapability.init(db, config)
  ]).then(() =>
  {
    app.get('/api/suppliers', (req, res) => sendSuppliers(req, res));
    app.get('/api/suppliers/exists', (req, res) => existsSuppliers(req, res));
    app.get('/api/suppliers/search', (req, res) => querySupplier(req, res));
    app.post('/api/suppliers', (req, res) => createSuppliers(req, res));
    app.get('/api/suppliers/:id', (req, res) => sendSupplier(req, res));
    app.put('/api/suppliers/:id', (req, res) => updateSupplier(req, res));
    app.delete('/api/suppliers/:id', (req, res) => deleteSupplier(req, res));
  });
};

let sendSupplier = async function(req, res)
{
  const includes = req.query.include ? req.query.include.split(',') : [];

  return Supplier.find(req.params.id, includes).then(async supplier =>
  {
    if (!supplier) return handleSupplierNotExists(req.params.id, req, res);

    res.opuscapita.setNoCache();
    const supplier2send = await restrictVisibility(supplier, req);
    return res.json(supplier2send);
  });
};


let sendSuppliers = async function(req, res)
{
  if (req.query.electronicAddress) {
    return sendSuppliersForElectronicAddress(req, res);
  }

  if (req.query.search !== undefined) {
    const capabilities = req.query.capabilities ? req.query.capabilities.split(',') : [];
    return Supplier.searchAll(req.query.search, capabilities).then(async suppliers => {
      const suppliers2send = await restrictVisibilities(suppliers, req);
      return res.json(suppliers2send);
    });
  } else {
    const includes = req.query.include ? req.query.include.split(',') : [];
    delete req.query.include

    return Supplier.all(req.query, includes).then(async suppliers => {
      const suppliers2send = await restrictVisibilities(suppliers, req);
      return res.json(suppliers2send);
    });
  }
};

let existsSuppliers = function(req, res)
{
  return Supplier.recordExists(req.query).then(exists => res.json(exists));
};

let querySupplier = async function(req, res)
{
  const supplier = await Supplier.searchRecord(req.query);

  if (!supplier) return res.status('404').json(supplier);

  return res.json(supplier);
};

let createSuppliers = function(req, res)
{
  const newSupplier = req.body;
  Supplier.recordExists(newSupplier).then(exists =>
  {
    if (exists) return res.status('409').json({ message : 'A supplier already exists' });

    return userService.get(req.opuscapita.serviceClient, newSupplier.createdBy).then(userObj => {
      if (userObj.supplierId && !userObj.roles.includes('admin')) return res.status('403').json({ message : 'User already has a supplier' });

      const iban = newSupplier.iban;
      delete newSupplier.iban;

      newSupplier.status = 'new';

      return Supplier.create(newSupplier)
        .then(supplier => {
          if (userObj.roles.includes('admin')) return res.status('200').json(supplier);

          const supplierId = supplier.id;
          const user = { supplierId: supplierId, status: 'registered', roles: ['user', 'supplier-admin'] };

          return Promise.all([
              userService.update(req.opuscapita.serviceClient, supplier.createdBy, user),
              userService.removeRoleFromUser(req.opuscapita.serviceClient, supplier.createdBy, 'registering_supplier')
          ])
            .then(() => {
              supplier.status = 'assigned';

              const supp1 = Object.assign({ }, supplier.dataValues);
              const supp2 = Object.assign({ }, supplier.dataValues); // Copy needed as Supplier.update() seems to modify supp which then destroys createBankAccount().

              return Promise.all([Supplier.update(supplierId, supp1), createBankAccount(iban, supp2)]).spread((supplier, account) => {
                return res.status('200').json(supplier);
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

let updateSupplier = async function(req, res)
{
  let supplierId = req.params.id;

  if (supplierId !== req.body.id) {
    const message = 'Inconsistent data';
    req.opuscapita.logger.error('Error when updating Supplier: %s', message);
    return res.status('422').json({ message: message });
  }

  try {
    const exists = await Supplier.exists(supplierId);

    if (!exists) return handleSupplierNotExists(supplierId, req, res);

    req.body.status = 'updated';
    const supplier = await Supplier.update(supplierId, req.body);
    await req.opuscapita.eventClient.emit('supplier.supplier.updated', supplier);

    return res.status('200').json(supplier);
  } catch(error) {
    req.opuscapita.logger.error('Error when updating Supplier: %s', error.message);
    return res.status('400').json({ message : error.message });
  }
}

let deleteSupplier = async function(req, res)
{
  const supplierId = req.params.id;

  try {
    const exists = await Supplier.exists(supplierId);

    if (!exists) return handleSupplierNotExists(supplierId, req, res);

    await Supplier.delete(supplierId);

    await Promise.all([
      SupplierBank.delete(supplierId), SupplierAddress.delete(supplierId), Supplier2User.delete(supplierId),
      SupplierContact.delete(supplierId), SupplierCapability.delete(supplierId), SupplierVisibility.delete(supplierId)
    ]);

    await req.opuscapita.eventClient.emit('supplier.supplier.deleted', { id: supplierId });

    return res.status('200').json({ message: `Supplier with id ${supplierId} deleted.` })
  } catch(error) {
    req.opuscapita.logger.error('Error when deleting Supplier: %s', error.message);
    return res.status('400').json({ message : error.message });
  }
}

let createBankAccount = function(iban, supplier)
{
  if (!iban) return Promise.resolve();

  const bankAccount = {
    accountNumber: iban,
    supplierId: supplier.id,
    createdBy: supplier.createdBy,
    changedBy: supplier.createdBy
  };

  return SupplierBank.create(bankAccount);
}

let sendSuppliersForElectronicAddress = async function(req, res)
{
  try {
    const electronicAddress = req.query.electronicAddress;
    const electronicAddressDecoder = require('@opuscapita/electronic-address');
    const data = electronicAddressDecoder.decode(electronicAddress);

    if (!data.value) return res.status('400').json({ message: `Electronic address ${electronicAddress} could not be decoded` });

    const suppliers = await Supplier.all({ [getIdentifier[data.type]]: data.value });
    const suppliers2send = await restrictVisibilities(suppliers, req);

    if (suppliers2send.length <= 1) return res.json(suppliers2send);

    if (!data.ext) return res.json(suppliers2send.filter(supplier => !Boolean(supplier.parentId)));

    return res.json(suppliers2send.filter(supplier => supplier.subEntityCode === data.ext));
  } catch(err) { return res.status('400').json({ message : err.message }) };
};

let getIdentifier = { vat: 'vatIdentificationNo', gln: 'globalLocationNo', ovt: 'ovtNo' };

let restrictVisibility = async function(supplier, req)
{
  const roles = req.opuscapita.userData('roles');
  if (!req.query.public && (roles.some(rol => rol === 'admin' || rol.match('svc_')) )) return supplier;

  const supplierId = req.opuscapita.userData('supplierId');
  if (!req.query.public && roles.some(rol => rol.match('supplier')) && supplier.id === supplierId) return supplier;

  if (!supplier.contacts && !supplier.bankAccounts) return supplier;

  const visibility = await SupplierVisibility.find(supplier.id);

  ['contacts', 'bankAccounts'].forEach(field => { if (!visibility || (visibility && visibility[field] === 'private')) delete supplier[field] });

  if (!visibility) return supplier;

  if (visibility.contacts !== 'businessPartners' && visibility.bankAccounts !== 'businessPartners') return supplier;

  const customerId = req.opuscapita.userData('customerId');
  const businessLinks = await businessLinkService.allForSupplierId(req.opuscapita.serviceClient, supplier.id);

  if (businessLinks.every(link => !customerId || link.customerId !== customerId)) {
    ['contacts', 'bankAccounts'].forEach(field => { if (visibility[field] === 'businessPartners') delete supplier[field] });
  }

  return supplier;
}

let restrictVisibilities = function(suppliers, req)
{
  return Promise.all(suppliers.map(supplier => restrictVisibility(supplier, req)));
}

let handleSupplierNotExists = function(supplierId, req, res)
{
  const message = 'A supplier with ID ' + supplierId + ' does not exist.';
  req.opuscapita.logger.error('Error when updating Supplier: %s', message);
  return res.status('404').json({ message : message });
}
