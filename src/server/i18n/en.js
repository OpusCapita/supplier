module.exports = {
  notification: {
    accessRequest(supplierName, user, link) {
      return {
        title: `OpusCapita - User Access Request`,
        description: `
          The user <strong>${user.firstName} ${user.lastName} (${user.email})</strong> has requested access to your company account <strong>${supplierName}</strong>.<br />
          <br />
          Please click this <a href="${link}">link</a> to view details of the request.
        `
      }
    },
    accessApproval(supplierName, link) {
      return {
        title: `OpusCapita - User Access Approved`,
        description: `
          Your access request to company <strong>${supplierName}</strong> has been approved.<br />
          <br />
          Please click this <a href="${link}">link</a> below to complete access.
        `
      }
    },
    accessRejection(supplierName) {
      return {
        title: `OpusCapita - User Access Regected`,
        description: `Unfortunately your access request to company <strong>${supplierName}</strong> has been rejected.`
      }
    },
  }
};
