import ApiBase from './ApiBase';

class Country extends ApiBase {
  getCountry(countryId) {
    return this.ajax.get(`/isodata/api/countries/${countryId}`).set('Accept', 'application/json').
      then(response => response.body.name || response.body.id);
  }
}

export default Country;
