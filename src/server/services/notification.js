const { en, de } = require('../i18n');

module.exports.accessRequest = function({ serviceClient, supplier, requestUser, userIds, req }) {
  const link = getHostUrl(req) + '/bnp/supplierInformation?tab=accessApproval';
  const translations = {
    en: { ...en.notification.accessRequest(supplier.supplierName, requestUser, link), isDefault: true },
    de: { ...de.notification.accessRequest(supplier.supplierName, requestUser, link) }
  }

  return sendNotification(serviceClient, link, translations, userIds);
};

module.exports.accessApproval = function({  serviceClient, supplier, userIds, req }) {
  const link = getHostUrl(req) + '/bnp/supplierRegistration';
  const translations = {
    en: { ...en.notification.accessApproval(supplier.supplierName, link), isDefault: true },
    de: { ...de.notification.accessApproval(supplier.supplierName, link) }
  }

  return sendNotification(serviceClient, link, translations, userIds);
};

module.exports.accessRejection = function({ serviceClient, supplier, userIds, req }) {
  const link = getHostUrl(req) + '/bnp/supplierRegistration';
  const translations = {
    en: { ...en.notification.accessRejection(supplier.name), isDefault: true },
    de: { ...de.notification.accessRejection(supplier.name) }
  }

  return sendNotification(serviceClient, link, translations, userIds);
};

let sendNotification = function(serviceClient, link, translations, users) {
  const deliveryMode = getDeliveryMode(users);
  const categoryId = 'supplier.user-access';

  const body = { translations, link, categoryId, users, deliveryMode };
  return serviceClient.post('notification', `/api/notifications`, body, true);
}

let getDeliveryMode = function(users) {
  if (users.length === 0) return ["notification"];

  return ["notification", "email"];
}

let getHostUrl = function(req) {
  const externalHost = req.get('X-Forwarded-Host') || req.get('Host');

  return req.protocol + '://' + externalHost;
};
