import React, { PropTypes, Component } from 'react';
import { Supplier } from '../../api';
import { Async } from '@opuscapita/react-select';
import translations from '../../i18n';

let getOption = function(supplier) {
  if (!supplier) return null;

  return { label: supplier.name, value: supplier.id };
};

export default class SupplierAutocomplete extends Component {
  constructor(props) {
    super(props);
    this.supplierApi = new Supplier();

    this.state = { value: getOption(props.value), suppliers: [] };
  }

  static propTypes = {
    disabled: PropTypes.bool,
    value: PropTypes.object,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFilter : PropTypes.func.isRequired
  };

  static defaultProps = { value: null, disabled: false, onFilter: (val) => val  };

  static contextTypes = {
    i18n: React.PropTypes.object.isRequired
  };

  componentWillMount() {
    this.context.i18n.register('Supplier', translations);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextContext.i18n) nextContext.i18n.register('Supplier', translations);

    this.setState({ value: getOption(nextProps.value) });
  }

  onChange = (option) => {
    const supplier = this.state.suppliers.find(sup => sup.id === option.value);
    if (this.props.onChange) this.props.onChange(supplier);

    this.setState({ value: option });
  };

  filterSuppliers = async inputValue => {
    const search = inputValue ? { name: inputValue } : {};
    const suppliers = await this.supplierApi.getSuppliers(search);

    await this.setState({ suppliers })

    return suppliers.filter(this.props.onFilter).map(sup => getOption(sup)).filter(option => {
      return option.label.toLowerCase().includes(inputValue.toLowerCase());
    });
  }

  promiseOptions = inputValue => this.filterSuppliers(inputValue);

  render() {
    return (
      <Async
        loadOptions={this.promiseOptions}
        value={this.state.value}
        isDisabled={this.props.disabled}
        onChange={this.onChange}
        onBlur={this.props.onBlur}
        placeholder={this.context.i18n.getMessage("Supplier.Autocomplete.placeholder")}
        noOptionsMessage={() => this.context.i18n.getMessage("Supplier.Autocomplete.noResultsText")}
        loadingMessage={() => this.context.i18n.getMessage("Supplier.Autocomplete.loadingPlaceholder")}
      />
    );
  }
}
