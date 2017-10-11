import React, { Component, PropTypes } from 'react';
import SupplierEditorLocales from './../SupplierEditor/i18n';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import request from 'superagent-bluebird-promise';
import SupplierConstraints from '../../utils/validatejs/supplierConstraints';
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
    this.constraints = new SupplierConstraints(this.context.i18n);
    this.context.i18n.register('SupplierEditorLocales', SupplierEditorLocales);
  }

  searchSupplier() {
    const getRequest = request.get(`${this.props.actionUrl}/supplier/api/suppliers`);
    let result = getRequest.set('Accept', 'application/json').promise();
    result.then((data) => {
      const oldState = this.state;
      const newState = Object.assign({}, oldState, {
        form: {
          keyword: this.refs.keyword.value
        },
        data: data.body
      });
      this.setState(newState);
    });
  }

  filter(keyword, data) {
    return data.filter((element) => {
      return this.safeInclude(element.supplierName, keyword) ||
             this.safeInclude(element.cityOfRegistration, keyword) ||
             this.safeInclude(element.globalLocationNo, keyword) ||
             this.safeInclude(element.taxIdentificationNo, keyword) ||
             this.safeInclude(element.commercialRegisterNo, keyword) ;
    });
  }

  safeInclude(string, substr) {
    return string ? string.match(substr) : false;
  }

  renderSearchBox() {
    return (<div className="form-group search-box">
      <label className="col-xs-12 col-sm-6 col-md-4 control-label">Search by</label>
      <input className="form-control" ref='keyword'/>
      <div className="text-right form-submit">
        <button className="btn btn-link">Cancel</button>
        <button className="btn btn-primary"
                onClick={this.searchSupplier.bind(this)}>Search</button>
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
        { this.renderTable(this.filter(this.state.form.keyword, this.state.data)) }
      </div>
    </div>)
  }
}