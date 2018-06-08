const Supplier = {
  'Supplier.Button.add': 'Add',
  'Supplier.Button.edit': 'Edit',
  'Supplier.Button.save': 'save',
  'Supplier.Button.delete': 'Delete',
  'Supplier.Button.view': 'View',
  'Supplier.Button.cancel': 'Cancel',
  'Supplier.Button.close': 'Close',
  'Supplier.Button.yes': 'Yes',
  'Supplier.Button.no': 'No',
  'Supplier.Button.createUser': 'Create User',
  'Supplier.Button.continue': 'Continue',
  'Supplier.Button.request': 'Request',
  'Supplier.Button.access': 'Access',
  'Supplier.Button.requestAccess': 'Request Access',
  'Supplier.Button.approve': 'Approve',
  'Supplier.Button.reject': 'Reject',
  'Supplier.Button.search': 'Search',
  'Supplier.Button.publicProfile': 'View public profile',
  'Supplier.Label.id': 'Company ID',
  'Supplier.Label.parentId': 'Parent Company',
  'Supplier.Label.name': 'Company Name',
  'Supplier.Label.cityOfRegistration': 'City Of Registration',
  'Supplier.Label.homePage': 'Homepage',
  'Supplier.Label.legalForm': 'Legal form',
  'Supplier.Label.foundedOn': 'Founded/\u200bEstablished\u00a0On',
  'Supplier.Label.taxIdNumber': 'Tax identification number',
  'Supplier.Label.dunsNo': 'D-U-N-S-Nr.',
  'Supplier.Label.ovtNo': 'OVT Number',
  'Supplier.Label.commercialRegisterNo': 'Company Registration Number',
  'Supplier.Label.countryOfRegistration': 'Country Of Registration',
  'Supplier.Label.currencyId': 'Default Currency',
  'Supplier.Label.taxIdentificationNo': 'Tax Identification Number',
  'Supplier.Label.vatIdentificationNo': 'VAT Identification Number',
  'Supplier.Label.globalLocationNo': 'Global Location Number',
  'Supplier.Label.subEntityCode': 'Sub Entity Code',
  'Supplier.Label.iban': 'IBAN',
  'Supplier.Label.accessReason': 'Access Reason',
  'Supplier.Label.searchInput': 'Search by name, city, VAT id, Tax id, registration number, DUNS number, or Global Location Number',
  'Supplier.Label.capability': 'Capability',
  'Supplier.Title.company': 'Company',
  'Supplier.Title.companyIdentifiers': 'Company Identifiers',
  'Supplier.Title.addresses': 'Adresses',
  'Supplier.Title.type': 'Type',
  'Supplier.Select.type': 'Select type...',
  'Supplier.Select.country': 'Select country...',
  'Supplier.Select.department': 'Select department...',
  'Supplier.Heading.createSupplier': 'Create Supplier',
  'Supplier.Heading.companyRegistration': 'Company Registration',
  'Supplier.Heading.companyInformation': 'Company Information',
  'Supplier.Heading.list': 'Supplier List',
  'Supplier.Heading.address': 'Please add your company addresses here.',
  'Supplier.Heading.accessApproval': 'Please approve or reject user access request.',
  'Supplier.Heading.BankAccount': 'Please enter your bank account details.',
  'Supplier.Heading.contact': 'Please add your company contact persons here.',
  'Supplier.Heading.visibility': 'Please set preferences for your public profile.',
  'Supplier.Confirmation.cancel': 'Do you really want to cancel?',
  'Supplier.Messages.loading': 'Loading...',
  'Supplier.Messages.unableToRender': 'Unable to render editor',
  'Supplier.Messages.createSuccess': 'Supplier successfully created',
  'Supplier.Messages.createFailed': 'Supplier creation failed',
  'Supplier.Messages.updateSaved': 'Data successfully updated',
  'Supplier.Messages.updateFailed': 'Data update failed',
  'Supplier.Messages.failedCreatingExistingSupplier': 'Data saving failed: a company with the same Company Name already exists',
  'Supplier.Messages.failedCreatingUserSupplier': 'Supplier creation failed: you are already associated to a supplier.',
  'Supplier.Messages.identifierRequired': '** Please provide your VAT Registration Number. If you do not have one, then provide your Global Location Number, D-U-N-S number or OVT number.',
  'Supplier.Messages.required': '** Please provide your VAT Registration Number. If you do not have one, then provide your Global Location Number, D-U-N-S number, OVT number or IBAN.',
  'Supplier.Messages.noVatId': 'My Company does not have a VAT Registration Number.',
  'Supplier.Messages.clickCheckBox': 'Please provide your VAT Registration Number.',
  'Supplier.Messages.accessInformation1': 'Here you can request access to company {name}. You should request access only if you are an employee of this company.',
  'Supplier.Messages.accessInformation2': 'Please provide a valid business justification for your access.',
  'Supplier.Messages.accessInformation3': 'Your request will be forwarded to the administrator managing the company\'s profile.',
  'Supplier.Messages.accessInformation4': 'Once the administrator approves your access request, you will receive an email notification to your registered email address.',
  'Supplier.Messages.information1': 'Please provide information that helps us to uniquely identify your company and allows us to add it to our trading partner directory.',
  'Supplier.Messages.information2': 'After providing this information you are ready to login.',
  'Supplier.Error.notUnique': 'Value must be unique',
  'Supplier.Error.notAuthorized': 'You are not authorized to perform this action.',
  'Supplier.AccessRequest.head': 'You have requested access to the company {name}.',
  'Supplier.AccessRequest.text': 'Please reach out to our support at +49 231 3967 350 or customerservice.de@opuscapita.com for further information.',
  'Supplier.AccessRequest.Status.text': 'Current status',
  'Supplier.AccessRequest.Status.requested': 'requested',
  'Supplier.AccessRequest.Status.rejected': 'rejected',
  'Supplier.AccessRequest.Status.approved': 'approved',
  'Supplier.AccessApproval.Label.firstName': 'First Name',
  'Supplier.AccessApproval.Label.lastName': 'Last Name',
  'Supplier.AccessApproval.Label.email': 'Email',
  'Supplier.AccessApproval.Label.date': 'Request Date',
  'Supplier.AccessApproval.Label.comment': 'Justification',
  'Supplier.AccessApproval.Label.status': 'Status',
  'Supplier.AccessApproval.Status.requested': 'Requested',
  'Supplier.AccessApproval.Status.approved': 'Approved',
  'Supplier.AccessApproval.Status.rejected': 'Rejected',
  'Supplier.AccessApproval.Messages.approved': 'User has been successfully approved.',
  'Supplier.AccessApproval.Messages.rejected': 'User has been successfully rejected.',
  'Supplier.AccessApproval.Confirmation.approve': 'Are you sure you want to approve user?',
  'Supplier.AccessApproval.Confirmation.reject': 'Are you sure you want to reject user?',
  'Supplier.Capabilities.name': 'Capabilities',
  'Supplier.Capabilities.Type.eInvoice-send': 'Invoice - send',
  'Supplier.Address.Label.type': 'Type',
  'Supplier.Address.Label.street': 'Street',
  'Supplier.Address.Label.zipCode': 'Zip code',
  'Supplier.Address.Label.city': 'City',
  'Supplier.Address.Label.countryId': 'Country',
  'Supplier.Address.Label.phoneNo': 'Telephone',
  'Supplier.Address.Label.faxNo': 'Fax',
  'Supplier.Address.Label.name': 'Name',
  'Supplier.Address.Label.street1': 'Street',
  'Supplier.Address.Label.street2': 'Street 2',
  'Supplier.Address.Label.street3': 'Street 3',
  'Supplier.Address.Label.areaCode': 'Area Code',
  'Supplier.Address.Label.state': 'State',
  'Supplier.Address.Label.pobox': 'PO Box',
  'Supplier.Address.Label.poboxZipCode': 'PO Box Zip Code',
  'Supplier.Address.Label.email': 'Email',
  'Supplier.Address.Type.default': 'Default',
  'Supplier.Address.Type.invoice': 'Invoice',
  'Supplier.Address.Type.rma': 'RMA',
  'Supplier.Address.Type.plant': 'Factory',
  'Supplier.Address.Confirmation.delete': 'Do you really want to delete this address?',
  'Supplier.Address.Messages.deleted': 'Address successfully deleted.',
  'Supplier.Address.Messages.updated': 'Address successfully updated.',
  'Supplier.Address.Messages.saved': 'Address successfully saved.',
  'Supplier.BankAccount.Confirmation.delete': 'Do you really want to delete this bank account?',
  'Supplier.BankAccount.Label.accountNumber': 'IBAN',
  'Supplier.BankAccount.Label.bankIdentificationCode': 'BIC',
  'Supplier.BankAccount.Label.bankCountryKey': 'Bank Country',
  'Supplier.BankAccount.Label.bankCode': 'Bank Code',
  'Supplier.BankAccount.Label.bankName': 'Bank Name',
  'Supplier.BankAccount.Label.extBankControlKey': 'External Bank Control',
  'Supplier.BankAccount.Label.swiftCode': 'Swift Code',
  'Supplier.BankAccount.Message.deleted': 'Bank account successfully deleted.',
  'Supplier.BankAccount.Message.updated': 'Bank account successfully updated.',
  'Supplier.BankAccount.Message.saved': 'Bank account successfully saved.',
  'Supplier.BankAccount.Message.deleteFailed': 'Failed to delete bank account, perhaps it is already in use.',
  'Supplier.BankAccount.Message.saveFailed': 'Bank account save failed.',
  'Supplier.BankAccount.Message.updateFailed': 'Bank account update failed.',
  'Supplier.Contact.Confirmation.delete': 'Do you really want to delete this contact?',
  'Supplier.Contact.Confirmation.linkedToUser': 'Only the contact will be deleted. User will not be deleted.',
  'Supplier.Contact.Confirmation.createUser': 'Do you really want to create user?',
  'Supplier.Contact.Type.Default': 'Default',
  'Supplier.Contact.Type.Sales': 'Sales',
  'Supplier.Contact.Type.Escalation': 'Escalation',
  'Supplier.Contact.Type.Product': 'Product',
  'Supplier.Contact.Type.Technical': 'Technical',
  'Supplier.Contact.Department.Management': 'Management',
  'Supplier.Contact.Department.Logistics': 'Logistics',
  'Supplier.Contact.Department.Sales': 'Sales',
  'Supplier.Contact.Department.Accounting': 'Accounting',
  'Supplier.Contact.Department.Support': 'Support',
  'Supplier.Contact.Department.IT': 'IT',
  'Supplier.Contact.Department.Others': 'Others',
  'Supplier.Contact.Label.contactId': 'Contact ID',
  'Supplier.Contact.Label.contactType': 'Contact Type',
  'Supplier.Contact.Label.firstName': 'First Name',
  'Supplier.Contact.Label.lastName': 'Last Name',
  'Supplier.Contact.Label.email': 'Email',
  'Supplier.Contact.Label.phone': 'Phone',
  'Supplier.Contact.Label.mobile': 'Mobile',
  'Supplier.Contact.Label.department': 'Department',
  'Supplier.Contact.Label.title': 'Salutation',
  'Supplier.Contact.Label.fax': 'Fax',
  'Supplier.Contact.Message.deleted': 'Contact successfully deleted.',
  'Supplier.Contact.Message.updated': 'Contact successfully updated.',
  'Supplier.Contact.Message.saved': 'Contact successfully saved.',
  'Supplier.Contact.Message.deleteFailed': 'Failed to delete contact, perhaps it is already in use.',
  'Supplier.Contact.Message.saveFailed': 'Contact save failed.',
  'Supplier.Contact.Message.updateFailed': 'Contact update failed.',
  'Supplier.Contact.Message.userCreated': 'User successfully created.',
  'Supplier.Contact.Message.userCreateFailed': 'User creation failed.',
  'Supplier.Contact.Error.userExists': 'User already exists.',
  'Supplier.Visibility.Message.updateSaved': 'Changes successfully saved.'
}

export default Supplier;
