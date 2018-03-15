module.exports = {
  notification: {
    accessRequest(supplierName, user, link) {
      return {
        title: `OpusCapita - Benutzerzugriffsanforderung`,
        description: `
          Der Benutzer <strong>${user.firstName} ${user.lastName} (${user.email})</strong> hat den Zugriff auf Ihr Firmenkonto <strong>${supplierName}</strong> beantragt.<br />
          <br />
          Bitte klicken Sie <a href="${link}">hier</a>, um die Anfrage zu genehmigen oder abzulehnen.
        `
      }
    },
    accessApproval(supplierName, link) {
      return {
        title: `OpusCapita - Benutzerzugriff genehmigt`,
        description: `
          Ihre Zugangsanfrage an die Firma <strong>${supplierName}</strong> wurde genehmigt.<br />
          <br />
          Bitte klicken Sie <a href="${link}">hier</a>, um den Zugang zu vervollständigen.
        `
      }
    },
    accessRejection(supplierName) {
      return {
        title: `OpusCapita - Benutzerzugriff genehmigt`,
        description: `Leider wurde Ihre Zugangsanfrage an die Firma <strong>${supplierName}</strong> abgelehnt.`
      }
    }
  }
};
