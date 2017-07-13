import React, { PropTypes, Component } from 'react';

class SupplierExistsView extends Component {
  static propTypes = {
    i18n: PropTypes.object.isRequired,
    onBack: PropTypes.func
  };

  handleClick = () => {
    this.props.onBack();
  }

  render() {
    return (
      <div class="jumbotron">
        <h3>{this.props.i18n.getMessage('SupplierRegistrationEditor.Messages.supplierExistsHeader')}</h3>
        <p>{this.props.i18n.getMessage('SupplierRegistrationEditor.Messages.supplierExistsText')}</p>
        <button className="btn btn-default" onClick={ this.handleClick }>
          {this.props.i18n.getMessage('SupplierRegistrationEditor.ButtonLabel.back')}
        </button>
      </div>
    );
  }
}

export default SupplierExistsView;
