import React, { PropTypes, Component } from 'react';
import locales from '../../i18n';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Supplier } from '../../api';
import ActionButton from '../ActionButton.react';
import AttributeValueEditorRow from '../AttributeValueEditorRow.react.js';

export default class SupplierList extends Component  {
  constructor(props) {
    super(props);
    this.state = { suppliers: [], supplierName: '', supplierId: '' };
    this.supplierApi = new Supplier();
  }

   static contextTypes = {
    i18n : PropTypes.object.isRequired,
    showNotification: PropTypes.func
  };

  static propTypes = {
    onEdit: PropTypes.func.isRequired,
    onCreateUser: PropTypes.func.isRequired
  };

  componentWillMount(){
    this.context.i18n.register('Supplier', locales);
  }

  componentWillReceiveProps(nextProps, nextContext){
    if(nextContext.i18n) nextContext.i18n.register('Supplier', locales);
  }

  componentDidMount() {
    this.supplierApi.getSuppliers().then(suppliers => this.setState({ suppliers: suppliers }));
  }

  searchSupplier() {
    let queryParam = {};
    if (this.state.supplierName) queryParam.name = this.state.supplierName;
    if (this.state.supplierId) queryParam.id = this.state.supplierId;
    this.supplierApi.getSuppliers(queryParam).then(suppliers => this.setState({ suppliers: suppliers }));
  }

  async handleReset(event) {
    event.preventDefault();
    await this.setState({ supplierName: '', supplierId: '' });
    this.searchSupplier();
  }

  onSearchChange(fieldValue, event) {
    this.setState({ [fieldValue]: event.target.value });
  }

  editOnClick(supplierId) {
    this.props.onEdit(supplierId);
  }

  createUserOnClick(supplierId) {
    this.props.onCreateUser(supplierId);
  }

  renderField(attrs) {
    const { field, fieldName } = attrs;
    const { i18n } = this.context;

    return (
      <AttributeValueEditorRow labelText={ i18n.getMessage(`Supplier.Label.${fieldName}`) }>
        <input value={this.state[field]} onChange={this.onSearchChange.bind(this, field)} className="form-control"/>
      </AttributeValueEditorRow>
    );
  }

  renderActions(supplierId) {
    return (
      <div className='text-right'>
        {['edit', 'createUser'].map(action => {
          return <ActionButton
                    key={action}
                    action={action}
                    onClick={this[`${action}OnClick`].bind(this, supplierId)}
                    label={this.context.i18n.getMessage(`Supplier.Button.${action}`)}
                    isSmall={true}
                    showIcon={true}
                  />
        })}
      </div>
    );
  }

  renderTable(data) {
    const columns = [
      {
        Header: this.context.i18n.getMessage('Supplier.Label.name'),
        accessor: 'name',
      },
      {
        Header: this.context.i18n.getMessage('Supplier.Label.id'),
        accessor: 'id'
      }, {
        Header: '',
        accessor: 'id',
        id: 'actions',
        Cell: row => this.renderActions(row.value)
      }];

    return <ReactTable data={data} columns={columns} defaultPageSize={10} className='table' />
  }

  render() {
    return (
      <div>
        <h1 className="tab-description">{this.context.i18n.getMessage('Supplier.Heading.list')}</h1>
        <div className="form-horizontal search-list">
          <div className='row'>
            <div className='col-sm-6'>
              { this.renderField({ field: 'supplierName', fieldName: 'name' }) }
            </div>
            <div className='col-sm-6'>
              { this.renderField({ field: 'supplierId', fieldName: 'id' }) }
            </div>
          </div>
          <div className="text-right form-submit" style={{ marginBottom: '30px' }}>
            <ActionButton
              style='link'
              onClick={this.handleReset.bind(this)}
              label={this.context.i18n.getMessage('Supplier.Button.reset')}
            />
            <ActionButton
              style='primary'
              onClick={this.searchSupplier.bind(this)}
              label={this.context.i18n.getMessage('Supplier.Button.search')}
            />
          </div>
        </div>
        <div className='table-responsive'>{this.renderTable(this.state.suppliers)}</div>
      </div>
    );
  }
}
