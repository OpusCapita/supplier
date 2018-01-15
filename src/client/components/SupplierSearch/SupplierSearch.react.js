import React, { PropTypes } from 'react';
import locales from './i18n';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Supplier } from '../../api';
import { Components } from '@opuscapita/service-base-ui';
import DisplayField from '../DisplayTable/DisplayField.react';
import CountryView from '../CountryView.react';
import ActionButton from '../ActionButton.react';
import SupplierPublic from '../SupplierPublic/SupplierPublic.react';
require('./SupplierSearch.css');

export default class SupplierSearch extends Components.ContextComponent  {

  constructor(props) {
    super(props);
    this.state = { searchWord: '', capability: null, supplierId: null, data: [] };
    this.supplierApi = new Supplier();
    this.supplierPublicModal = null;
  }

  static contextTypes = {
    i18n : PropTypes.object.isRequired,
    showNotification: PropTypes.func
  };

  componentWillMount(){
    this.context.i18n.register('SupplierSearch', locales);
  }

  componentWillReceiveProps(nextProps, nextContext){
    if(nextContext.i18n) nextContext.i18n.register('SupplierSearch', locales);
  }

  searchSupplier() {
    const queryParam = { search: this.state.searchWord, capabilities: this.state.capability };
    this.supplierApi.getSuppliers(queryParam).then(data => this.setState({ data: data }));
  }

  onSearchWordChange(event) {
    this.setState({ searchWord: event.target.value });
  }

  handleChange(event) {
    this.setState({ capability: event.target.value });
  }

  handleShowSupplier(supplierId) {
    this.setState({ supplierId: supplierId });
    this.supplierPublicModal.show(this.context.i18n.getMessage('SupplierSearch.modalHeader.title'), undefined, null, {});
  }

  renderSearchBox() {
    return (<div className="form-group search-box">
      <div className='row'>
        <label className="control-label col-xs-10">{this.context.i18n.getMessage('SupplierSearch.searchInput.label')}</label>
        <label className="control-label col-xs-2">{this.context.i18n.getMessage('SupplierSearch.capability.label')}</label>
      </div>
      <div className='row'>
        <div className='col-xs-10'>
          <input value={this.state.searchWord} onChange={this.onSearchWordChange.bind(this)} className="form-control"/>
        </div>
        <div className='col-xs-2'>
          <select value={this.state.capability} onChange={this.handleChange.bind(this)} className="form-control" >
            <option key='1' value={null}></option>
            <option key='2' value='eInvoice-send'>{this.context.i18n.getMessage('SupplierSearch.capability.eInvoice-send')}</option>
          </select>
        </div>
      </div>
      <div className="text-right form-submit">
        <ActionButton
          id="supplier-editor__search"
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
        id: 'supplierName',
        accessor: element => ({ name: element.supplierName, id: element.supplierId }),
        Cell: (row) => (<ActionButton style='link' label={row.value.name} onClick={this.handleShowSupplier.bind(this, row.value.id)} />)
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
        accessor: element => {
          if (!element.capabilities) return null;

          return element.capabilities.map(cap => this.context.i18n.getMessage(`SupplierSearch.capability.${cap}`)).join(', ');
        },
        id: 'capabilities'
      }];

    return <ReactTable data={data} columns={columns} defaultPageSize={10} className="table"/>;
  }

  render() {
    return (<div>
      { this.renderSearchBox() }
      <div className="table-responsive">
        { this.renderTable(this.state.data) }
      </div>
      <Components.ModalDialog ref={node => this.supplierPublicModal = node} size='large'>
          <SupplierPublic supplierId={this.state.supplierId}/>
      </Components.ModalDialog>
    </div>)
  }
}
