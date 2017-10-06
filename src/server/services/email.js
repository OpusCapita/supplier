'use strict'

const i18n = require('../i18n');
const Handlebars = require('handlebars');
const fs = require('fs');
const RedisEvents = require('ocbesbn-redis-events');
var events = new RedisEvents({ consul : { host : 'consul' } });

module.exports.sendAccessRequest = function(userProfile, req) {
  const lang = userProfile.languageId;
  const template = template('access-request');
  const html = Handlebars.compile(template)({
    ocUrl: getOriginalProtocolHostPort(req) + '/bnp',
    url: getOriginalProtocolHostPort(req) + '/bnp/supplierInformation?tab=accessRequest',
    i18n: i18n[lang].email.accessRequest
  });

  return sendEmail(userProfile.email, i18n[lang].email.accessRequest.subject, html);
}

function sendEmail(to, subject, html) {
  return events.emit({ to: to, subject: subject, html: html }, 'email');
}

function template(type) {
  return fs.readFileSync(`${process.cwd()}/src/server/email-templates/${type}.handlebars`, 'utf8');
}

function getOriginalProtocolHostPort(req) {
  const externalHost = req.get('X-Forwarded-Host') || req.get('Host');

  return req.protocol + '://' + externalHost;
}
