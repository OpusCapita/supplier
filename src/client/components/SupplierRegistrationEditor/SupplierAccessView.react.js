import React, { PropTypes, Component } from 'react';

class SupplierAccessView extends Component {
  static propTypes = {
    supplierAccess: PropTypes.object,
    supplier: PropTypes.object
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired
  };

  render() {
    const status = this.context.i18n.getMessage(`SupplierRegistrationEditor.Messages.supplierAccessRequestStatus.${this.props.supplierAccess.status}`);
    return (
      <div className="alert alert-info">
        <h5>{this.context.i18n.getMessage('SupplierRegistrationEditor.Messages.supplierAccessRequestHeader', { name: this.props.supplier.supplierName })}</h5>
        <p><strong>{this.context.i18n.getMessage('SupplierRegistrationEditor.Messages.supplierAccessRequestStatus.text')}: {status}</strong></p>
        <p>{this.context.i18n.getMessage('SupplierRegistrationEditor.Messages.supplierAccessRequestText')}</p>
      </div>
    );
  }
}

export default SupplierAccessView;
