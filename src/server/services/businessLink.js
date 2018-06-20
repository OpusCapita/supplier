'use strict'

module.exports.allForSupplierId = function(serviceClient, supplierId) {
  return serviceClient.get('business-link', `/api/suppliers/${supplierId}/business-links`, true).spread(businessLinks => businessLinks);
}
