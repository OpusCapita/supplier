const Supplier2Users = require('../queries/supplier2users');
const Suppliers = require('../queries/suppliers');
const notifier = require('../services/notifier');
const userService = require('../services/user');

module.exports = function(app, db, config) {
Promise.all([Supplier2Users.init(db, config), Suppliers.init(db, config)]).then(() =>
  {
    app.post('/api/supplier_access', (req, res) => createSupplierAccess(req, res));
    app.get('/api/supplier_access/:userId', (req, res) => sendSupplierAccess(req, res));
    app.put('/api/grant_supplier_access', (req, res) => addSupplierToUser(req, res));
  });
};

let sendSupplierAccess = function(req, res)
{
  return Supplier2Users.find(req.params.userId).then(supplier2user => {
    if (!supplier2user) return res.status('404').json({ message: 'Supplier2User not found' });

    return res.json(supplier2user);
  });
};

let createSupplierAccess = function(req, res)
{
  const attributes = req.body;
  return Supplier2Users.find(attributes.userId).then(supplier2user => {
    if (supplier2user) return res.status('200').json(supplier2user);

    attributes.status = 'requested';
    return Supplier2Users.create(attributes).
      then(supplier2user => {
        return userService.allForSupplierId(req.opuscapita.serviceClient, supplier2user.supplierId).then(users => {
          for (const user of users) {
            if (user.roles.includes('supplier-admin')) notifier.notifyUserAccessRequest(user.profile, req);
          }
          return res.status('201').json(supplier2user);
        });
      }).
      catch(error => {
        req.opuscapita.logger.error('Error when creating Supplier2User: %s', error.message);

        return res.status('400').json({ message : error.message });
      });
  });
}

let addSupplierToUser = function(req, res)
{
  const supplierId = req.body.supplierId;

  return Suppliers.exists(supplierId).then(exists =>
  {
    if(exists) {
      const user = { supplierId: supplierId, roles: ['supplier'] };

      return userService.update(req.opuscapita.serviceClient, req.body.userId, user).then(() => {
        res.status('200').json({ message: 'Supplier successfully added to user' });
      }).
      catch(error => {
        req.opuscapita.logger.error('Error when adding Supplier to User: %s', error.message);
        return res.status((error.response && error.response.statusCode) || 400).json({ message : error.message });
      });
    } else {
      const message = 'A supplier with ID ' + supplierId + ' does not exist.';
      req.opuscapita.logger.error('Error when adding Supplier to User: %s', message);
      return res.status('404').json({ message : message });
    }
  })
  .catch(error => {
    req.opuscapita.logger.error('Error when adding Supplier to User: %s', error.message);
    return res.status('400').json({ message : error.message });
  });
}
