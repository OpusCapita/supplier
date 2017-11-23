module.exports.allForSupplierId = function(serviceClient, supplierId) {
  return serviceClient.get('user', `/api/users?supplierId=${supplierId}&include=profile`, true).spread(users => users);
}

module.exports.allForUserIds = function(serviceClient, userIds) {
  return serviceClient.get('user', `/api/users?ids=${userIds.join(',')}&include=profile`, true).spread(users => users);
}

module.exports.getProfile = function(serviceClient, userId) {
  return serviceClient.get('user', `/api/users/${userId}/profile`, true).spread(profile => profile);
}

module.exports.update = function(serviceClient, userId, user) {
  return serviceClient.put('user', `/api/users/${userId}`, user, true);
}
