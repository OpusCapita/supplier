import React, { Component, PropTypes } from 'react';
import locales from './i18n';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Access } from '../../api';
import ActionButton from '../../components/ActionButton.react';
require('./SupplierApproval.css');

export default class SupplierApproval extends Component {

  constructor(props) {
    super(props);
    this.state = { accessRequests: [] };
    this.accessApi = new Access();
  }

  static propTypes = {
    supplierId: PropTypes.string.isRequired,
    username: React.PropTypes.string.isRequired
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired,
    showNotification: React.PropTypes.func
  };

  componentWillMount(){
    this.context.i18n.register('SupplierApproval', locales);
  }

  componentWillReceiveProps(nextProps, nextContext){
    if(nextContext.i18n){
      nextContext.i18n.register('SupplierApproval', locales);
    }
  }

  componentDidMount() {
    this.accessApi.getAccesses(this.props.supplierId).then(accessRequests => {
      this.setState({ accessRequests: accessRequests });
    });
  }

  approveOnClick = (access) => {

  };

  rejectOnClick = (access) => {

  };

  renderActions = (access) => {
    if (access.status !== 'requested') return this.context.i18n.getMessage(`SupplierApproval.Status.${access.status}`);

    return (
      <div className='text-right'>
        <ActionButton
          key='approve'
          action='approve'
          onClick={this.approveOnClick.bind(this, access)}
          label={this.context.i18n.getMessage('SupplierApproval.Button.approve')}
          isSmall={true}
          showIcon={true}
        />
        <ActionButton
          key='reject'
          action='reject'
          onClick={this.rejectOnClick.bind(this, access)}
          label={this.context.i18n.getMessage('SupplierApproval.Button.reject')}
          isSmall={true}
          showIcon={true}
        />
      </div>
    );
  };

  renderTable(data) {

    const columns = [
      {
        Header: this.context.i18n.getMessage('SupplierApproval.Label.firstName'),
        accessor: 'firstName',
      },
      {
        Header: this.context.i18n.getMessage('SupplierApproval.Label.lastName'),
        accessor: 'lastName'
      },
      {
        Header: this.context.i18n.getMessage('SupplierApproval.Label.email'),
        accessor: 'email'
      }, {
        Header: this.context.i18n.getMessage('SupplierApproval.Label.date'),
        id: 'date',
        accessor: d => (new Date(d.date)).toLocaleDateString(this.context.i18n.locale)
      }, {
        Header: this.context.i18n.getMessage('SupplierApproval.Label.comment'),
        accessor: 'comment'
      }, {
        Header: this.context.i18n.getMessage('SupplierApproval.Label.status'),
        accessor: d => ({ id: d.id, status: d.status }),
        id: 'actions',
        Cell: row => this.renderActions(row.value)
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
        { this.renderTable(this.state.accessRequests) }
      </div>
    </div>)
  }
}
