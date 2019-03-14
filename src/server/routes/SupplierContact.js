const SupplierContactApi = require('../api/SupplierContact');
const User = require('../services/User');
const authService = require('../services/auth');

class SupplierContact {
  constructor(app, db) {
    this.app = app;
    this.supplierContactApi = new SupplierContactApi(db);
  }

  init() {
    this.app.get('/api/suppliers/:supplierId/contacts', (req, res) => this.index(req, res));
    this.app.post('/api/suppliers/:supplierId/contacts', (req, res) => this.create(req, res));
    this.app.post('/api/suppliers/:supplierId/contacts/createUser', (req, res) => this.createUser(req, res));
    this.app.get('/api/suppliers/:supplierId/contacts/:contactId', (req, res) => this.show(req, res));
    this.app.put('/api/suppliers/:supplierId/contacts/:contactId', (req, res) => this.update(req, res));
    this.app.delete('/api/suppliers/:supplierId/contacts/:contactId', (req, res) => this.delete(req, res));
  }

  index(req, res) {
    return this.supplierContactApi.all(req.params.supplierId).then(contacts => {
      res.opuscapita.setNoCache();
      return res.json(contacts);
    });
  }

  show(req, res) {
    return this.supplierContactApi.find(req.params.supplierId, req.params.contactId).then(contact => {
      res.opuscapita.setNoCache();
      return res.json(contact);
    });
  }

  create(req, res) {
    return this.supplierContactApi.create(req.body).then(contact => res.status('201').json(contact))
    .catch(error => {
      req.opuscapita.logger.error('Error when creating SupplierContact: %s', error.message);
      return res.status('400').json({ message : error.message });
    });
  }

  update(req, res) {
    const contactId = decodeURIComponent(req.params.contactId);
    const supplierId = req.params.supplierId;
    return this.supplierContactApi.exists(supplierId, contactId).then(exists => {
      if(!exists) return handleContactNotExistError(res, contactId, req.opuscapita.logger);

      return this.updateAndRender(supplierId, contactId, req.body, res);
    })
    .catch(error => {
      req.opuscapita.logger.error('Error when updating SupplierContact: %s', error.message);
      return res.status('400').json({ message : error.message });
    });
  }

  createUser(req, res) {
    const contact = req.body;
    return this.supplierContactApi.exists(req.params.supplierId, contact.id).then(exists => {
      if (!exists) return handleContactNotExistError(res, contact.id, req.opuscapita.logger);

      const userService = new User(req.opuscapita.serviceClient);
      return userService.get(contact.email).then(() => {
        return res.status('409').json({ message : 'User already exists' });
      }).catch(error => {
        if (error.response && error.response.statusCode == '404') {
          const user = {
            id: contact.email,
            acceptedConditions: null,
            status: 'emailVerification',
            supplierId: contact.supplierId,
            roles: ['supplier'],
            profile: { firstName: contact.firstName, lastName: contact.lastName, email: contact.email }
          };
          return authService.createUser(req.opuscapita.serviceClient, user).then(() => {
            return this.updateAndRender(contact.supplierId, contact.id, { isLinkedToUser: true }, res);
          });
        } else {
          req.opuscapita.logger.error('Error when creating user from SupplierContact: %s', error.message);
          return res.status('400').json({ message : error.message });
        }
      });
    });
  }

  delete(req, res) {
    const contactId = decodeURIComponent(req.params.contactId);
    return this.supplierContactApi.delete(req.params.supplierId, contactId).then(() => res.json(null))
    .catch(error => {
      req.opuscapita.logger.error('Error when deleting SupplierContact: %s', error.message);
      return res.status('400').json({ message : error.message });
    });
  }

  updateAndRender(supplierId, contactId, attributes, response) {
    return this.supplierContactApi.update(supplierId, contactId, attributes).then(contact => response.json(contact));
  }
};

let handleContactNotExistError = function(response, contactId, logger) {
  const message = 'A supplier contact with ID ' + contactId + ' does not exist.'
  logger.error('Error when updating SupplierContact: %s', message);
  return response.status('404').json({ message : message });
};

module.exports = SupplierContact;
