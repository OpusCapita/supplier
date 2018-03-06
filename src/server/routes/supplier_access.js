const Supplier2Users = require('../queries/supplier2users');
const Suppliers = require('../queries/suppliers');
const notifier = require('../services/notifier');
const userService = require('../services/user');

module.exports = function(app, db, config) {
Promise.all([Supplier2Users.init(db, config), Suppliers.init(db, config)]).then(() =>
  {
    app.post('/api/supplier_access', (req, res) => createSupplierAccess(req, res));
    app.get('/api/supplier_access', (req, res) => sendSupplierAccesses(req, res));
    app.put('/api/supplier_access/:id', (req, res) => updateSupplierAccess(req, res));
    app.get('/api/supplier_access/:userId', (req, res) => sendSupplierAccess(req, res));
    app.put('/api/grant_supplier_access', (req, res) => addSupplierToUser(req, res));
  });
};

let sendSupplierAccesses = function(req, res)
{
  const supplierId = req.query.supplierId;
  if (!supplierId) return res.status('400').json({ message: 'supplierId query parameter must be given' });

  return Supplier2Users.all(supplierId).then(supplier2users => {
    if (req.query.include !== 'user') return res.json(supplier2users);

    const userIds = supplier2users.map(supplier2user => supplier2user.userId);
    return userService.allForUserIds(req.opuscapita.serviceClient, userIds).then(users => {
      const supplier2usersWithUsers = supplier2users.map(supplier2user => {
        let data = supplier2user.dataValues;
        const user = users.find(us => us.id === data.userId);
        data.user = user ? user.profile : {};
        return data;
      });

      return res.json(supplier2usersWithUsers);
    });
  });
}

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
          const notifiersPromises = uses.reduce((arr, user) => {
            if (user.roles.includes('supplier-admin')) arr.push(notifier.notifyUserAccessRequest(user.profile, req));
            return arr;
          }, []);
          return Promise.all(notifiersPromises).then(() => res.status('201').json(supplier2user)).
            catch(error => {
              req.opuscapita.logger.warn('Error when sending email: %s', error.message);
              supplier2user.warning = error.message;
              return res.status('201').json(supplier2user);
            });
        });
      }).
      catch(error => {
        req.opuscapita.logger.error('Error when creating Supplier2User: %s', error.message);

        return res.status('400').json({ message : error.message });
      });
  });
}

let updateSupplierAccess = function(req, res)
{
  const supplier2userId = req.params.id;

  return Supplier2Users.exists(supplier2userId).then(exists => {
    if (exists) {
      const access = req.body;
      return Supplier2Users.update(supplier2userId, access).then(supplier2user => {
        if (access.status === 'requested') return res.json(supplier2user);

        return userService.getProfile(req.opuscapita.serviceClient, access.userId).then(userProfile => {
          let notifierPromise;
          if (access.status === 'approved') notifierPromise = notifier.notifyUserAccessApproval(userProfile, req);
          if (access.status === 'rejected') notifierPromise = notifier.notifyUserAccessRejection(userProfile, req);

          return notifierPromise.then(() => res.json(supplier2user)).
            catch(error => {
              req.opuscapita.logger.warn('Error when sending email: %s', error.message);
              supplier2user.warning = error.message;
              return res.json(supplier2user);
            });
        });
      });
    } else {
      const message = 'No supplier_access with Id ' + supplier2userId + ' exists.'
      req.opuscapita.logger.error('Error when updating Supplier2User: %s', message);
      return res.status('404').json({ message : message });
    }
  }).
  catch(error => {
    req.opuscapita.logger.error('Error when updating Supplier2User: %s', error.message);
    return res.status('400').json({ message : error.message });
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
