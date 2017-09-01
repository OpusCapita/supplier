const validatejs = {
  doesnt: {
    match: {},
  },
  invalid: {
    url: {},
    creditCard: {},
    email: {},
    range: {},
    size: {},
    max: {},
    min: {},
    maxOrEqual: {},
    minOrEqual: {},
    maxSize: {},
    minSize: {},
    validator: {},
    vatNumber: {},
    dunsNumber: {},
    globalLocationNumber: {},
    iban: {},
    bic: {},
    swiftCode: {},
    uniqueIdentifier: {}
  },
  not: {
    inlist: {},
    equal: {},
    unique: {},
  },
  blank: {},
  'null': {},
  typeMismatch: {
    java: {
      net: {},
      util: {},
      lang: {},
      math: {},
    },
  },
  duplicate: {
    registerationNumber: {},
    taxIdNumber: {},
    vatNumber: {},
    dunsNumber: {},
    globalLocationNumber: {}
  }
};

validatejs.doesnt.match.message = "Der Wert entspricht nicht dem vorgegebenen Muster '{limit}'";
validatejs.invalid.url.message = "Dies ist keine g\u00fcltige URL";
validatejs.invalid.creditCard.message = "Dies ist keine g\u00fcltige Kreditkartennummer";
validatejs.invalid.email.message = "Dies ist keine g\u00fcltige E-Mail Adresse";
validatejs.invalid.range.message = "Der Wert ist nicht im Wertebereich von ''{from}'' bis ''{to}''";
validatejs.invalid.size.message = "Der Wert ist nicht im Gr\u00f6\u00dfenbereich von ''{from}'' bis ''{to}''";
validatejs.invalid.max.message = "Der Wert ist gr\u00f6\u00dfer als der H\u00f6chstwert von '{limit}'";
validatejs.invalid.min.message = "Der Wert ist kleiner als der Mindestwert von '{limit}'";
validatejs.invalid.maxOrEqual.message = "Der Wert muss kleiner als oder gleich dem Maximalwert '{limit}' sein";
validatejs.invalid.minOrEqual.message = "Der Wert muss größer als oder gleich dem Minimalwert '{limit}' sein";
validatejs.invalid.maxSize.message = "Der Wert \u00fcbersteigt den H\u00f6chstwert von '{limit}'";
validatejs.invalid.minSize.message = "Der Wert unterschreitet den Mindestwert von '{limit}'";
validatejs.invalid.validator.message = "Der Wert ist ung\u00fcltig";
validatejs.not.inlist.message = "Der Wert ist nicht in der Liste ''{limit}'' enthalten";
validatejs.blank.message = "Das Feld darf nicht leer sein";
validatejs.not.equal.message = "Der Wert darf nicht gleich ''{limit}'' sein";
validatejs.null.message = "Die Eigenschaft darf nicht null sein";
validatejs.not.unique.message = "Der Wert muss eindeutig sein";
validatejs.invalid.vatNumber.message = "Der Wert ist keine gültige EU-Umsatzsteuer-Identifikationsnummer";
validatejs.invalid.dunsNumber.message = "Der Wert ist keine gültige D-U-N-S Nummer";
validatejs.invalid.globalLocationNumber.message = "Der Wert ist keine gültige Global Location Number";
validatejs.invalid.iban.message = "Der Wert ist kein gültiger IBAN";
validatejs.invalid.bic.message = "Der Wert ist kein gültiger BIC";
validatejs.invalid.swiftCode.message = "Der Wert ist kein gültiger SWIFT-Code";
validatejs.invalid.uniqueIdentifier.message = "Die Umsatzsteuer-Identifikationsnummer, die D-U-N-S-Nummer oder die Global Location Number muss angegeben werden";
validatejs.duplicate.registerationNumber.message = "Ein Unternehmen existiert bereits mit dieser Handelsregisternummer, der Stadt und dem Land.";
validatejs.duplicate.taxIdNumber.message = "Ein Unternehmen existiert bereits mit dieser Steueridentifikationsnummer und dem Land.";
validatejs.duplicate.vatNumber.message = "Ein Unternehmen existiert bereits mit dieser Umsatzsteuer-Identifikationsnummer.";
validatejs.duplicate.dunsNumber.message = "Ein Unternehmen existiert bereits mit dieser D-U-N-S-Nummer.";
validatejs.duplicate.globalLocationNumber.message = "Ein Unternehmen existiert bereits mit dieser Global Location Number.";

validatejs.typeMismatch.java.net.URL = "Die Wert muss eine g\u00fcltige URL sein";
validatejs.typeMismatch.java.net.URI = "Die Wert muss eine g\u00fcltige URI sein";
validatejs.typeMismatch.java.util.Date = "Die Wert muss ein g\u00fcltiges Datum sein";
validatejs.typeMismatch.java.lang.Double = "Die Wert muss eine g\u00fcltige Zahl sein";
validatejs.typeMismatch.java.lang.Integer = "Die Wert muss eine g\u00fcltige Zahl sein";
validatejs.typeMismatch.java.lang.Long = "Die Wert muss eine g\u00fcltige Zahl sein";
validatejs.typeMismatch.java.lang.Short = "Die Wert muss eine g\u00fcltige Zahl sein";
validatejs.typeMismatch.java.math.BigDecimal = "Die Wert muss eine g\u00fcltige Zahl sein";
validatejs.typeMismatch.java.math.BigInteger = "Die Wert muss eine g\u00fcltige Zahl sein";

validatejs.supplierExists = "{message}\nBitte kontaktieren Sie unseren Support via +49 231 3967 350 oder customerservice.de@opuscapita.com, um einen Zugang zu diesem Unternehmen anzufordern."

export default {
  validatejs,
};
