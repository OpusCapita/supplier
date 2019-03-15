const utils = require('../utils/lib');

class SupplierContact {
  constructor(db) {
    this.supplierContact = db.models.SupplierContact;
  }

  all(supplierId) {
    return this.supplierContact.findAll({ where: { supplierId: supplierId } });
  }

  find(supplierId, contactId) {
    return this.supplierContact.findOne({ where: { supplierId: supplierId, id: contactId } });
  }

  create(contact) {
    let contactId = contact.email;
    const self = this;

    function generateContactId(id) {
      return self.supplierContact.findOne({ where: { id: id} }).then(contact => {
        if (contact) return generateContactId(contactId + utils.randomNumber());

        return id;
      });
    }

    return generateContactId(contactId).then(id => {
      contact.id = id;
      return this.supplierContact.create(contact);
    });
  }

  update(supplierId, contactId, contact) {
    return this.supplierContact.update(contact, { where: { id: contactId } }).then(() => {
      return this.find(supplierId, contactId);
    });
  }

  delete(supplierId, contactId) {
    let deleteQuery = { supplierId: supplierId };
    if (contactId) deleteQuery.id = contactId;
    return this.supplierContact.destroy({ where: deleteQuery }).then(() => null);
  }

  exists(supplierId, contactId) {
    return this.find(supplierId, contactId).then(contact => Boolean(contact));
  }
};

module.exports = SupplierContact;
