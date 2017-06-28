const server = require('ocbesbn-web-init'); // Web server
const db = require('ocbesbn-db-init'); // Database

const serverConfig = (db) => ({
  server: {
    staticFilePath: __dirname + '/static'
  },
  routes: {
    dbInstance: db
  },
  serviceClient : {
    injectIntoRequest : true,
    consul : {
      host : 'consul'
    }
  }
});

if (process.env.NODE_ENV !== 'test') {
  /* launch aplication */
  db.init({ consul : { host : 'consul' }, retryCount: 50 })
    .then((db) => server.init(serverConfig(db)))
    .catch((e) => { server.end(); throw e; });
}
