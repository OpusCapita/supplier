const SupplierApi = require('../queries/Supplier');
const SupplierVisibilityApi = require('../queries/SupplierVisibility');
const SupplierBankAccountApi = require('../queries/SupplierBankAccount');
const SupplierAddressApi = require('../queries/SupplierAddress');
const SupplierContactApi = require('../queries/SupplierContact');
const SupplierCapabilityApi = require('../queries/Capability');
const Supplier2UserApi = require('../queries/Supplier2User');
const userService = require('../services/user');
const businessLinkService = require('../services/businessLink');
const Promise = require('bluebird');

class Supplier {
  constructor(app, db) {
    this.app = app;
    this.db = db;
    this.supplierApi = new SupplierApi(db);
    this.supplierVisibilityApi = new SupplierVisibilityApi(db);
    this.supplierBankAccountApi = new SupplierBankAccountApi(db);
  }

  init() {
    this.app.get('/api/suppliers', (req, res) => this.index(req, res));
    this.app.get('/api/suppliers/exists', (req, res) => this.existsSuppliers(req, res));
    this.app.get('/api/suppliers/search', (req, res) => this.querySupplier(req, res));
    this.app.post('/api/suppliers', (req, res) => this.create(req, res));
    this.app.get('/api/suppliers/:id', (req, res) => this.show(req, res));
    this.app.put('/api/suppliers/:id', (req, res) => this.update(req, res));
    this.app.delete('/api/suppliers/:id', (req, res) => this.delete(req, res));
  }

  async show(req, res) {
    const includes = req.query.include ? req.query.include.split(',') : [];

    return this.supplierApi.find(req.params.id, includes).then(async supplier => {
      if (!supplier) return handleSupplierNotExists(req.params.id, req, res);

      res.opuscapita.setNoCache();
      const supplier2send = await this.restrictVisibility(supplier, req);
      return res.json(supplier2send);
    });
  }

  async index(req, res) {
    if (req.query.electronicAddress) {
      return this.sendSuppliersForElectronicAddress(req, res);
    }

    if (req.query.search !== undefined) {
      const capabilities = req.query.capabilities ? req.query.capabilities.split(',') : [];
      return this.supplierApi.searchAll(req.query.search, capabilities).then(async suppliers => {
        const suppliers2send = await this.restrictVisibilities(suppliers, req);
        return res.json(suppliers2send);
      });
    } else {
      const includes = req.query.include ? req.query.include.split(',') : [];
      delete req.query.include;

      return this.supplierApi.all(req.query, includes).then(async suppliers => {
        const suppliers2send = await this.restrictVisibilities(suppliers, req);
        return res.json(suppliers2send);
      });
    }
  }

  create(req, res) {
    const newSupplier = req.body;
    this.supplierApi.recordExists(newSupplier).then(exists =>
    {
      if (exists) return res.status('409').json({ message : 'A supplier already exists' });

      return userService.get(req.opuscapita.serviceClient, newSupplier.createdBy).then(userObj => {
        if (userObj.supplierId && !userObj.roles.includes('admin')) return res.status('403').json({ message : 'User already has a supplier' });

        const iban = newSupplier.iban;
        delete newSupplier.iban;

        newSupplier.status = 'new';

        return this.supplierApi.create(newSupplier).then(supplier => {
            if (userObj.roles.includes('admin')) return res.status('200').json(supplier);

            const supplierId = supplier.id;
            const user = { supplierId: supplierId, status: 'registered', roles: ['user', 'supplier-admin'] };

            return Promise.all([
                userService.update(req.opuscapita.serviceClient, supplier.createdBy, user),
                userService.removeRoleFromUser(req.opuscapita.serviceClient, supplier.createdBy, 'registering_supplier')
            ]).then(() => {
                supplier.status = 'assigned';

                const supp1 = Object.assign({ }, supplier.dataValues);
                const supp2 = Object.assign({ }, supplier.dataValues); // Copy needed as Supplier.update() seems to modify supp which then destroys createBankAccount().

                return Promise.all([this.supplierApi.update(supplierId, supp1), this.createBankAccount(iban, supp2)]).spread((supplier, account) => {
                  return res.status('200').json(supplier);
                });
              }).catch(error => {
                this.supplierApi.delete(supplierId).then(() => null);
                req.opuscapita.logger.error('Error when creating Supplier: %s', error.message);

                return res.status((error.response && error.response.statusCode) || 400).json({ message : error.message });
              });
          }).catch(error => {
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

  async update(req, res) {
    let supplierId = req.params.id;

    if (supplierId !== req.body.id) {
      const message = 'Inconsistent data';
      req.opuscapita.logger.error('Error when updating Supplier: %s', message);
      return res.status('422').json({ message: message });
    }

    try {
      const exists = await this.supplierApi.exists(supplierId);

      if (!exists) return handleSupplierNotExists(supplierId, req, res);

      req.body.status = 'updated';
      const supplier = await this.supplierApi.update(supplierId, req.body);
      await req.opuscapita.eventClient.emit('supplier.supplier.updated', supplier);

      return res.status('200').json(supplier);
    } catch(error) {
      req.opuscapita.logger.error('Error when updating Supplier: %s', error.message);
      return res.status('400').json({ message : error.message });
    }
  }

  async delete(req, res) {
    const supplierId = req.params.id;

    try {
      const exists = await this.supplierApi.exists(supplierId);

      if (!exists) return handleSupplierNotExists(supplierId, req, res);

      await this.supplierApi.delete(supplierId);

      const capabilityApi = new SupplierCapabilityApi(this.db);
      const addressApi = new SupplierAddressApi(this.db);
      const sup2UserApi = new Supplier2UserApi(this.db);
      const contactApi = new SupplierContactApi(this.db);

      await Promise.all([
        this.supplierBankAccountApi.delete(supplierId), addressApi.delete(supplierId), sup2UserApi.delete(supplierId),
        contactApi.delete(supplierId), capabilityApi.delete(supplierId), this.supplierVisibilityApi.delete(supplierId)
      ]);

      await req.opuscapita.eventClient.emit('supplier.supplier.deleted', { id: supplierId });

      return res.status('200').json({ message: `Supplier with id ${supplierId} deleted.` })
    } catch(error) {
      req.opuscapita.logger.error('Error when deleting Supplier: %s', error.message);
      return res.status('400').json({ message : error.message });
    }
  }

  createBankAccount(iban, supplier) {
    if (!iban) return Promise.resolve();

    const bankAccount = {
      accountNumber: iban,
      supplierId: supplier.id,
      createdBy: supplier.createdBy,
      changedBy: supplier.createdBy
    };

    return this.supplierBankAccountApi.create(bankAccount);
  }

  existsSuppliers(req, res) {
    return this.supplierApi.recordExists(req.query).then(exists => res.json(exists));
  }

  async querySupplier(req, res) {
    const supplier = await this.supplierApi.searchRecord(req.query);

    if (!supplier) return res.status('404').json(supplier);

    return res.json(supplier);
  }

  async sendSuppliersForElectronicAddress(req, res) {
    try {
      const electronicAddress = req.query.electronicAddress;
      const electronicAddressDecoder = require('@opuscapita/electronic-address');
      const data = electronicAddressDecoder.decode(electronicAddress);

      if (!data.value) return res.status('400').json({ message: `Electronic address ${electronicAddress} could not be decoded` });

      const suppliers = await this.supplierApi.all({ [getIdentifier[data.type]]: data.value });
      const suppliers2send = await this.restrictVisibilities(suppliers, req);

      if (suppliers2send.length <= 1) return res.json(suppliers2send);

      if (!data.ext) return res.json(suppliers2send.filter(supplier => !Boolean(supplier.parentId)));

      return res.json(suppliers2send.filter(supplier => supplier.subEntityCode === data.ext));
    } catch(err) { return res.status('400').json({ message : err.message }) };
  }

  async restrictVisibility(supplier, req) {
    const roles = req.opuscapita.userData('roles');
    if (!req.query.public && (roles.some(rol => rol === 'admin' || rol.match('svc_')) )) return supplier;

    const supplierId = req.opuscapita.userData('supplierId');
    if (!req.query.public && roles.some(rol => rol.match('supplier')) && supplier.id === supplierId) return supplier;

    if (!supplier.contacts && !supplier.bankAccounts) return supplier;

    const visibility = await this.supplierVisibilityApi.find(supplier.id);

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

  restrictVisibilities(suppliers, req) {
    return Promise.all(suppliers.map(supplier => this.restrictVisibility(supplier, req)));
  }
};

let handleSupplierNotExists = function(supplierId, req, res)
{
  const message = 'A supplier with ID ' + supplierId + ' does not exist.';
  req.opuscapita.logger.error('Error when updating Supplier: %s', message);
  return res.status('404').json({ message : message });
};

module.exports = Supplier;
