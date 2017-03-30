const server = require('ocbesbn-web-init'); // Web server
const db = require('ocbesbn-db-init'); // Database

const developmentServerConfig = (db) => ({
  server: {
    webpack: {
      useWebpack: true,
      configFilePath: __dirname + '/../../webpack.production.config.js'
    }
  },
  routes: {
    dbInstance: db
  }
});

const productionServerConfig = (db) => ({
  server: {
    staticFilePath: __dirname + '/static'
  },
  routes: {
    dbInstance: db
  }
});

const getServerConfig = (db) => process.env.NODE_ENV === 'development' ? developmentServerConfig(db) : productionServerConfig(db);

db.init({ consul : { host : 'consul' } })
  .then((db) => server.init(getServerConfig(db)))
  .catch((e) => { server.end(); throw e; });
