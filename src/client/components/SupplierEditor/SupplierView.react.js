import React, { Component, PropTypes } from 'react';
import SupplierViewRow from '../AttributeValueEditorRow.react.js';

export default class SupplierView extends Component {
  static propTypes = {
    supplier: PropTypes.string.isRequired
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired
  };

  renderField = (fieldName) => {
    const { supplier } = this.props;
    let value = supplier[fieldName];

    if (fieldName == 'foundedOn') value = new Date(value).toLocaleDateString(this.context.i18n.locale);

    return (
      <SupplierViewRow labelText={ this.context.i18n.getMessage(`SupplierEditor.Label.${fieldName}.label`) }>
        <p style={ { marginTop: '7px' } }>{ value || '-' }</p>
      </SupplierViewRow>
    );
  };

  render() {
    return (
      <div className="form-horizontal">
        { this.renderField('supplierName') }
        { this.renderField('homePage') }
        { this.renderField('foundedOn') }
        { this.renderField('legalForm') }
        { this.renderField('commercialRegisterNo') }
        { this.renderField('cityOfRegistration') }
        { this.renderField('countryOfRegistration')}
        { this.renderField('taxIdentificationNo') }
        { this.renderField('vatIdentificationNo') }
        { this.renderField('globalLocationNo') }
        { this.renderField('dunsNo') }
      </div>
    );
  }
};
