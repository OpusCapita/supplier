let ButtonLabel = { continue: 'Continue', cancel: 'Cancel', request: 'Request', access: 'Access' };

let Select = {};
Select.country = 'Select country...';

let Label = {
  supplierName: {},
  supplierId: {},
  homePage: {},
  role: {},
  buying: {},
  selling: {},
  foundedOn: {},
  legalForm: {},
  commercialRegisterNo: {},
  cityOfRegistration: {},
  countryOfRegistration: {},
  taxIdentificationNo: {},
  vatIdentificationNo: {},
  dunsNo: {},
  globalLocationNo: {},
  isNewSupplier: {},
  supplier: {},
  accessReason: {}
};
Label.supplierName.label = 'Company Name';
Label.supplierId.label = 'Company ID';
Label.homePage.label = 'Home Page';
Label.role.label = 'Role';
Label.buying.label = 'Buying';
Label.selling.label = 'Selling';
Label.foundedOn.label = 'Founded/\u200bEstablished\u00a0On';
Label.legalForm.label = 'Legal Form';
Label.commercialRegisterNo.label = 'Company Registration Number';
Label.cityOfRegistration.label = 'City Of Registration';
Label.countryOfRegistration.label = 'Country Of Registration';
Label.taxIdentificationNo.label = 'Tax Identification Number';
Label.vatIdentificationNo.label = 'VAT Registration Number';
Label.dunsNo.label = 'D-U-N-S Number';
Label.globalLocationNo.label = 'Global Location Number';
Label.isNewSupplier.label = 'Select existing company';
Label.supplier.label = 'Company';
Label.accessReason.label = 'Access Reason';

let SupplierRegistrationEditor = {};
SupplierRegistrationEditor.created = 'Information on this page was initially created by {by} on {on}.';
SupplierRegistrationEditor.changed = 'Information on this page was last updated on {on} by {by}.';

const Messages = {};
Messages.supplierAccessRequestStatus = {};
Messages.companyRegistration = 'Company Registration';
Messages.loading = 'Loading...';
Messages.unableToRender = 'Unable to render editor';
Messages.saved = 'Data is successfully saved';
Messages.failed = 'Supplier creation failed.';
Messages.failedUnauthorized = 'Supplier creation failed: not authorized.';
Messages.supplierAccessRequestHeader = 'You have requested access to the company {name}.';
Messages.supplierAccessRequestText = 'Please reach out to our support at +49 231 3967 350 or customerservice.de@opuscapita.com for further information.';
Messages.supplierAccessRequestStatus.text = 'Current status';
Messages.supplierAccessRequestStatus.requested = 'requested';
Messages.supplierAccessRequestStatus.rejected = 'rejected';
Messages.supplierAccessRequestStatus.approved = 'approved';
Messages.information1 = 'Please provide information that helps us to uniquely identify your company and allows us to add it to our trading partner directory.';
Messages.information2 = 'After providing this information you are ready to login.';
Messages.requestSupplierAccess = 'Request Access';
Messages.required = '** Please provide your VAT Registration Number. If you do not have one, then provide your Global Location Number or D-U-N-S number.';
Messages.noVatId = 'My Company does not have a VAT Registration Number.';
Messages.clickCheckBox = 'Please provide your VAT Registration Number.';
Messages.accessInformation1 = 'Here you can request access to company {name}. You should request access only if you are an employee of this company.';
Messages.accessInformation2 = 'Please provide a valid business justification for your access.';
Messages.accessInformation3 = 'Your request will be forwarded to the administrator managing the company\'s profile.';
Messages.accessInformation4 = 'Once the administrator approves your access request, you will receive an email notification to your registered email address.';

export default {
  SupplierRegistrationEditor: {
    ButtonLabel: ButtonLabel,
    Select: Select,
    SupplierRegistrationEditor: SupplierRegistrationEditor,
    Label: Label,
    Messages,
  },
};
