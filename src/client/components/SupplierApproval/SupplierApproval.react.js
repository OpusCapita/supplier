import React, { Component, PropTypes } from 'react';
import locales from './i18n';
import SupplierEditorLocales from './../SupplierEditor/i18n';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Supplier } from '../../api';
import DisplayField from '../DisplayTable/DisplayField.react';
import CountryView from '../CountryView.react';
require('./SupplierApproval.css');

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
    this.context.i18n.register('SupplierEditorLocales', SupplierEditorLocales);
    this.context.i18n.register('SupplierSearch', locales);
  }

  componentWillReceiveProps(nextProps, nextContext){
    if(nextContext.i18n){
      nextContext.i18n.register('SupplierEditorLocales', SupplierEditorLocales);
      nextContext.i18n.register('SupplierSearch', locales);
    }
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

  renderTable(data) {

    const columns = [
      {
        Header: 'First Name',
        accessor: 'supplierName',
      },
      {
        Header: 'Last Name',
        accessor: 'countryOfRegistration',
        Cell: (row) => (<DisplayField><CountryView countryId={row.value}/></DisplayField>)
      },
      {
        Header: 'Email',
        accessor: 'commercialRegisterNo'
      }, {
        Header: 'Date',
        accessor: 'cityOfRegistration'
      }, {
        Header: 'Status',
        accessor: 'taxIdentificationNo'
      }, {
        Header: 'Comment',
        accessor: 'vatIdentificationNo'
      }, {
        Header: 'Actions',
        accessor:'globalLocationNo'
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
      <div className="table-responsive">
        { this.renderTable(this.state.data) }
      </div>
    </div>)
  }
}
