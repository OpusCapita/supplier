import React, { Component, PropTypes } from 'react';
import locales from './i18n';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Access } from '../../api';
import ActionButton from '../ActionButton.react';
import dateHelper from '../../utils/dateHelper';

export default class SupplierApproval extends Component {

  constructor(props) {
    super(props);
    this.state = { accessRequests: [] };
    this.accessApi = new Access();
  }

  static propTypes = {
    supplierId: PropTypes.string.isRequired
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired,
    showNotification: React.PropTypes.func
  };

  componentWillMount() {
    this.context.i18n.register('SupplierApproval', locales);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextContext.i18n) nextContext.i18n.register('SupplierApproval', locales);
  }

  componentDidMount() {
    this.accessApi.getAccesses(this.props.supplierId).then(accessRequests => {
      this.setState({ accessRequests: accessRequests });
    });
  }

  updateAccessRequests = (access) => {
    let accessRequests = this.state.accessRequests;
    const index = accessRequests.findIndex(acc => acc.id === access.id);

    if (index === -1) throw new Error(`Not found accessRequest for id=${access.id}`);
    accessRequests[index].status = access.status;

    this.setState({ accessRequests: accessRequests });
  };

  approveOnClick = (access) => {
    const message = this.context.i18n.getMessage('SupplierApproval.Message.confirmApproval');
    if (!confirm(message)) return;

    this.accessApi.approveAccess(access.id, access.userId).then(supplierAccess => {
      this.updateAccessRequests(supplierAccess);

      const info = this.context.i18n.getMessage('SupplierApproval.Notification.success.approved');
      if(this.context.showNotification) this.context.showNotification(info, 'info');
    });
  };

  rejectOnClick = (access) => {
    const message = this.context.i18n.getMessage('SupplierApproval.Message.rejectApproval');
    if (!confirm(message)) return;

    this.accessApi.rejectAccess(access.id, access.userId).then(supplierAccess => {
      this.updateAccessRequests(supplierAccess);

      const info = this.context.i18n.getMessage('SupplierApproval.Notification.success.rejected');
      if(this.context.showNotification) this.context.showNotification(info, 'info');
    });
  };

  renderActions(access) {
    if (access.status !== 'requested') return this.context.i18n.getMessage(`SupplierApproval.Status.${access.status}`);

    return (
      <div className='text-right'>
        {['approve', 'reject'].map(status => {
          return <ActionButton
                    key={status}
                    action={status}
                    onClick={this[`${status}OnClick`].bind(this, access)}
                    label={this.context.i18n.getMessage(`SupplierApproval.Button.${status}`)}
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
        accessor: element => dateHelper.format(element.date, this.context.i18n.locale)
      }, {
        Header: this.context.i18n.getMessage('SupplierApproval.Label.comment'),
        accessor: 'comment'
      }, {
        Header: this.context.i18n.getMessage('SupplierApproval.Label.status'),
        accessor: element => ({ id: element.id, userId: element.userId, status: element.status }),
        id: 'actions',
        Cell: row => this.renderActions(row.value)
      }];

    return <ReactTable data={data} columns={columns} defaultPageSize={5} className='table' />
  }

  render() {
    return (
      <div>
        <h4 className="tab-description">{this.context.i18n.getMessage('SupplierApproval.Message.heading')}</h4>
        <div className='table-responsive'>{this.renderTable(this.state.accessRequests)}</div>
      </div>
    );
  }
}
