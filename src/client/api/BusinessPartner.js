import ApiBase from './ApiBase';

class BusinessPartner extends ApiBase {
  find(supplierId, queryParams) {
    return this.ajax.get(`/supplier/api/suppliers/${supplierId}`).set('Accept', 'application/json').
      query(queryParams || {}).then(response => response.body);
  }

  all(queryParams) {
    return this.ajax.get('/supplier/api/suppliers').set('Accept', 'application/json').
      query(queryParams || {}).then(response => response.body);
  }

  organization(supplierId) {
    return this.ajax.get(`/supplier/api/suppliers/${supplierId}/organization`).
      set('Accept', 'application/json').then(response => response.body);
  }

  create(supplier) {
    return this.ajax.post('/supplier/api/suppliers').set('Accept', 'application/json').send(supplier).
      then(response => response.body);
  }

  update(supplierId, supplier) {
    return this.ajax.put(`/supplier/api/suppliers/${supplierId}`).set('Accept', 'application/json').
      send(supplier).then(response => response.body);
  }

  search(queryParams) {
    return this.ajax.get('/supplier/api/suppliers/search').set('Accept', 'application/json').
      query(queryParams).then(response => response.body);
  }

  exists(queryParams) {
    return this.ajax.get('/supplier/api/suppliers/exists').set('Accept', 'application/json').
      query(queryParams).then(response => response.body);
  }

  profileStrength(supplierId) {
    return this.ajax.get(`/supplier/api/suppliers/${supplierId}/profile_strength`).
      set('Accept', 'application/json').then(response => response.body);
  }
}

export default BusinessPartner;
