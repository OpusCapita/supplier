import ApiBase from './ApiBase';

class Visibility extends ApiBase {
  get(supplierId) {
    return this.ajax.get(`/supplier/api/suppliers/${supplierId}/visibility`).set('Accept', 'application/json').
      then(response => response.body);
  }
};

export default Visibility;
