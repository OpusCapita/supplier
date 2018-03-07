import React, { Component, PropTypes } from 'react';
import SupplierViewRow from '../AttributeValueEditorRow.react.js';
import CountryView from '../CountryView.react';
import dateHelper from '../../utils/dateHelper';

export default class SupplierView extends Component {
  static propTypes = {
    supplier: PropTypes.object.isRequired
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired
  };

  renderField = (attrs) => {
    const { supplier } = this.props;
    const fieldName = attrs.fieldName;
    let value = supplier[fieldName];

    if (fieldName == 'foundedOn') value = dateHelper.format(value, this.context.i18n.locale);

    return (
      <SupplierViewRow labelText={ this.context.i18n.getMessage(`SupplierEditor.Label.${fieldName}.label`) }>
        <p style={ { marginTop: '7px' } }>{ attrs.component || value || '-' }</p>
      </SupplierViewRow>
    );
  };

  render() {
    return (
      <div className="form-horizontal">
        { this.renderField({ fieldName: 'name' }) }
        { this.renderField({ fieldName: 'homePage' }) }
        { this.renderField({ fieldName: 'foundedOn' }) }
        { this.renderField({ fieldName: 'legalForm' }) }
        { this.renderField({ fieldName: 'commercialRegisterNo' }) }
        { this.renderField({ fieldName: 'cityOfRegistration' })}
        { this.renderField({
          fieldName: 'countryOfRegistration',
          component: <CountryView countryId={this.props.supplier.countryOfRegistration} />
        }) }
        { this.renderField({ fieldName: 'taxIdentificationNo' }) }
        { this.renderField({ fieldName: 'vatIdentificationNo' }) }
        { this.renderField({ fieldName: 'globalLocationNo' }) }
        { this.renderField({ fieldName: 'dunsNo' }) }
      </div>
    );
  }
};
