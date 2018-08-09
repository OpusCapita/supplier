const Supplier = require('../queries/suppliers');
const SupplierBank = require('../queries/supplier_bank_accounts');
const SupplierVisibility = require('../queries/supplier_visibility');
const userService = require('../services/user');
const businessLinkService = require('../services/businessLink');
const Promise = require('bluebird');

module.exports = function(app, db, config) {
  Promise.all([Supplier.init(db, config), SupplierBank.init(db, config)]).then(() =>
  {
    app.get('/api/suppliers', (req, res) => sendSuppliers(req, res));
    app.get('/api/suppliers/exists', (req, res) => existsSuppliers(req, res));
    app.get('/api/suppliers/search', (req, res) => querySupplier(req, res));
    app.post('/api/suppliers', (req, res) => createSuppliers(req, res));
    app.get('/api/suppliers/:id', (req, res) => sendSupplier(req, res));
    app.put('/api/suppliers/:id', (req, res) => updateSupplier(req, res));
  });
};

let sendSupplier = async function(req, res)
{
  const includes = req.query.include ? req.query.include.split(',') : [];

  Supplier.find(req.params.id, includes).then(async supplier =>
  {
    if (supplier) {
      res.opuscapita.setNoCache();
      const supplier2send = await restrictVisibility(supplier, req);
      res.json(supplier2send);
    } else {
      res.status('404').json(supplier);
    }
  });
};


let sendSuppliers = async function(req, res)
{
  if (req.query.electronicAddress) {
    return sendSuppliersForElectronicAddress(req, res);
  }

  if (req.query.search !== undefined) {
    const capabilities = req.query.capabilities ? req.query.capabilities.split(',') : [];
    Supplier.searchAll(req.query.search, capabilities).then(async suppliers => {
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

let createSuppliers = async function(req, res)
{
    try
    {
        const newSupplier = req.body;
        const exists = await Supplier.recordExists(newSupplier);

        if(exists)
            return res.status('409').json({ message : 'A supplier already exists' });

        const userObj = await userService.get(req.opuscapita.serviceClient, newSupplier.createdBy);
        const iban = newSupplier.iban;

        delete newSupplier.iban;

        newSupplier.status = 'new';

        const supp = await Supplier.create(newSupplier);
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', JSON.stringify(supp));
        const supplier = supp.dataValues;
        await req.opuscapita.eventClient.emit('supplier.supplier.create', supplier).catch(e => null);

        if(userObj.roles.includes('admin'))
            return res.status('200').json(supplier);

        const supplierId = supplier.id;
        const user = { supplierId: supplierId, status: 'registered', roles: ['supplier-admin'] };

        await userService.update(req.opuscapita.serviceClient, supplier.createdBy, user);

        supplier.status = 'assigned';

        await Supplier.update(supplierId, supplier);
        await createBankAccount(iban, supplier);

        await req.opuscapita.eventClient.emit('supplier.supplier.update', supplier).catch(e => null);
        res.status('200').json(supplier);
    }
    catch(e)
    {
        console.log(e);
        res.status(400).json(e);
    }
  // const newSupplier = req.body;
  // Supplier.recordExists(newSupplier).then(exists =>
  // {
  //   if (exists) return res.status('409').json({ message : 'A supplier already exists' });
  //
  //   return userService.get(req.opuscapita.serviceClient, newSupplier.createdBy).then(userObj => {
  //     if (userObj.supplierId) return res.status('403').json({ message : 'User already has a supplier' });
  //
  //     const iban = newSupplier.iban;
  //     delete newSupplier.iban;
  //
  //     newSupplier.status = 'new';
  //
  //     return Supplier.create(newSupplier)
  //       .then(supplier => {
  //         req.opuscapita.eventClient.emit('supplier.supplier.create', supplier).catch(e => null);
  //
  //         if (userObj.roles.includes('admin')) return res.status('200').json(supplier);
  //
  //         const supplierId = supplier.id;
  //         const user = { supplierId: supplierId, status: 'registered', roles: ['supplier-admin'] };
  //
  //         return userService.update(req.opuscapita.serviceClient, supplier.createdBy, user).then(() => {
  //             supplier.status = 'assigned';
  //             const supp = supplier.dataValues;
  //             console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< supp', supp)
  //             Promise.all([Supplier.update(supplierId, supp), createBankAccount(iban, supp)]).spread((supplier, account) => {
  //               return req.opuscapita.eventClient.emit('supplier.supplier.update', supplier)
  //                 .then(() => res.status('200').json(supplier));
  //             });
  //           })
  //           .catch(error => {
  //             Supplier.delete(supplierId).then(() => null);
  //             req.opuscapita.logger.error('Error when creating Supplier: %s', error.message);
  //
  //             return res.status((error.response && error.response.statusCode) || 400).json({ message : error.message });
  //           });
  //       })
  //       .catch(error => {
  //         req.opuscapita.logger.error('Error when creating Supplier: %s', error.message);
  //
  //         return res.status((error.response && error.response.statusCode) || 400).json({ message : error.message });
  //       });
  //   });
  // })
  // .catch(error => {
  //   req.opuscapita.logger.error('Error when creating Supplier: %s', error.message);
  //   return res.status('400').json({ message : error.message });
  // });
}

let updateSupplier = function(req, res)
{
  let supplierId = req.params.id;

  if (supplierId !== req.body.id) {
    const message = 'Inconsistent data';
    req.opuscapita.logger.error('Error when updating Supplier: %s', message);
    return res.status('422').json({ message: message });
  }

  Supplier.exists(supplierId).then(exists =>
  {
    if(exists) {
      req.body.status = 'updated';
      return Supplier.update(supplierId, req.body).then(supplier => {
        return req.opuscapita.eventClient.emit('supplier.supplier.update', supplier)
          .then(() => res.status('200').json(supplier));
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

    if (!data.ext) return res.json(suppliers2send.filter(customer => !Boolean(customer.parentId)));

    return res.json(suppliers2send.filter(customer => customer.subEntityCode === data.ext));
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
