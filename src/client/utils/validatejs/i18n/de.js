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
    iban: {},
    bic: {},
    swiftCode: {}
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
validatejs.invalid.iban.message = "Der Wert ist kein gültiger IBAN";
validatejs.invalid.bic.message = "Der Wert ist kein gültiger BIC";
validatejs.invalid.swiftCode.message = "Der Wert ist kein gültiger SWIFT-Code";

validatejs.typeMismatch.java.net.URL = "Die Wert muss eine g\u00fcltige URL sein";
validatejs.typeMismatch.java.net.URI = "Die Wert muss eine g\u00fcltige URI sein";
validatejs.typeMismatch.java.util.Date = "Die Wert muss ein g\u00fcltiges Datum sein";
validatejs.typeMismatch.java.lang.Double = "Die Wert muss eine g\u00fcltige Zahl sein";
validatejs.typeMismatch.java.lang.Integer = "Die Wert muss eine g\u00fcltige Zahl sein";
validatejs.typeMismatch.java.lang.Long = "Die Wert muss eine g\u00fcltige Zahl sein";
validatejs.typeMismatch.java.lang.Short = "Die Wert muss eine g\u00fcltige Zahl sein";
validatejs.typeMismatch.java.math.BigDecimal = "Die Wert muss eine g\u00fcltige Zahl sein";
validatejs.typeMismatch.java.math.BigInteger = "Die Wert muss eine g\u00fcltige Zahl sein";

export default {
  validatejs,
};
