const SupplierApi = require('../api/Supplier');
const Supplier2UserApi = require('../api/Supplier2User');
const notification = require('../services/notification');
const userService = require('../services/user');

class SupplierAccess {
  constructor(app, db) {
    this.app = app;
    this.supplierApi = new SupplierApi(db);
    this.supplier2UserApi = new Supplier2UserApi(db);
  }

  init() {
    this.app.post('/api/supplier_access', (req, res) => this.create(req, res));
    this.app.get('/api/supplier_access', (req, res) => this.index(req, res));
    this.app.put('/api/supplier_access/:id', (req, res) => this.update(req, res));
    this.app.get('/api/supplier_access/:userId', (req, res) => this.show(req, res));
    this.app.put('/api/grant_supplier_access', (req, res) => this.addSupplierToUser(req, res));
  }

  async index(req, res) {
    const supplierId = req.query.supplierId;
    if (!supplierId) return res.status('400').json({ message: 'supplierId query parameter must be given' });

    const supplier2users = await this.supplier2UserApi.all(supplierId);
    if (req.query.include !== 'user') return res.json(supplier2users);

    const userIds = supplier2users.map(supplier2user => supplier2user.userId);
    const users = await userService.allForUserIds(req.opuscapita.serviceClient, userIds);

    const supplier2usersWithUsers = supplier2users.map(supplier2user => {
      let data = supplier2user.dataValues;
      const user = users.find(us => us.id === data.userId);
      data.user = user ? user.profile : {};
      return data;
    });

    return res.json(supplier2usersWithUsers);
  }

  async show(req, res) {
    const supplier2user = await this.supplier2UserApi.find(req.params.userId);
    if (!supplier2user) return res.status('404').json({ message: 'Supplier2User not found' });

    return res.json(supplier2user);
  }

  async create(req, res) {
    const attributes = req.body;
    const supp2user = await this.supplier2UserApi.find(attributes.userId);

    if (supp2user) return res.status('200').json(supp2user);

    attributes.status = 'requested';
    return this.supplier2UserApi.create(attributes).then(async supplier2user => {
      const serviceClient = req.opuscapita.serviceClient;
      const requestUser = await userService.getProfile(serviceClient, supplier2user.userId);
      const supplier = await this.supplierApi.find(supplier2user.supplierId);

      return userService.allForSupplierId(serviceClient, supplier2user.supplierId).then(users => {
        const userIds = users.reduce((arr, user) => {
          if (user.roles.includes('supplier-admin')) arr.push(user.id);
          return arr;
        }, []);

        return notification.accessRequest({ serviceClient, supplier, requestUser, userIds, req }).then(() => res.status('201').json(supplier2user)).
          catch(error => {
            req.opuscapita.logger.warn('Error when sending email: %s', error.message);
            supplier2user.warning = error.message;
            return res.status('201').json(supplier2user);
          });
      });
    }).catch(error => {
      req.opuscapita.logger.error('Error when creating Supplier2User: %s', error.message);

      return res.status('400').json({ message : error.message });
    });
  }

  async update(req, res) {
    const supplier2userId = req.params.id;

    return this.supplier2UserApi.exists(supplier2userId).then(exists => {
      if (!exists) {
        const message = 'No supplier_access with Id ' + supplier2userId + ' exists.'
        req.opuscapita.logger.error('Error when updating Supplier2User: %s', message);
        return res.status('404').json({ message : message });
      }

      const access = req.body;
      return this.supplier2UserApi.update(supplier2userId, access).then(async supplier2user => {
        if (supplier2user.status === 'requested') return res.json(supplier2user);

        const serviceClient = req.opuscapita.serviceClient;
        const userIds = [supplier2user.userId];
        const supplier = await this.supplierApi.find(supplier2user.supplierId);
        let notificationPromise;
        if (supplier2user.status === 'approved') notificationPromise = notification.accessApproval({ serviceClient, supplier, userIds, req });
        if (supplier2user.status === 'rejected') notificationPromise = notification.accessRejection({ serviceClient, supplier, userIds, req });

        return notificationPromise.then(() => res.json(supplier2user)).catch(error => {
          req.opuscapita.logger.warn('Error when sending email: %s', error.message);
          supplier2user.warning = error.message;
          return res.json(supplier2user);
        });
      });
    }).catch(error => {
      req.opuscapita.logger.error('Error when updating Supplier2User: %s', error.message);
      return res.status('400').json({ message : error.message });
    });
  }

  addSupplierToUser(req, res) {
    const supplierId = req.body.supplierId;

    return this.supplierApi.exists(supplierId).then(exists => {
      if (!exists) {
        const message = 'A supplier with ID ' + supplierId + ' does not exist.';
        req.opuscapita.logger.error('Error when adding Supplier to User: %s', message);
        return res.status('404').json({ message : message });
      }

      const user = { supplierId: supplierId, roles: ['supplier'] };

      return userService.update(req.opuscapita.serviceClient, req.body.userId, user).then(() => {
        return res.status('200').json({ message: 'Supplier successfully added to user' });
      }).catch(error => {
        req.opuscapita.logger.error('Error when adding Supplier to User: %s', error.message);
        return res.status((error.response && error.response.statusCode) || 400).json({ message : error.message });
      });
    }).catch(error => {
      req.opuscapita.logger.error('Error when adding Supplier to User: %s', error.message);
      return res.status('400').json({ message : error.message });
    });
  }
};

module.exports = SupplierAccess;
