const emailService = require('./email');

module.exports.notifyUserAccessRequest = function(userProfile, httpReq) {
  return emailService.sendAccessRequest(userProfile, httpReq);
}
