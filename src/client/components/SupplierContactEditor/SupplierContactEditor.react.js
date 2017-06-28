import React, { Component } from 'react';
import request from 'superagent-bluebird-promise';
import utils from 'underscore';
import Button from 'react-bootstrap/lib/Button';
import i18n from '../../i18n/I18nDecorator.react.js';
import Alert from '../Alert';
import SupplierContactListTable from './SupplierContactListTable.react.js';
import SupplierContactEditForm from './SupplierContactEditForm.react.js';

/**
 * Supplier contact editor
 *
 * @author Dmitry Divin
 */
@i18n({
  componentName: 'SupplierContactEditor',
  messages: require('./i18n').default,
})
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
        let index = utils.findIndex(contacts, { contactId: contact.contactId });
        if (index === -1) {
          throw new Error(`Not found contact by contactId [${contact.contactId}]`);
        }

        contacts.splice(index, 1);

        const message = this.context.i18n.getMessage('SupplierContactEditor.Message.objectDeleted');
        this.setState({ contacts: contacts, contact: null, globalMessage: message, globalError: null });
      }).catch((response) => {
        if (response.status === 401) {
          this.props.onUnauthorized();
        } else {
          console.log(`Bad request by SupplierID=${supplierId} and ContactID=${contact.contactId}`);

          const message = this.context.i18n.getMessage('SupplierContactEditor.Message.deleteFailed');
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
        let index = utils.findIndex(contacts, { contactId: contact.contactId });

        if (index === -1) {
          throw new Error(`Not found contact by ContactID=${contact.contactId}`);
        }
        contacts[index] = updatedContact;

        this.props.onChange({ isDirty: false });

        const message = this.context.i18n.getMessage('SupplierContactEditor.Message.objectUpdated');
        this.setState({ contacts: contacts, contact: null, globalMessage: message, globalError: null });
      }).catch((response) => {
        if (response.status === 401) {
          this.props.onUnauthorized();
        } else {
          console.log(`Bad request by SupplierID=${supplierId} and ContactID=${contact.contactId}`);

          const message = this.context.i18n.getMessage('SupplierContactEditor.Message.updateFailed');
          this.setState({ globalError: message, globalMessage: null });
        }
      });
  };

  generateUUID() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + s4();
  }

  handleSave = (contact) => {
    let actionUrl = this.props.actionUrl;
    let supplierId = this.props.supplierId;

    /* eslint-disable no-param-reassign*/
    contact.supplierId = supplierId;
    contact.createdBy = this.props.username;
    contact.changedBy = this.props.username;

    // generate unique value
    contact.contactId = this.generateUUID();
    /* eslint-enable no-param-reassign*/

    request.post(`${actionUrl}/supplier/api/suppliers/${encodeURIComponent(supplierId)}/contacts`).
      set('Accept', 'application/json').
      send(contact).
      then((response) => {
        let contacts = this.state.contacts;
        contacts.push(response.body);

        this.props.onChange({ isDirty: false });

        const message = this.context.i18n.getMessage('SupplierContactEditor.Message.objectSaved');
        this.setState({ contacts: contacts, contact: null, globalMessage: message, globalError: null });
      }).catch((response) => {
        if (response.status === 401) {
          this.props.onUnauthorized();
        } else {
          console.log(`Bad request by SupplierID=${supplierId} and ContactID=${contact.contactId}`);

          let message = this.context.i18n.getMessage('SupplierContactEditor.Message.saveFailed');
          this.setState({ globalError: message, globalMessage: null });
        }
      });
  };

  handleCancel = () => {
    this.props.onChange({ isDirty: false });
    this.setState({ contact: null, globalError: null, globalMessage: null });
  };

  handleChange = (contact, name, oldValue, newValue) => {
    // check only updated objects
    // if (contact.contactId) {
    this.props.onChange({ isDirty: true });
    // }
  };

  handleView = (contact) => {
    this.setState({
      contact: utils.clone(contact),
      editMode: "view",
      globalError: null,
      globalMessage: null,
      errors: null
    });
  };

  handleEdit = (contact) => {
    this.setState({
      contact: utils.clone(contact),
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

    if (contacts !== undefined) {
      if (contacts.length > 0) {
        result = (
          <div className="table-responsive">
            <SupplierContactListTable
              contacts={contacts}
              readOnly={readOnly}
              onEdit={this.handleEdit}
              onDelete={this.handleDelete}
              onView={this.handleView}
            />
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
        <h4 className="tab-description">{this.context.i18n.getMessage('SupplierContactEditor.Title')}</h4>

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
            <Button onClick={this.handleCreate}>{this.context.i18n.getMessage('SupplierContactEditor.Button.add')}
            </Button>
          </div>
        ) : null}
      </div>
    );
  }
}

export default SupplierContactEditor;
