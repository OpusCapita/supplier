import React, { Component } from 'react';
import validationMessages from '../../utils/validatejs/i18n';
import i18nMessages from './i18n';
import DisplayRow from '../../components/DisplayTable/DisplayRow.react';
import DisplayField from '../../components/DisplayTable/DisplayField.react';
import DisplayTable from '../../components/DisplayTable/DisplayTable.react';
import SupplierContactEditForm from './SupplierContactEditForm.react';
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
      loadErrors: false
    };

    this.contactApi = new Contact();
    this.userAbilities = new UserAbilities(props.userRoles);
  }

  componentWillMount(){
    this.context.i18n.register('SupplierValidatejs', validationMessages);
    this.context.i18n.register('SupplierContactEditor', i18nMessages);
  }

  componentDidMount() {
    this.loadContacts();
  }

  componentWillReceiveProps(newProps, nextContext) {
    if(nextContext.i18n){
      nextContext.i18n.register('SupplierValidatejs', validationMessages);
      nextContext.i18n.register('SupplierContactEditor', i18nMessages);
    }
  }

  handleDelete = (contact) => {
    let supplierId = this.props.supplierId;

    this.contactApi.deleteContact(supplierId, contact.id).then(() => {
      let contacts = this.state.contacts;
      const index = contacts.findIndex(cont => cont.id === contact.id);
      if (index === -1) {
        throw new Error(`Not found contact by id [${contact.id}]`);
      }

      contacts.splice(index, 1);
      if(this.props.newNotification) this.props.newNotification(true);

      const message = this.context.i18n.getMessage('SupplierContactEditor.Message.objectDeleted');
      if(this.context.showNotification) this.context.showNotification(message, 'info');

      this.setState({ contacts: contacts, contact: null });
    }).catch((response) => {
      if (response.status === 401) {
        this.props.onUnauthorized();
      } else {
        console.log(`Bad request by SupplierID=${supplierId} and id=${contact.id}`);
        const message = this.context.i18n.getMessage('SupplierContactEditor.Message.deleteFailed');
        if(this.context.showNotification){
          this.context.showNotification(message, 'error')
        }
      }
    });
  };

  addOnClick = () => {
    this.props.onChange({ isDirty: true });
    this.setState({ contact: {}, editMode: "create", errors: null });
  };

  handleUpdate = (contact) => {
    let supplierId = this.props.supplierId;
    contact.changedBy = this.props.username;// eslint-disable-line no-param-reassign

    this.contactApi.updateContact(supplierId, contact.id, contact).then(updatedContact => {
      let contacts = this.state.contacts;
      const index = contacts.findIndex(cont => cont.id === contact.id);

      if (index === -1) {
        throw new Error(`Not found contact by id=${contact.id}`);
      }
      contacts[index] = updatedContact;

      this.props.onChange({ isDirty: false });
      if(this.props.newNotification) this.props.newNotification(true);

      const message = this.context.i18n.getMessage('SupplierContactEditor.Message.objectUpdated');
      if(this.context.showNotification) this.context.showNotification(message, 'info');

      this.setState({ contacts: contacts, contact: null });
    }).catch(response => {
      if (response.status === 401) {
        this.props.onUnauthorized();
      } else {
        console.log(`Bad request by SupplierID=${supplierId} and id=${contact.id}`);
        const message = this.context.i18n.getMessage('SupplierContactEditor.Message.updateFailed');
        if(this.context.showNotification){
          this.context.showNotification(message, 'error')
        }
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

        this.props.onChange({ isDirty: false });

        const message = this.context.i18n.getMessage('SupplierContactEditor.Message.objectSaved');
        if(this.context.showNotification) this.context.showNotification(message, 'info');

        this.setState({ contacts: contacts, contact: null });
      }).catch((response) => {
        if (response.status === 401) {
          this.props.onUnauthorized();
        } else {
          console.log(`Bad request by SupplierID=${supplierId} and id=${contact.id}`);
          let message = this.context.i18n.getMessage('SupplierContactEditor.Message.saveFailed');
          if(this.context.showNotification) this.context.showNotification(message, 'error');
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
    if (!confirm(this.context.i18n.getMessage('SupplierContactEditor.Confirmation.delete'))) {
      return;
    }
    this.handleDelete(contact);
  };

  editOnClick = (contact) => {
    this.setState({ contact: JSON.parse(JSON.stringify(contact)), editMode: "edit", errors: null });
  };

  loadContacts = () => {
    let supplierId = this.props.supplierId;

    this.contactApi.getContacts(supplierId).then(contacts => {
        this.setState({ contacts: contacts });
      }).catch(response => {
        if (response.status === 401) {
          this.props.onUnauthorized();
        } else {
          console.log(`Error loading contacts by SupplierID=${supplierId}`);
          this.setState({ loadErrors: true });
        }
      });
  };

  renderActionButtons(contact) {
    return this.userAbilities.actionGroupForContacts().map((action, index) => {
      return <ActionButton
                key={index}
                action={action}
                onClick={this[`${action}OnClick`].bind(this, contact)}
                label={this.context.i18n.getMessage(`SupplierContactEditor.Button.${action}`)}
                isSmall={true}
                showIcon={true}
              />
    });
  }

  render() {
    const { contacts, loadErrors } = this.state;
    let { contact, errors, editMode } = this.state;
    let result;

    if (contacts) {
      if (contacts.length > 0) {
        result = (
          <div className="table-responsive">
            <DisplayTable headers={[
              {label: this.context.i18n.getMessage('SupplierContactEditor.Label.contactType')},
              {label: this.context.i18n.getMessage('SupplierContactEditor.Label.department')},
              {label: this.context.i18n.getMessage('SupplierContactEditor.Label.firstName')},
              {label: this.context.i18n.getMessage('SupplierContactEditor.Label.lastName')},
              {label: this.context.i18n.getMessage('SupplierContactEditor.Label.phone')},
              {label: this.context.i18n.getMessage('SupplierContactEditor.Label.mobile')},
              {label: this.context.i18n.getMessage('SupplierContactEditor.Label.email')}
            ]}>
              { contacts.map((contact, index) =>
                (<DisplayRow key={index}>
                  <DisplayField>{ this.context.i18n.getMessage(`SupplierContactEditor.ContactType.${contact.contactType}`)}</DisplayField>
                  <DisplayField>{ contact.department ? this.context.i18n.getMessage(`SupplierContactEditor.Department.${contact.department}`) : '-' }</DisplayField>
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
      } else {
        // show create new contact if empty
        contact = {};
        errors = {};
        editMode = 'create';
      }
    } else if (loadErrors) {
      result = (<div>Load errors</div>);
    } else {
      result = (<div>Loading...</div>);
    }

    return (
      <div>
        <h4 className="tab-description">{this.context.i18n.getMessage('SupplierContactEditor.Title')}</h4>

        {result}

        {contact ? (
          <div className="row">
            <div className="col-sm-6">
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

        {!contact ? (
          <div>
            <ActionButton
              onClick={this.addOnClick}
              label={this.context.i18n.getMessage('SupplierContactEditor.Button.add')}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default SupplierContactEditor;
