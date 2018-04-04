import React, { PropTypes, Component } from 'react';
import locales from './i18n';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Supplier } from '../../api';
import ActionButton from '../ActionButton.react';

export default class SupplierList extends Component  {
  constructor(props) {
    super(props);
    this.state = { suppliers: [] };
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
    this.context.i18n.register('SupplierList', locales);
  }

  componentWillReceiveProps(nextProps, nextContext){
    if(nextContext.i18n) nextContext.i18n.register('SupplierList', locales);
  }

  componentDidMount() {
    this.supplierApi.getSuppliers().then(suppliers => this.setState({ suppliers: suppliers }));
  }

  editOnClick(supplierId) {
    this.props.onEdit(supplierId);
  }

  createUserOnClick(supplierId) {
    this.props.onCreateUser(supplierId);
  }

  renderActions(supplierId) {
    return (
      <div className='text-right'>
        {['edit', 'createUser'].map(action => {
          return <ActionButton
                    key={action}
                    action={action}
                    onClick={this[`${action}OnClick`].bind(this, supplierId)}
                    label={this.context.i18n.getMessage(`SupplierList.button.${action}`)}
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
        Header: this.context.i18n.getMessage('SupplierList.label.name'),
        accessor: 'name',
      },
      {
        Header: this.context.i18n.getMessage('SupplierList.label.id'),
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
        <h1 className="tab-description">{this.context.i18n.getMessage('SupplierList.heading')}</h1>
        <div className='table-responsive'>{this.renderTable(this.state.suppliers)}</div>
      </div>
    );
  }
}
