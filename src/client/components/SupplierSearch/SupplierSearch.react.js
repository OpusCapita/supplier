import React, { Component, PropTypes } from 'react';
import locales from './i18n';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Supplier } from '../../api';
import DisplayField from '../DisplayTable/DisplayField.react';
import CountryView from '../CountryView.react';
import ActionButton from '../ActionButton.react';
require('./SupplierSearch.css');

export default class SupplierSearch extends Component {

  constructor(props) {
    super(props);
    this.state = {
      form: { keyword: '' },
      data: []
    };
    this.supplierApi = new Supplier();
  }

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired,
    showNotification: React.PropTypes.func
  };

  componentWillMount(){
    this.context.i18n.register('SupplierSearch', locales);
  }

  componentWillReceiveProps(nextProps, nextContext){
    if(nextContext.i18n) nextContext.i18n.register('SupplierSearch', locales);
  }

  searchSupplier() {
    const queryParam = { search: this.state.form.keyword };
    this.supplierApi.getSuppliers(queryParam).then(data => {
      this.setState({ data: data });
    });
  }

  onKeywordChange(event) {
    this.setState({ form: { keyword: event.target.value } });
  }

  renderSearchBox() {
    return (<div className="form-group search-box">
      <label className="control-label">{this.context.i18n.getMessage('SupplierSearch.searchInput.label')}</label>
      <input value={this.state.form.keyword} onChange={this.onKeywordChange.bind(this)} className="form-control"/>
      <div className="text-right form-submit">
        <ActionButton
          style='primary'
          onClick={this.searchSupplier.bind(this)}
          label={this.context.i18n.getMessage('SupplierSearch.buttonLabel.search')}
        />
      </div>
    </div>)
  }

  renderTable(data) {

    const columns = [
      {
        Header: this.context.i18n.getMessage('SupplierSearch.tableHeader.supplierName'),
        accessor: 'supplierName',
      },
      {
        Header: this.context.i18n.getMessage('SupplierSearch.tableHeader.cityOfRegistration'),
        accessor: 'cityOfRegistration'
      },
      {
        Header: this.context.i18n.getMessage('SupplierSearch.tableHeader.countryOfRegistration'),
        accessor: 'countryOfRegistration',
        Cell: (row) => (<DisplayField><CountryView countryId={row.value}/></DisplayField>)
      },
      {
        Header: this.context.i18n.getMessage('SupplierSearch.tableHeader.commercialRegisterNo'),
        accessor: 'commercialRegisterNo'
      },
      {
        Header: this.context.i18n.getMessage('SupplierSearch.tableHeader.taxIdentificationNo'),
        accessor: 'taxIdentificationNo'
      },
      {
        Header: this.context.i18n.getMessage('SupplierSearch.tableHeader.supplierIdentifiers'),
        accessor: element => ({ vatId: element.vatIdentificationNo, gln: element.globalLocationNo, duns: element.dunsNo }),
        id: 'supplierIdentifiers',
        Cell: row => {
          const keys = Object.keys(row.value);
          return (
            <div>
              {Object.values(row.value).map((identifier, index) => {
                if (!identifier) return null;

                return <div key={index}>
                  <div><strong>{this.context.i18n.getMessage(`SupplierSearch.identifier.${keys[index]}`)}</strong></div>
                  <div>{identifier}</div>
                </div>
              })}
            </div>
          );
        }
      },
      {
        Header: this.context.i18n.getMessage('SupplierSearch.tableHeader.capabilities'),
        accessor: element => element.capabilities ? element.capabilities.join(', ') : element.capabilities,
        id: 'capabilities'
      }];

    return (<ReactTable
      data={data}
      columns={columns}
      defaultPageSize={5}
      className="table"
    />)
  }

  render() {
    return (<div>
      { this.renderSearchBox() }
      <div className="table-responsive">
        { this.renderTable(this.state.data) }
      </div>
    </div>)
  }
}
