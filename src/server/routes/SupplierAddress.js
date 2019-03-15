const SupplierAddressApi = require('../api/SupplierAddress');

class SupplierAddress {
  constructor(app, db) {
    this.app = app;
    this.supplierAddressApi = new SupplierAddressApi(db);
  }

  init() {
    this.app.get('/api/suppliers/:supplierId/addresses', (req, res) => this.index(req, res));
    this.app.post('/api/suppliers/:supplierId/addresses', (req, res) => this.create(req, res));
    this.app.get('/api/suppliers/:supplierId/addresses/:addressId', (req, res) => this.show(req, res));
    this.app.put('/api/suppliers/:supplierId/addresses/:addressId', (req, res) => this.update(req, res));
    this.app.delete('/api/suppliers/:supplierId/addresses/:addressId', (req, res) => this.delete(req, res));
  }

  index(req, res) {
    return this.supplierAddressApi.all(req.params.supplierId).then(addresses => {
      res.opuscapita.setNoCache();
      return res.json(addresses);
    });
  }

  show(req, res) {
    return this.supplierAddressApi.find(req.params.supplierId, req.params.addressId).then(address => {
      res.opuscapita.setNoCache();
      return res.json(address);
    });
  }

  create(req, res) {
    return this.supplierAddressApi.create(req.body).then(address => res.status('201').json(address))
    .catch(error => {
      req.opuscapita.logger.error('Error when creating SupplierAddress: %s', error.message);
      return res.status('400').json({ message : error.message });
    });
  }

  update(req, res) {
    let addressId = req.params.addressId;
    let supplierId = req.params.supplierId;
    return this.supplierAddressApi.exists(supplierId, addressId).then(exists => {
      if(exists) return this.supplierAddressApi.update(supplierId, addressId, req.body).then(address => res.json(address));

      const message = 'A supplier address with this ID does not exist.'
      req.opuscapita.logger.error('Error when updating SupplierAddress: %s', message);
      return res.status('404').json({ message : message });
    }).catch(error => {
      req.opuscapita.logger.error('Error when updating SupplierAddress: %s', error.message);
      return res.status('400').json({ message : error.message });
    });
  }

  delete(req, res) {
    return this.supplierAddressApi.delete(req.params.supplierId, req.params.addressId).then(() => res.json(null))
    .catch(error => {
      req.opuscapita.logger.error('Error when deleting SupplierAddress: %s', error.message);
      return res.status('400').json({ message : error.message });
    });
  }
};

module.exports = SupplierAddress;
