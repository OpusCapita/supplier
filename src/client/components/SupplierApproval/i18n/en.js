let SupplierApproval = {
  Label: {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    date: 'Request Date',
    comment: 'Justification',
    status: 'Status'
  },
  Button: {
    approve: 'Approve',
    reject: 'Reject',
    yes: 'Yes',
    no: 'No'
  },
  Status: {
    requested: 'Requested',
    approved: 'Approved',
    rejected: 'Rejected'
  },
  Message: {
    heading: 'Please approve or reject user access request.',
    confirmApproval: 'Are you sure you want to approve user?',
    rejectApproval: 'Are you sure you want to reject user?'
  },
  Notification: {
    success: {
      approved: 'User has been successfully approved.',
      rejected: 'User has been successfully rejected.'
    },
    error: {}
  }
};

export default {
  SupplierApproval: SupplierApproval
};
