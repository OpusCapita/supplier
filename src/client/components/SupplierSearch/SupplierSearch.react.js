import React, { Component, PropTypes } from 'react';
import locales from './i18n';
import SupplierEditorLocales from './../SupplierEditor/i18n';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import request from 'superagent-bluebird-promise';
import DisplayCountryTableField from '../DisplayTable/DisplayCountryTableField.react';
require('./SupplierSearch.css');

export default class SupplierSearch extends Component {

  constructor(props) {
    super(props);
    this.state = {
      form: {
        keyword: '',
      },
      data: []
    }
  }

  static propTypes = {
    actionUrl: React.PropTypes.string.isRequired
  };

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
    const getRequest = request.get(`${this.props.actionUrl}/supplier/api/suppliers?search=${this.state.form.keyword}`);
    let result = getRequest.set('Accept', 'application/json').promise();
    result.then((data) => {
      const oldState = this.state;
      const newState = Object.assign({}, oldState, {
        data: data.body
      });
      this.setState(newState);
    });
  }

  onKeywordChange(event) {
    const oldState = this.state;
    const newState = Object.assign({}, oldState, {
      form: {
        keyword: event.target.value
      },
    });
    this.setState(newState);
  }

  renderSearchBox() {
    return (<div className="form-group search-box">
      <label className="control-label">{this.context.i18n.getMessage('SupplierSearch.label')}</label>
      <input value={this.state.form.keyword} onChange={this.onKeywordChange.bind(this)} className="form-control"/>
      <div className="text-right form-submit">
        <button className="btn btn-primary"
                onClick={this.searchSupplier.bind(this)}>{this.context.i18n.getMessage('SupplierSearch.search')}</button>
      </div>
    </div>)
  }

  renderTable(data) {

    const columns = [
      {
        Header: this.context.i18n.getMessage('SupplierEditor.TableHeader.supplierName'),
        accessor: 'supplierName',
      },
      {
        Header: this.context.i18n.getMessage('SupplierEditor.TableHeader.countryOfRegistration'),
        accessor: 'countryOfRegistration',
        Cell: (row) => (<DisplayCountryTableField countryId={row.value} actionUrl={this.props.actionUrl} />)
      },
      {
        Header: this.context.i18n.getMessage('SupplierEditor.TableHeader.commercialRegisterNo'),
        accessor: 'commercialRegisterNo'
      }, {
        Header: this.context.i18n.getMessage('SupplierEditor.TableHeader.cityOfRegistration'),
        accessor: 'cityOfRegistration'
      }, {
        Header: this.context.i18n.getMessage('SupplierEditor.TableHeader.taxIdentificationNo'),
        accessor: 'taxIdentificationNo'
      }, {
        Header: this.context.i18n.getMessage('SupplierEditor.TableHeader.vatIdentificationNo'),
        accessor: 'vatIdentificationNo'
      }, {
        Header: this.context.i18n.getMessage('SupplierEditor.TableHeader.globalLocationNo'),
        accessor:'globalLocationNo'
      },{
        Header: this.context.i18n.getMessage('SupplierEditor.TableHeader.dunsNo'),
        accessor:'dunsNo'
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
