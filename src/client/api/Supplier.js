import ApiBase from './ApiBase';

class Supplier extends ApiBase {
  getSupplier(supplierId) {
    return this.ajax.get(`/supplier/api/suppliers/${supplierId}`).set('Accept', 'application/json').
      then(response => response.body);
  }

  updateSupplier(supplierId, supplier) {
    return this.ajax.put(`/supplier/api/suppliers/${supplierId}`).set('Accept', 'application/json').
      send(supplier).then(response => response.body);
  }
}

export default Supplier;
