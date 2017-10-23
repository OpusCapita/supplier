import ApiBase from './ApiBase';

class Access extends ApiBase {
  getAccess(userId) {
    return this.ajax.get(`/supplier/api/supplier_access/${userId}`).set('Accept', 'application/json').
      then(response => response.body);
  }

  createAccess(access) {
    return this.ajax.post('/supplier/api/supplier_access').set('Accept', 'application/json').
      send(access).then(response => response.body);
  }

  grantAccess(access) {
    return this.ajax.put('/supplier/api/grant_supplier_access').set('Accept', 'application/json').
      send(access).then(response => response.body);
  }
}

export default Access;
