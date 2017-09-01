import React, { PropTypes, Component } from 'react';

class SupplierAccessView extends Component {
  static propTypes = {
    supplierAccess: PropTypes.object
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired
  };

  render() {
    return (
      <div className="jumbotron">
        <h4>{this.context.i18n.getMessage('SupplierRegistrationEditor.Messages.supplierExistsHeader')}</h4>
        <p>{this.context.i18n.getMessage('SupplierRegistrationEditor.Messages.supplierExistsText')}</p>
        <p>{'Current Status: '} <span>{this.props.supplierAccess.status}</span></p>
      </div>
    );
  }
}

export default SupplierAccessView;
