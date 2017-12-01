const SupplierContact = require('../queries/supplier_contacts');
const userService = require('../services/user');
const authService = require('../services/auth');

module.exports = function(app, db, config) {
  SupplierContact.init(db, config).then(() =>
  {
    app.get('/api/suppliers/:supplierId/contacts', (req, res) => sendSupplierContacts(req, res));
    app.post('/api/suppliers/:supplierId/contacts', (req, res) => createSupplierContact(req, res));
    app.post('/api/suppliers/:supplierId/contacts/createUser', (req, res) => createUserFromContact(req, res));
    app.get('/api/suppliers/:supplierId/contacts/:contactId', (req, res) => sendSupplierContact(req, res));
    app.put('/api/suppliers/:supplierId/contacts/:contactId', (req, res) => updateSupplierContact(req, res));
    app.delete('/api/suppliers/:supplierId/contacts/:contactId', (req, res) => deleteSupplierContact(req, res));
  });
};

let sendSupplierContacts = function(req, res)
{
  SupplierContact.all(req.params.supplierId).then(contacts =>
  {
    res.opuscapita.setNoCache();
    res.json(contacts);
  });
};

let sendSupplierContact = function(req, res)
{
  SupplierContact.find(req.params.supplierId, req.params.contactId).then(contact =>
  {
    res.opuscapita.setNoCache();
    res.json(contact);
  });
};

let createSupplierContact = function(req, res)
{
  SupplierContact.create(req.body).then(contact => res.status('200').json(contact))
  .catch(error => {
    req.opuscapita.logger.error('Error when creating SupplierContact: %s', error.message);
    return res.status('400').json({ message : error.message });
  });
};

let createUserFromContact = function(req, res)
{
  const contact = req.body;
  return SupplierContact.contactExists(req.params.supplierId, contact.id).then(exists => {
    if (!exists) return handleContactNotExistError(res, contact.id, req.opuscapita.logger);

    return userService.getProfile(req.opuscapita.serviceClient, contact.email).then(() => {
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
          return updateAndRenderContact(contact.supplierId, contact.id, { isLinkedToUser: true }, res);
        });
      } else {
        req.opuscapita.logger.error('Error when creating user from SupplierContact: %s', error.message);
        return res.status('400').json({ message : error.message });
      }
    });
  });
};

let updateSupplierContact = function(req, res)
{
  const contactId = decodeURIComponent(req.params.contactId);
  const supplierId = req.params.supplierId;
  return SupplierContact.contactExists(supplierId, contactId).then(exists =>
  {
    if(!exists) return handleContactNotExistError(res, contactId, req.opuscapita.logger);

    return updateAndRenderContact(supplierId, contactId, req.body, res);
  })
  .catch(error => {
    req.opuscapita.logger.error('Error when updating SupplierContact: %s', error.message);
    return res.status('400').json({ message : error.message });
  });
};

let deleteSupplierContact = function(req, res)
{
  let contactId = decodeURIComponent(req.params.contactId);
  SupplierContact.delete(req.params.supplierId, contactId).then(() => res.status('200').json(null))
  .catch(error => {
    req.opuscapita.logger.error('Error when deleting SupplierContact: %s', error.message);
    return res.status('400').json({ message : error.message });
  });
};

let handleContactNotExistError = function(response, contactId, logger) {
  const message = 'A supplier contact with ID ' + contactId + ' does not exist.'
  logger.error('Error when updating SupplierContact: %s', message);
  return response.status('404').json({ message : message });
};

let updateAndRenderContact = function(supplierId, contactId, attributes, response) {
  return SupplierContact.update(supplierId, contactId, attributes).then(contact => response.status('200').json(contact));
};
