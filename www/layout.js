import React, { PropTypes, Component } from 'react';
import { I18nManager } from '@opuscapita/i18n';

class Layout extends Component
{
  static childContextTypes = {
    i18n: PropTypes.object.isRequired
  };

  getChildContext() {
    const localeFormattingInfo = { 'en': { datePattern: 'dd/MM/yyyy' }, 'de': { datePattern: 'dd.MM.yyyy' } };
    return { i18n: new I18nManager({ locale: 'de', fallbackLocale: 'en', localeFormattingInfo: localeFormattingInfo }) };
  }

  render() {
    return (<div>{this.props.children}</div>);
  }
};

export default Layout;
