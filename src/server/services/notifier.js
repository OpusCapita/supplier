const emailService = require('./email');

module.exports.notifyUserAccessRequest = function(userProfile, httpReq) {
  return emailService.sendAccessRequest(userProfile, httpReq);
}

module.exports.notifyUserAccessApproval = function(userProfile, httpReq) {
  return emailService.sendAccessApproval(userProfile, httpReq);
}
module.exports.notifyUserAccessRejection = function(userProfile, httpReq) {
  return emailService.sendAccessRegection(userProfile, httpReq);
}
