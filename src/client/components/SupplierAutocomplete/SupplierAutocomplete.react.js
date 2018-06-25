import React, { PropTypes, Component } from 'react';
import { Supplier } from '../../api';
import Select from '@opuscapita/react-select';
import translations from '../../i18n';

export default class SupplierAutocomplete extends Component {
  constructor(props) {
    super(props);
    this.supplierApi = new Supplier();
    this.labelProperty = 'name';
    this.valueProperty = 'id';

    this.state = { value: props.value };
  }

  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.object,
    onChange: PropTypes.func,
    onBlur: PropTypes.func
  };

  static defaultProps = { value: null, disabled: false  };

  static contextTypes = {
    i18n: React.PropTypes.object.isRequired
  };

  componentWillMount() {
    this.context.i18n.register('Supplier', translations);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextContext.i18n) nextContext.i18n.register('Supplier', translations);
  }

  onChange = (value) => {
    if (this.props.onChange) this.props.onChange(value);

    this.setState({ value: value });
  };

  render() {
    return (
      <Select.Async
        loadOptions={(input) => {
          const search = input ? { name: input } : {}
          return this.supplierApi.getSuppliers(search).then(suppliers => {
            return new Promise((resolve) => resolve({ options: suppliers, complete: false }));
          });
        }}
        filterOption={(option, filterString) => {
          if (filterString) {
            let labelTest = String(option[this.labelProperty]);
            return labelTest.toLowerCase().indexOf(filterString.toLowerCase()) !== -1;
          }
          return true;
        }}
        value={this.state.value}
        disabled={this.props.disabled}
        cache={{}}
        name={this.props.name}
        multi={false}
        matchProp='label'
        ignoreCase={false}
        labelKey={this.labelProperty}
        valueKey={this.valueProperty}
        onChange={this.onChange}
        onBlur={this.props.onBlur}
        noResultsText={this.context.i18n.getMessage("Supplier.Autocomplete.noResultsText")}
        placeholder={this.context.i18n.getMessage("Supplier.Autocomplete.placeholder")}
        loadingPlaceholder={this.context.i18n.getMessage("Supplier.Autocomplete.loadingPlaceholder")}
      />
    );
  }
}
