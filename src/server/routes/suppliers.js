const Supplier = require('../queries/suppliers');
const RedisEvents = require('ocbesbn-redis-events');

module.exports = function(app, db, config) {
  Supplier.init(db, config).then(() =>
  {
    this.events = new RedisEvents({ consul : { host : 'consul' } });
    app.get('/api/suppliers', (req, res) => sendSuppliers(req, res));
    app.post('/api/suppliers', (req, res) => createSuppliers(req, res));
    app.get('/api/suppliers/:supplierId', (req, res) => sendSupplier(req, res));
    app.put('/api/suppliers/:supplierId', (req, res) => updateSupplier(req, res));
  });
};

let sendSuppliers = function(req, res)
{
  Supplier.all().then(suppliers =>
  {
    res.json(suppliers);
  });
};

let createSuppliers = function(req, res)
{
  const newSupplier = req.body;
  Supplier.recordExists(newSupplier).then(exists =>
  {
    if(exists) {
      return res.status('409').json({ message : 'A supplier already exists' });
    } else {
      newSupplier.status = 'new';
      Supplier.create(newSupplier)
        .then(supplier => this.events.emit(supplier, 'supplier').then(() => supplier))
        .then(supplier => {
          const userId = supplier.createdBy;
          const supplierId = supplier.supplierId;
          const supplierToUserPromise = req.opuscapita.serviceClient.put('user', `/users/${userId}`, { supplierId: supplierId, status: 'registered' }, true);
          const supplierAdminRolePromise = req.opuscapita.serviceClient.put('user', `/users/${userId}/roles/supplier-admin`, {}, true);

          Promise.all([supplierToUserPromise, supplierAdminRolePromise])
            .then(() => {
              supplier.status = 'assigned';
              Supplier.update(supplierId, supplier.dataValues).then(supplier => {
                this.events.emit(supplier, 'supplier').then(() => res.status('200').json(supplier));
              });
            })
            .catch(error => {
              req.opuscapita.logger.error('Error when creating Supplier: %s', error.message);
              switch (error.response.statusCode) {
                case 404:
                  Supplier.delete(supplierId).then(() => null);
                  res.status(404).json({ message : error.message });
                  break;
                default:
                  res.status(400).json({ message : error.message });
              };
            });
        });
    }
  })
  .catch(error => {
    req.opuscapita.logger.error('Error when creating Supplier: %s', error.message);
    return res.status('400').json({ message : error.message });
  });
}

let sendSupplier = function(req, res)
{
  Supplier.find(req.params.supplierId).then(suppliers =>
  {
    res.json(suppliers);
  });
};

let updateSupplier = function(req, res)
{
  let supplierId = req.params.supplierId;

  if (supplierId !== req.body.supplierId || !req.body.createdBy) {
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
      const message = 'A supplier with this ID does not exist.';
      req.opuscapita.logger.error('Error when updating Supplier: %s', message);
      return res.status('404').json({ message : message });
    }
  })
  .catch(error => {
    req.opuscapita.logger.error('Error when updating Supplier: %s', error.message);
    return res.status('400').json({ message : error.message });
  });
}
