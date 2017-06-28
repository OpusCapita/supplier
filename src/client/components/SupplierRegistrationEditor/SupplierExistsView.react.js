import React, { PropTypes, Component } from 'react';

class SupplierExistsView extends Component {
  static propTypes = {
    onBack: React.PropTypes.func
  };

  handleClick = () => {
    this.props.onBack();
  }

  render() {
    return (
      <div class="jumbotron">
        <h3>Supplier already exist</h3>
        <p>Still to be decided what to do here</p>
        <button className="btn btn-default" onClick={ this.handleClick }>Back To Form</button>
      </div>
    );
  }
}

export default SupplierExistsView;
