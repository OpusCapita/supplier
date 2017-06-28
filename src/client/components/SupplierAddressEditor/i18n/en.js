// Confirmation dialogs
let Confirmation = {};
Confirmation.cancel = 'Do you really want to cancel?';
Confirmation.delete = "Do you really want to delete this address?";

let Button = {};
Button.add = 'Add';
Button.edit = ' Edit';
Button.view = ' View';
Button.delete = ' Delete';
Button.attach = 'Attach';
Button.save = 'Save';
Button.cancel = 'Cancel';
Button.close = 'Close';

let Label = {
  address: {}
};
Label.type = 'Type';
Label.street = 'Street';
Label.zipCode = 'Zip code';
Label.city = 'City';
Label.countryId = 'Country';
Label.phoneNo = 'Telephone';
Label.faxNo = 'Telefax';
Label.salutation = 'Salutation';
Label.name1 = 'Name 1';
Label.name2 = 'Name 2';
Label.name3 = 'Name 3';
Label.areaCode = 'Area Code';
Label.state = 'State';
Label.pobox = 'PO Box';
Label.poboxZipCode = 'PO Box Zip Code';
Label.email = 'Email';

let Title = 'Please add your company addresses here.';

let Message = {
  objectDeleted: 'Object deleted.',
  objectUpdated: 'Object updated.',
  objectSaved: 'Object saved.',
  deleteFailed: 'Failed to delete object, perhaps it is already in use.',
  saveFailed: 'Object save failed.',
  updateFailed: 'Object update failed.'
};

let Select = {};
Select.type = 'Select type...';
Select.country = 'Select country...';

let AddressInfo = {};
AddressInfo.created = 'Information on this page was initially created by {by} on {on}.';
AddressInfo.changed = 'Information on this page was last updated on {on} by {by}.';

let AddressType = {};
AddressType.default = 'Default Company Address';
AddressType.invoice = 'Invoice Address';
AddressType.rma = 'RMA Address';
AddressType.plant = 'Factory Address';

export default {
  SupplierAddressEditor: {
    Confirmation: Confirmation,
    Message: Message,
    Button: Button,
    Label: Label,
    Title: Title,
    Select: Select,
    AddressInfo: AddressInfo,
    AddressType: AddressType,
  },
};
