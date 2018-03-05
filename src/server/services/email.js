'use strict'

const i18n = require('../i18n');
const Handlebars = require('handlebars');
const fs = require('fs');

module.exports.sendAccessRequest = function(userProfile, req) {
  const accessi18n = i18n[userProfile.languageId].email.accessRequest;
  const host = getOriginalProtocolHostPort(req);
  const html = Handlebars.compile(template())({
    ocUrl:  host + '/bnp',
    url: host + '/bnp/supplierInformation?tab=accessApproval',
    i18n: accessi18n
  });

  return sendEmail(req, userProfile.email, accessi18n.subject, html);
};

module.exports.sendAccessApproval = function(userProfile, req) {
  const accessi18n = i18n[userProfile.languageId].email.accessApproval;
  const host = getOriginalProtocolHostPort(req);
  const html = Handlebars.compile(template())({
    ocUrl:  host + '/bnp',
    url: host + '/bnp/supplierRegistration',
    i18n: accessi18n
  });

  return sendEmail(req, userProfile.email, accessi18n.subject, html);
};

module.exports.sendAccessRegection = function(userProfile, req) {
  const accessi18n = i18n[userProfile.languageId].email.accessRegection;
  const host = getOriginalProtocolHostPort(req);
  const html = Handlebars.compile(template())({ ocUrl:  host + '/bnp', url: '', i18n: accessi18n });

  return sendEmail(req, userProfile.email, accessi18n.subject, html);
};

let sendEmail = function(req, to, subject, html) {
  const body = { to: to, subject: subject, html: html };
  return req.opuscapita.serviceClient.post('email', '/api/send', body, true);
};

let template = function() {
  return fs.readFileSync(`${process.cwd()}/src/server/email-templates/access.handlebars`, 'utf8');
};

let getOriginalProtocolHostPort = function(req) {
  const externalHost = req.get('X-Forwarded-Host') || req.get('Host');

  return req.protocol + '://' + externalHost;
};
