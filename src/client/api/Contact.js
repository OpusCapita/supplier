import ApiBase from './ApiBase';

class Contact extends ApiBase {
  createContact(supplierId, contact) {
    return this.ajax.post(`/supplier/api/suppliers/${supplierId}/contacts`).
      set('Accept', 'application/json').send(contact).then(response => response.body);
  }
}

export default Contact;
