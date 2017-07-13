let ButtonLabel = { continue: 'Weiter', cancel: 'Abbrechen', back: 'Zurück' };

let Select = {};
Select.country = 'Bitte ein Land auswählen ...';

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
  supplier: {}
};
Label.supplierName.label = 'Name des Unternehmens';
Label.supplierId.label = 'Firmen-ID';
Label.homePage.label = 'Homepage';
Label.role.label = 'Rolle';
Label.buying.label = 'Kauf';
Label.selling.label = 'Verkauf';
Label.foundedOn.label = 'Datum der Firmengründung';
Label.legalForm.label = 'Rechtform des Unternehmens';
Label.commercialRegisterNo.label = 'Handelsregisternummer';
Label.cityOfRegistration.label = 'Ort der Registrierung';
Label.countryOfRegistration.label = 'Land der Registrierung';
Label.taxIdentificationNo.label = 'Steuernummer';
Label.vatIdentificationNo.label = 'Umsatzsteuer-Ident-Nr.';
Label.dunsNo.label = 'D-U-N-S-Nr.';
Label.globalLocationNo.label = 'Global Location Number (GLN/ILN)';
Label.isNewSupplier.label = 'Existierenden Lieferanten auswählen';
Label.supplier.label = 'Lieferant';

let SupplierRegistrationEditor = {};
SupplierRegistrationEditor.created = 'Die Informationen auf diesem Reiter wurden erstmalig durch {by} am {on} erstellt.';
SupplierRegistrationEditor.changed = 'Die Informationen wurden zuletzt am {on} durch {by} bearbeitet.';

const Messages = {};
Messages.companyRegistration = 'Unternehmensregistrierung';
Messages.loading = 'Laden...';
Messages.unableToRender = 'Der Editor kann nicht geöffnet werden';
Messages.saved = 'Die Daten wurden erfolgreich gespeichert';
Messages.failed = 'Lieferantenerstellung fehlgeschlagen.';
Messages.failedUnauthorized = 'Lieferantenerstellung fehlgeschlagen: nicht autorisiert.';
Messages.supplierExistsHeader = 'Lieferant bereits vorhanden';
Messages.supplierExistsText = 'Scheinbar wurde Ihr Unternehmen bereits registriert. Bitte kontaktieren Sie unseren Support via +49 231 3967 0 or customerservice.de@opuscapita.com, um einen Zugang zu diesem Unternehmen anzufordern.';
Messages.information1 = 'Bitte geben Sie Informationen an, die uns helfen, Ihr Unternehmen eindeutig zu identifizieren und uns zu unserem Handelspartnerverzeichnis hinzuzufügen.';
Messages.information2 = 'Nach der Bereitstellung dieser Informationen können Sie sich anmelden.';

export default {
  SupplierRegistrationEditor: {
    ButtonLabel: ButtonLabel,
    Select: Select,
    SupplierRegistrationEditor: SupplierRegistrationEditor,
    Label: Label,
    Messages,
  },
};
