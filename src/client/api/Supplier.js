import ApiBase from './ApiBase';

class Supplier extends ApiBase {
  getSupplier(supplierId) {
    return this.ajax.get(`/supplier/api/suppliers/${supplierId}`).set('Accept', 'application/json').
      then(response => response.body);
  }

  getSuppliers(queryParams) {
    return this.ajax.get('/supplier/api/suppliers').set('Accept', 'application/json').
      query(queryParams || {}).then(response => response.body);
  }

  createSupplier(supplier) {
    return this.ajax.post('/supplier/api/suppliers').set('Accept', 'application/json').send(supplier).
      then(response => response.body);
  }

  updateSupplier(supplierId, supplier) {
    return this.ajax.put(`/supplier/api/suppliers/${supplierId}`).set('Accept', 'application/json').
      send(supplier).then(response => response.body);
  }

  supplierExists(queryParams) {
    return this.ajax.get('/supplier/api/suppliers/exists').set('Accept', 'application/json').
      query(queryParams).then(response => response.body);
  }

  getProfileStrength(supplierId) {
    return this.ajax.get(`/supplier/api/suppliers/${supplierId}/profile_strength`).
      set('Accept', 'application/json').then(response => response.body);
  }
}

export default Supplier;
