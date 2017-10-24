'use strict'

const i18n = require('../i18n');
const Handlebars = require('handlebars');
const fs = require('fs');
const RedisEvents = require('ocbesbn-redis-events');
var events = new RedisEvents({ consul : { host : 'consul' } });

module.exports.sendAccessRequest = function(userProfile, req) {
  const accessi18n = i18n[userProfile.languageId].email.accessRequest;
  const host = getOriginalProtocolHostPort(req);
  const html = Handlebars.compile(template())({
    ocUrl:  host + '/bnp',
    url: host + '/bnp/supplierInformation?tab=accessApproval',
    i18n: accessi18n
  });

  return sendEmail(userProfile.email, accessi18n.subject, html);
};

module.exports.sendAccessApproval = function(userProfile, req) {
  const accessi18n = i18n[userProfile.languageId].email.accessApproval;
  const host = getOriginalProtocolHostPort(req);
  const html = Handlebars.compile(template())({
    ocUrl:  host + '/bnp',
    url: host + '/bnp/supplierRegistration',
    i18n: accessi18n
  });

  return sendEmail(userProfile.email, accessi18n.subject, html);
};

module.exports.sendAccessApproval = function(userProfile, req) {
  const accessi18n = i18n[userProfile.languageId].email.accessRegection;
  const host = getOriginalProtocolHostPort(req);
  const html = Handlebars.compile(template())({ ocUrl:  host + '/bnp', url: '', i18n: accessi18n });

  return sendEmail(userProfile.email, accessi18n.subject, html);
};

function sendEmail(to, subject, html) {
  return events.emit({ to: to, subject: subject, html: html }, 'email');
};

function template() {
  return fs.readFileSync(`${process.cwd()}/src/server/email-templates/access.handlebars`, 'utf8');
};

function getOriginalProtocolHostPort(req) {
  const externalHost = req.get('X-Forwarded-Host') || req.get('Host');

  return req.protocol + '://' + externalHost;
};
