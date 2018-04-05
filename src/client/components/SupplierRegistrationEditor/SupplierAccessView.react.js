import React, { PropTypes, Component } from 'react';

class SupplierAccessView extends Component {
  static propTypes = {
    supplierAccess: PropTypes.object.isRequired,
    supplier: PropTypes.object.isRequired,
    onAccessConfirm: PropTypes.func.isRequired
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired
  };

  handleOnClick(event) {
    event.preventDefault();
    this.props.onAccessConfirm();
  }

  renderAccessInformation() {
    if (this.props.supplierAccess.status !== 'requested') return null;

    return <p>{this.context.i18n.getMessage('Supplier.Messages.accessInformation4')}</p>
  }

  renderAccessLink() {
    if (this.props.supplierAccess.status !== 'approved') return null;

    return (
      <p>
        <button className="btn btn-default" onClick={this.handleOnClick.bind(this)}>
          {this.context.i18n.getMessage('Supplier.Button.access')}
        </button>
      </p>
    );
  }

  render() {
    const status = this.context.i18n.getMessage(`Supplier.AccessRequest.Status.${this.props.supplierAccess.status}`);
    return (
      <div className="alert alert-info">
        <h5>{this.context.i18n.getMessage('Supplier.AccessRequest.head', { name: this.props.supplier.name })}</h5>
        {this.renderAccessInformation()}
        <p><strong>{this.context.i18n.getMessage('Supplier.AccessRequest.Status.text')}: {status}</strong></p>
        {this.renderAccessLink()}
        <p>{this.context.i18n.getMessage('Supplier.AccessRequest.text')}</p>
      </div>
    );
  }
}

export default SupplierAccessView;
