let SupplierApproval = {
  Label: {
    firstName: 'Vorname',
    lastName: 'Nachname',
    email: 'E-Mail',
    date: 'Anforderungsdatum',
    comment: 'Begründung',
    status: 'Status'
  },
  Button: {
    approve: 'Genehmigen',
    reject: 'Ablehnen',
    yes: 'Ja',
    no: 'Nein'
  },
  Status: {
    requested: 'Angefordert',
    approved: 'Genehmigt',
    rejected: 'Abgelehnt'
  },
  Message: {
    confirmApproval: 'Möchten Sie den Benutzer wirklich genehmigen?',
    rejectApproval: 'Möchten Sie den Benutzer wirklich ablehnen?'
  },
  Notification: {
    success: {
      approved: 'Benutzer wurde erfolgreich genehmigt.',
      rejected: 'Benutzer wurde erfolgreich abgelehnt.'
    },
    error: {}
  }
};

export default {
  SupplierApproval: SupplierApproval
};
