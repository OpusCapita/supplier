import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";
// initialize logging
// import "./logger";
// initialize sequilize
import db from "./db/models";

// populate data
require(`./db/data`).default(db);

// create express app
const app = express();

const port = process.env.PORT || 3001;
const host = process.env.HOST || 'localhost';

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev', {
    stream: {
      write: console.log
    }
  }));
}
app.use(helmet());
// enable cross origin requests
app.use(function(req, res, next) {
  // only specific/trusted hosts have to be configured
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// register rest api for DB specific models
require('./routes').default(app, db);

if (process.env.NODE_ENV === 'production') {
  app.use('/static', express.static(__dirname + '/../../build/client'));
} else {
  const webpack = require('webpack');
  const webpackMiddleware = require('webpack-dev-middleware');

  app.use(webpackMiddleware(webpack(require('../../webpack.development.config.js')), {
    publicPath: '/static',
    noInfo: true
  }));

  app.use(express.static(__dirname + '/../client/demo'));

  app.get(['/', '/address', '/contact'], function(req, res) {
    res.sendFile(path.normalize(__dirname + '/../client/demo/index.html'));
  });
}

// launch application
app.listen(port, host, err => {
  if (err) {
    console.log(err);
  }
  console.log(`The server is running at http://${host}:${port}/`);
});

