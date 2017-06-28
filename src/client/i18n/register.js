import { I18nManager } from 'opuscapita-i18n';
import validationMessages from '../utils/validatejs/i18n';

export default function register(locale, componentName, messages) {
  var i18n = new I18nManager(locale, validationMessages);
  i18n.register(componentName, messages);

  return i18n;
}
