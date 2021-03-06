import React, { Component } from "react";
import validator from "validate.js";
import "./SupplierContactEditForm.css";
import SupplierContactFormConstraints from "./SupplierContactFormConstraints";
import SupplierContactEditFormRow from "../AttributeValueEditorRow.react.js";
import ActionButton from '../../components/ActionButton.react';
const CONTACT_TYPES = ['Default', 'Sales', 'Escalation', 'Product', 'Technical'];
const DEPARTMENTS = ['Management', 'Logistics', 'Sales', 'Accounting', 'Support', 'IT', 'Others'];
const stringHelper = require('../../../server/utils/string');

class SupplierContactEditForm extends Component {
  static propTypes = {
    contact: React.PropTypes.object.isRequired,
    errors: React.PropTypes.object,
    editMode: React.PropTypes.oneOf(['edit', 'create']),
    onSave: React.PropTypes.func.isRequired,
    onUpdate: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func.isRequired
  };

  static contextTypes = {
    i18n: React.PropTypes.object.isRequired
  };

  static defaultProps = {
    editMode: 'create',
    errors: {}
  };

  state = {
    contact: this.props.contact,
    errors: this.props.errors || {}
  };

  componentWillMount() {
    this.constraints = SupplierContactFormConstraints(this.context.i18n);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.contact) {
      this.setState({contact: nextProps.contact, errors: nextProps.errors || {}});
    }

    this.constraints = SupplierContactFormConstraints(nextContext.i18n);
  }

  handleSaveOrUpdate = (event) => {
    event.preventDefault();

    const contact = this.state.contact;
    let errors = validator(this.state.contact, this.constraints, { fullMessages: false });

    if (!errors) {
      if (this.props.editMode === 'edit') {
        this.props.onUpdate(contact);
      } else {
        this.props.onSave(contact);
      }
    } else {
       let errorsReformatted = Object.keys(errors).map(key => ({ [key]:
          errors[key].map((element)=>({
            message: element
          }))})).reduce((current, prev, {}) => {
          return Object.assign(current, prev);
        });

      this.setState({ errors: errorsReformatted });
    }
  };

  handleCancel = () => {
    const contact = this.state.contact;
    this.props.onCancel(contact);
  };

  handleChange = (fieldName, event) => {
    let newValue = event.target.value;

    if (this.props.onChange) {
      this.props.onChange(fieldName, this.state.contact[fieldName], newValue);
    }

    this.setState({
      contact: {
        ...this.state.contact,
        [fieldName]: newValue
      }
    });
  };

  handleBlur = (fieldName) => {
    const errors = validator(
      this.state.contact, {
        [fieldName]: this.constraints[fieldName]
      }, {
        fullMessages: false
      }
    );

    this.setState({
      errors: {
        ...this.state.errors,
        [fieldName]: errors ?
          errors[fieldName].map(msg => ({ message: msg })) :
          []
      }
    });
  };

  selectOptions = (fieldName, fieldOptions) => {
    let options = [];
    const fieldNameCapitalized = stringHelper.capitalize(fieldName);
    const message = this.context.i18n.getMessage;

    options.push({ value: '', label: message(`Supplier.Select.${fieldName}`), disabled: true });

    for (const option of fieldOptions) {
      options.push({
        value: option,
        label: message(`Supplier.Contact.${fieldNameCapitalized}.${option}`),
        disabled: false
      })
    }

    return options;
  };

  renderField = (attrs) => {
    const { contact, errors } = this.state;
    const { fieldName } = attrs;
    const fieldNames = attrs.fieldNames || [fieldName];

    let component = attrs.component ||
      <input className="form-control"
        type="text"
        value={ typeof contact[fieldName] === 'string' ? contact[fieldName] : '' }
        onChange={ this.handleChange.bind(this, fieldName) }
        onBlur={ this.handleBlur.bind(this, fieldName) }
      />;

    let isRequired = fieldNames.some(name => {
      return this.constraints[name] && this.constraints[name].presence;
    });

    let rowErrors = fieldNames.reduce(
      (rez, name) => rez.concat(errors[name] || []),
      []
    );

    return (
      <SupplierContactEditFormRow
        labelText={ this.context.i18n.getMessage(`Supplier.Contact.Label.${fieldName}`) }
        required={ isRequired }
        rowErrors={ rowErrors }
      >
        { component }
      </SupplierContactEditFormRow>
    );
  };

  render() {
    const { contact } = this.state;

    return (
      <form className="form-horizontal" onSubmit={this.handleSaveOrUpdate}>
        { this.renderField({
            fieldName: 'contactType',
            component: (
              <select className="form-control"
                value={contact['contactType'] || ''}
                onChange={this.handleChange.bind(this, 'contactType')}
                onBlur={this.handleBlur.bind(this, 'contactType')}
              >
                {this.selectOptions('type', CONTACT_TYPES).map((item, index) => {
                  return (<option key={index} disabled={item.disabled} value={item.value}>{item.label}</option>);
                })}
              </select>
            )
          }) }
        { this.renderField({
            fieldName: 'department',
            component: (
              <select className="form-control"
                value={contact['department'] || ''}
                onChange={this.handleChange.bind(this, 'department')}
                onBlur={this.handleBlur.bind(this, 'department')}
              >
                {this.selectOptions('department', DEPARTMENTS).map((item, index) => {
                  return (<option key={index} disabled={item.disabled} value={item.value}>{item.label}</option>);
                })}
              </select>
            )
          }) }
        { this.renderField({ fieldName: 'title' }) }
        { this.renderField({ fieldName: 'firstName' }) }
        { this.renderField({ fieldName: 'lastName' }) }
        { this.renderField({ fieldName: 'email' }) }
        { this.renderField({ fieldName: 'phone' }) }
        { this.renderField({ fieldName: 'mobile' }) }
        { this.renderField({ fieldName: 'fax' }) }
        <div className="col-sm-12 text-right contact-form-submit">
          <ActionButton
            style='link'
            onClick={this.handleCancel}
            label={this.context.i18n.getMessage('Supplier.Button.cancel')}
          />
          <ActionButton
            style='primary'
            type='submit'
            label={this.context.i18n.getMessage('Supplier.Button.save')}
          />
        </div>
      </form>
    );
  }
}

export default SupplierContactEditForm;
