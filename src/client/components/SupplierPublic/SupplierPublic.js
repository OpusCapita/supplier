import React, { Component, PropTypes } from 'react';

export default class SupplierContactView extends Component {
  
  static propTypes = {
    supplierId: PropTypes.string.isRequired
  };
  
  render() {
    return (
      <div className="form-horizontal">
        <div>Example</div>
      </div>
    );
  }
};
