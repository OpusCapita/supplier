import React, { Component } from 'react';
import request from 'superagent-bluebird-promise';
import Button from 'react-bootstrap/lib/Button';
import i18nRegister from "../../i18n/register.js";
import i18nMessages from "./i18n";
import _ from 'underscore';
import utils from '../../utils/utils';
import Alert from '../Alert';
import DisplayRow from '../../components/DisplayTable/DisplayRow.react';
import DisplayField from '../../components/DisplayTable/DisplayField.react';
import DisplayTable from '../../components/DisplayTable/DisplayTable.react';
import DisplayEditGroup from '../../components/DisplayTable/DisplayEditGroup.react';
import SupplierContactEditForm from './SupplierContactEditForm.react';

class SupplierContactEditor extends Component {

  static propTypes = {
    actionUrl: React.PropTypes.string,
    supplierId: React.PropTypes.string,
    username: React.PropTypes.string,
    readOnly: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    onUnauthorized: React.PropTypes.func
  };

  static defaultProps = {
    readOnly: false,
    onChange: function(event) {
      if (event.isDirty) {
        console.log('data in form changed');
      } else {
        console.log('data in form committed or canceled')
      }
    }
  };

  state = {
    loadErrors: false
  };

  componentWillMount(){
    this.setState({ i18n: i18nRegister(this.props.locale, 'SupplierContactEditor', i18nMessages) });
  }

  componentDidMount() {
    this.loadContacts();
  }

  componentWillReceiveProps(newProps) {
    let editMode = this.state.editMode;

    if (editMode && this.props.readOnly !== newProps.readOnly) {
      let newState = { globalError: null };

      if (editMode === 'create') {
        newState.contact = null;
        newState.globalError = null;
      } else if (editMode === 'edit') {
        newState.editMode = 'view';
      } else if (editMode === 'view') {
        newState.editMode = 'edit';
      }
      this.setState(newState);
    }
  }

  handleDelete = (contact) => {
    let actionUrl = this.props.actionUrl;
    let supplierId = this.props.supplierId;

    let arg0 = encodeURIComponent(supplierId);
    let arg1 = encodeURIComponent(contact.contactId);
    request.del(`${actionUrl}/supplier/api/suppliers/${arg0}/contacts/${arg1}`).
      set('Accept', 'application/json').
      then((response) => {
        let contacts = this.state.contacts;
        let index = _.findIndex(contacts, { contactId: contact.contactId });
        if (index === -1) {
          throw new Error(`Not found contact by contactId [${contact.contactId}]`);
        }

        contacts.splice(index, 1);

        const message = this.state.i18n.getMessage('SupplierContactEditor.Message.objectDeleted');
        this.setState({ contacts: contacts, contact: null, globalMessage: message, globalError: null });
      }).catch((response) => {
        if (response.status === 401) {
          this.props.onUnauthorized();
        } else {
          console.log(`Bad request by SupplierID=${supplierId} and ContactID=${contact.contactId}`);

          const message = this.state.i18n.getMessage('SupplierContactEditor.Message.deleteFailed');
          this.setState({ globalError: message, globalMessage: null });
        }
      });
  };

  handleCreate = () => {
    this.props.onChange({ isDirty: true });
    this.setState({ contact: {}, editMode: "create", errors: null });
  };

  handleUpdate = (contact) => {
    let actionUrl = this.props.actionUrl;
    let supplierId = this.props.supplierId;
    contact.changedBy = this.props.supplierId;// eslint-disable-line no-param-reassign

    let arg0 = encodeURIComponent(supplierId);
    let arg1 = encodeURIComponent(contact.contactId);
    request.put(`${actionUrl}/supplier/api/suppliers/${arg0}/contacts/${arg1}`).
      set('Accept', 'application/json').
      send(contact).
      then((response) => {

        let updatedContact = response.body;

        let contacts = this.state.contacts;
        let index = _.findIndex(contacts, { contactId: contact.contactId });

        if (index === -1) {
          throw new Error(`Not found contact by ContactID=${contact.contactId}`);
        }
        contacts[index] = updatedContact;

        this.props.onChange({ isDirty: false });

        const message = this.state.i18n.getMessage('SupplierContactEditor.Message.objectUpdated');
        this.setState({ contacts: contacts, contact: null, globalMessage: message, globalError: null });
      }).catch((response) => {
        if (response.status === 401) {
          this.props.onUnauthorized();
        } else {
          console.log(`Bad request by SupplierID=${supplierId} and ContactID=${contact.contactId}`);

          const message = this.state.i18n.getMessage('SupplierContactEditor.Message.updateFailed');
          this.setState({ globalError: message, globalMessage: null });
        }
      });
  };

  handleSave = (contact) => {
    let actionUrl = this.props.actionUrl;
    let supplierId = this.props.supplierId;

    /* eslint-disable no-param-reassign*/
    contact.supplierId = supplierId;
    contact.createdBy = this.props.username;
    contact.changedBy = this.props.username;

    // generate unique value
    contact.contactId = utils.generateUUID();
    /* eslint-enable no-param-reassign*/

    request.post(`${actionUrl}/supplier/api/suppliers/${encodeURIComponent(supplierId)}/contacts`).
      set('Accept', 'application/json').
      send(contact).
      then((response) => {
        let contacts = this.state.contacts;
        contacts.push(response.body);

        this.props.onChange({ isDirty: false });

        const message = this.state.i18n.getMessage('SupplierContactEditor.Message.objectSaved');
        this.setState({ contacts: contacts, contact: null, globalMessage: message, globalError: null });
      }).catch((response) => {
        if (response.status === 401) {
          this.props.onUnauthorized();
        } else {
          console.log(`Bad request by SupplierID=${supplierId} and ContactID=${contact.contactId}`);

          let message = this.state.i18n.getMessage('SupplierContactEditor.Message.saveFailed');
          this.setState({ globalError: message, globalMessage: null });
        }
      });
  };

  handleCancel = () => {
    this.props.onChange({ isDirty: false });
    this.setState({ contact: null, globalError: null, globalMessage: null });
  };

  handleChange = (contact, name, oldValue, newValue) => {
    this.props.onChange({ isDirty: true });
  };

  onDelete = (contact) => {
    if (!confirm(this.state.i18n.getMessage('SupplierContactEditor.Confirmation.delete'))) {
      return;
    }
    this.handleDelete(contact);
  };

  handleView = (contact) => {
    this.setState({
      contact: _.clone(contact),
      editMode: "view",
      globalError: null,
      globalMessage: null,
      errors: null
    });
  };

  handleEdit = (contact) => {
    this.setState({
      contact: _.clone(contact),
      editMode: "edit",
      globalError: null,
      globalMessage: null,
      errors: null
    });
  };

  loadContacts = () => {
    let actionUrl = this.props.actionUrl;
    let supplierId = this.props.supplierId;
    request.
      get(`${actionUrl}/supplier/api/suppliers/${encodeURIComponent(supplierId)}/contacts`).
      set('Accept', 'application/json').
      then((response) => {
        this.setState({ contacts: response.body });
      }).catch((response) => {
        if (response.status === 401) {
          this.props.onUnauthorized();
        } else {
          console.log(`Error loading contacts by SupplierID=${supplierId}`);
          this.setState({ loadErrors: true });
        }
      });
  };

  render() {
    const contacts = this.state.contacts;
    const loadErrors = this.state.loadErrors;
    let contact = this.state.contact;
    let errors = this.state.errors;
    let editMode = this.state.editMode;
    let readOnly = this.props.readOnly;
    let result;

    if (contacts) {
      if (contacts.length > 0) {
        result = (
          <div className="table-responsive">
            <DisplayTable headers={[{label: this.state.i18n.getMessage('SupplierContactEditor.Label.contactType')},
              {label: this.state.i18n.getMessage('SupplierContactEditor.Label.department')},
              {label: this.state.i18n.getMessage('SupplierContactEditor.Label.firstName')},
              {label: this.state.i18n.getMessage('SupplierContactEditor.Label.lastName')},
              {label: this.state.i18n.getMessage('SupplierContactEditor.Label.phone')},
              {label: this.state.i18n.getMessage('SupplierContactEditor.Label.mobile')},
              {label: this.state.i18n.getMessage('SupplierContactEditor.Label.email')}
            ]}>
              { contacts.map((contact, index) =>
                (<DisplayRow key={index}>
                  <DisplayField>{ contact.contactType }</DisplayField>
                  <DisplayField>{ contact.department || '-' }</DisplayField>
                  <DisplayField>{ contact.firstName }</DisplayField>
                  <DisplayField>{ contact.lastName }</DisplayField>
                  <DisplayField>{ contact.phone || '-'}</DisplayField>
                  <DisplayField>{ contact.mobile }</DisplayField>
                  <DisplayField>{ contact.email }</DisplayField>
                  <DisplayEditGroup editAction={this.handleEdit.bind(this, contact)}
                             deleteAction={this.onDelete.bind(this,contact)}
                             editLabel={this.state.i18n.getMessage('SupplierContactEditor.Button.edit')}
                             deleteLabel={this.state.i18n.getMessage('SupplierContactEditor.Button.delete')}/>

                </DisplayRow>))
              }
            </DisplayTable>
          </div>
        );
      } else if (readOnly) {
        contact = null;
      } else {
        // show create new contact if empty
        contact = {};
        errors = {};
        editMode = 'create-first';
      }
    } else if (loadErrors) {
      result = (<div>Load errors</div>);
    } else {
      result = (<div>Loading...</div>);
    }

    return (
      <div>
        <h4 className="tab-description">{this.state.i18n.getMessage('SupplierContactEditor.Title')}</h4>

        {this.state.globalMessage && !readOnly ? (
          <Alert bsStyle="info" message={this.state.globalMessage}/>
        ) : null}

        {result}

        {contact ? (
          <div className="row">
            <div className="col-sm-6">
              {this.state.globalError && !readOnly ? (
                <Alert bsStyle="danger" message={this.state.globalError}/>
              ) : null}

              <SupplierContactEditForm
                onChange={this.handleChange}
                contact={contact}
                errors={errors}
                i18n={this.state.i18n}
                editMode={editMode}
                onSave={this.handleSave}
                onUpdate={this.handleUpdate}
                onCancel={this.handleCancel}
              />
            </div>
          </div>
        ) : null}

        {!contact && !readOnly ? (
          <div>
            <Button onClick={this.handleCreate}>{this.state.i18n.getMessage('SupplierContactEditor.Button.add')}
            </Button>
          </div>
        ) : null}
      </div>
    );
  }
}

export default SupplierContactEditor;
