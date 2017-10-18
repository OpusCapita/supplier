const request = require('superagent-bluebird-promise');

class ApiBase
{
  ajax = request;
}

export default ApiBase;
