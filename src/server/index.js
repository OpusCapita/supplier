const Logger = require('ocbesbn-logger'); // Logger
const server = require('@opuscapita/web-init'); // Web server
const db = require('@opuscapita/db-init'); // Database

const logger = new Logger();
logger.redirectConsoleOut(); // Force anyone using console outputs into Logger format.

const serverConfig = (db) => ({
  server: {
    staticFilePath: __dirname + '/static',
    port : process.env.PORT || 3001,
    enableBouncer: true,
    enableEventClient : true
  },
  routes: { dbInstance: db },
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
