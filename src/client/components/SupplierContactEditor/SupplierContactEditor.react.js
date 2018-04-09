import React, { Component } from 'react';
import validationMessages from '../../utils/validatejs/i18n';
import i18nMessages from '../../i18n';
import DisplayRow from '../../components/DisplayTable/DisplayRow.react';
import DisplayField from '../../components/DisplayTable/DisplayField.react';
import DisplayTable from '../../components/DisplayTable/DisplayTable.react';
import SupplierContactEditForm from './SupplierContactEditForm.react';
import SupplierContactView from './SupplierContactView.react';
import ActionButton from '../../components/ActionButton.react';
import { Contact } from '../../api';
import UserAbilities from '../../UserAbilities';

class SupplierContactEditor extends Component {

  static propTypes = {
    supplierId: React.PropTypes.string.isRequired,
    username: React.PropTypes.string,
    userRoles: React.PropTypes.array.isRequired,
    onChange: React.PropTypes.func,
    onUnauthorized: React.PropTypes.func
  };

  static contextTypes = {
    i18n: React.PropTypes.object.isRequired,
    showNotification: React.PropTypes.func
  };

  static defaultProps = {
    onChange: function(event) {
      if (event.isDirty) {
        console.log('data in form changed');
      } else {
        console.log('data in form committed or canceled')
      }
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      contacts: [],
      contact: null,
      loadErrors: false
    };

    this.contactApi = new Contact();
    this.userAbilities = new UserAbilities(props.userRoles);
  }

  componentWillMount(){
    this.context.i18n.register('SupplierValidatejs', validationMessages);
    this.context.i18n.register('Supplier', i18nMessages);
  }

  componentDidMount() {
    this.loadContacts();
  }

  componentWillReceiveProps(newProps, nextContext) {
    if(nextContext.i18n){
      nextContext.i18n.register('SupplierValidatejs', validationMessages);
      nextContext.i18n.register('Supplier', i18nMessages);
    }
  }

  notify(message, type) {
    if (this.context.showNotification) this.context.showNotification(message, type);
  }

  handleDelete = (contact) => {
    let supplierId = this.props.supplierId;

    this.contactApi.deleteContact(supplierId, contact.id).then(() => {
      let contacts = this.state.contacts;
      const index = contacts.findIndex(cont => cont.id === contact.id);
      if (index === -1) throw new Error(`Not found contact by id [${contact.id}]`);

      contacts.splice(index, 1);
      this.setState({ contacts: contacts, contact: null });

      this.notify(this.context.i18n.getMessage('Supplier.Contact.Message.deleted'), 'info');
    }).catch((response) => {
      if (response.status === 401) {
        this.props.onUnauthorized();
      } else {
        console.log(`Bad request by SupplierID=${supplierId} and id=${contact.id}`);
        this.notify(this.context.i18n.getMessage('Supplier.Contact.Message.deleteFailed'), 'error');
      }
    });
  };

  addOnClick = () => {
    this.props.onChange({ isDirty: true });
    this.setState({ contact: {}, editMode: "create", errors: null });
  };

  handleUpdate = (contact) => {
    let supplierId = this.props.supplierId;
    contact.changedBy = this.props.username;

    this.contactApi.updateContact(supplierId, contact.id, contact).then(updatedContact => {
      this.updateContacts(contact, updatedContact);

      this.props.onChange({ isDirty: false });

      this.notify(this.context.i18n.getMessage('Supplier.Contact.Message.updated'), 'info');
    }).catch(response => {
      if (response.status === 401) {
        this.props.onUnauthorized();
      } else {
        console.log(`Bad request by SupplierID=${supplierId} and id=${contact.id}`);
        this.notify(this.context.i18n.getMessage('Supplier.Contact.Message.updateFailed'), 'error');
      }
    });
  };

  handleSave = (contact) => {
    let supplierId = this.props.supplierId;

    contact.supplierId = supplierId;
    contact.createdBy = this.props.username;
    contact.changedBy = this.props.username;

    this.contactApi.createContact(supplierId, contact).then(createdContact => {
      let contacts = this.state.contacts;
      contacts.push(createdContact);
      this.setState({ contacts: contacts, contact: null });

      this.props.onChange({ isDirty: false });

      this.notify(this.context.i18n.getMessage('Supplier.Contact.Message.saved'), 'info');
    }).catch((response) => {
      if (response.status === 401) {
        this.props.onUnauthorized();
      } else {
        console.log(`Bad request by SupplierID=${supplierId} and id=${contact.id}`);
        this.notify(this.context.i18n.getMessage('Supplier.Contact.Message.saveFailed'), 'error');
      }
    });
  };

  handleCancel = () => {
    this.props.onChange({ isDirty: false });
    this.setState({ contact: null });
  };

  handleChange = (contact, name, oldValue, newValue) => {
    this.props.onChange({ isDirty: true });
  };

  deleteOnClick = (contact) => {
    let message = this.context.i18n.getMessage('Supplier.Contact.Confirmation.delete');
    if (contact.isLinkedToUser) message = `${message} ${this.context.i18n.getMessage('Supplier.Contact.Confirmation.linkedToUser')}`;

    if (!confirm(message)) return;

    this.handleDelete(contact);
  };

  viewOnClick = (contact) => {
    this.setState({ contact: JSON.parse(JSON.stringify(contact)), editMode: 'view' });
  };

  editOnClick = (contact) => {
    this.setState({ contact: JSON.parse(JSON.stringify(contact)), editMode: "edit", errors: null });
  };

  createUserOnClick = (contact) => {
    if (!confirm(this.context.i18n.getMessage('Supplier.Contact.Confirmation.createUser'))) return;

    this.contactApi.createUser(contact.supplierId, contact).then(resContact => {
      this.updateContacts(contact, resContact);

      this.notify(this.context.i18n.getMessage('Supplier.Contact.Message.userCreated'), 'info');
    }).catch(error => {
      if (error.status == '409') {
        this.notify(this.context.i18n.getMessage('Supplier.Contact.Error.userExists'), 'error');
      } else {
        this.notify(this.context.i18n.getMessage('Supplier.Contact.Message.userCreateFailed'), 'error');
      }
    });
  };

  loadContacts = () => {
    let supplierId = this.props.supplierId;

    this.contactApi.getContacts(supplierId).then(contacts => {
      this.setState({ contacts: contacts, isLoaded: true });
    }).catch(response => {
      if (response.status === 401) {
        this.props.onUnauthorized();
      } else {
        console.log(`Error loading contacts by SupplierID=${supplierId}`);
        this.setState({ isLoaded: true, loadErrors: true });
      }
    });
  };

  updateContacts = (oldContact, newContact) => {
    let contacts = this.state.contacts;
    const index = contacts.findIndex(cont => cont.id === oldContact.id);

    if (index === -1) throw new Error(`Not found contact by id=${oldContact.id}`);
    contacts[index] = newContact;

    this.setState({ contacts: contacts, contact: null });
  };

  renderEditor() {
    const { errors, editMode, contact } = this.state;
    if (editMode === 'view') return <SupplierContactView contact={contact} onClose={this.handleCancel}/>;

    return (
      <SupplierContactEditForm
        onChange={this.handleChange}
        contact={contact}
        errors={errors}
        editMode={editMode}
        onSave={this.handleSave}
        onUpdate={this.handleUpdate}
        onCancel={this.handleCancel}
      />
    );
  }

  addButton() {
    if (!this.state.isLoaded) return null;
    if (this.state.contact) return null;

    return (
      <ActionButton
        onClick={this.addOnClick}
        id='supplier-contact-editor__add'
        label={this.context.i18n.getMessage('Supplier.Button.add')}
      />
    );
  }

  renderActionButtons(contact) {
    return this.userAbilities.actionGroupForContacts(contact.isLinkedToUser).map((action, index) => {
      return <ActionButton
                id={ `supplier-contact-editor__${action}` }
                key={index}
                action={action}
                onClick={this[`${action}OnClick`].bind(this, contact)}
                label={this.context.i18n.getMessage(`Supplier.Button.${action}`)}
                isSmall={true}
                showIcon={true}
              />
    });
  }

  render() {
    const { contacts, contact, isLoaded, loadErrors } = this.state;
    let result;

    if (!isLoaded) {
      result = <div>Loading...</div>;
    }

    if (loadErrors) {
      result = <div>Load errors</div>;
    }

    if (contacts.length > 0) {
      result = (
        <div className="table-responsive">
          <DisplayTable headers={[
            {label: this.context.i18n.getMessage('Supplier.Contact.Label.contactType')},
            {label: this.context.i18n.getMessage('Supplier.Contact.Label.department')},
            {label: this.context.i18n.getMessage('Supplier.Contact.Label.firstName')},
            {label: this.context.i18n.getMessage('Supplier.Contact.Label.lastName')},
            {label: this.context.i18n.getMessage('Supplier.Contact.Label.phone')},
            {label: this.context.i18n.getMessage('Supplier.Contact.Label.mobile')},
            {label: this.context.i18n.getMessage('Supplier.Contact.Label.email')}
          ]}>
            { contacts.map((contact, index) =>
              (<DisplayRow key={index}>
                <DisplayField>{ this.context.i18n.getMessage(`Supplier.Contact.Type.${contact.contactType}`)}</DisplayField>
                <DisplayField>{ contact.department ? this.context.i18n.getMessage(`Supplier.Contact.Department.${contact.department}`) : '-' }</DisplayField>
                <DisplayField>{ contact.firstName }</DisplayField>
                <DisplayField>{ contact.lastName }</DisplayField>
                <DisplayField>{ contact.phone || '-'}</DisplayField>
                <DisplayField>{ contact.mobile }</DisplayField>
                <DisplayField>{ contact.email }</DisplayField>
                <DisplayField classNames='text-right'>
                  {this.renderActionButtons(contact)}
                </DisplayField>
              </DisplayRow>))
            }
          </DisplayTable>
        </div>
      );
    }

    return (
      <div>
        <h4 className="tab-description">{this.context.i18n.getMessage('Supplier.Heading.contact')}</h4>

        {result}

        {contact ? (
          <div className="row">
            <div className="col-sm-6">
              {this.renderEditor()}
            </div>
          </div>
        ) : null}

        {this.addButton()}
      </div>
    );
  }
}

export default SupplierContactEditor;
