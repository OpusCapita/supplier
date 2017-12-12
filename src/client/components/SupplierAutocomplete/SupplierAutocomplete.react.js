import React, { PropTypes, Component } from 'react';
import { Supplier } from '../../api';
import { ReferenceAutocomplete } from '@opuscapita/react-reference-select';

export default class SupplierAutocomplete extends Component {
  constructor(props) {
    super(props);
    this.supplierApi = new Supplier();
  }

  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
    onBlur: PropTypes.func
  };

  static defaultProps = { value: null };

  render() {
    return (
      <ReferenceAutocomplete
        autocompleteAction={(input) => {
          const search = input ? { supplierName: input } : {}
          return this.supplierApi.getSuppliers(search).then(suppliers => {
            return new Promise((resolve) => resolve({ options: suppliers, complete: false }));
          });
        }}
        value={this.props.value}
        labelProperty='supplierName'
        valueProperty='supplierId'
        onChange={this.props.onChange}
        onBlur={this.props.onBlur}
      />
    );
  }
}
