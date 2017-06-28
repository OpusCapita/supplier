import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Popover from 'react-bootstrap/lib/Popover';
import classNames from 'classnames';
import validator from 'validate.js';
import i18n from '../../i18n/I18nDecorator.react.js';
import './SupplierContactEditForm.css';

import { I18nManager } from 'opuscapita-i18n';
import globalMessages from '../../utils/validatejs/i18n';
const CONTACT_TYPES = ['Default', 'Sales', 'Escalation', 'Product', 'Technical'];
const DEPARTMENTS = ['Management', 'Logistics', 'Sales', 'Accounting', 'Support', 'IT', 'Others'];

/**
 * Supplier contact edit form
 *
 * @author Dmitry Divin
 */
@i18n
class SupplierContactEditForm extends Component {
  static propTypes = {
    contact: React.PropTypes.object.isRequired,
    errors: React.PropTypes.object,
    editMode: React.PropTypes.oneOf(['edit', 'create', 'create-first', 'view']),
    onSave: React.PropTypes.func.isRequired,
    onUpdate: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func.isRequired
  };

  static defaultProps = {
    editMode: 'create',
    errors: {}
  };

  state = {
    contact: this.props.contact,
    errors: this.props.errors || {}
  }

  componentWillReceiveProps(newProps) {
    if (newProps.contact) {
      this.setState({ contact: newProps.contact, errors: newProps.errors || {} });
    }
  }

  validatejsI18N = new I18nManager(this.props.locale, globalMessages)

  constraints = {
    contactType: {
      presence: {
        message: this.validatejsI18N.getMessage('validatejs.blank.message')
      }
    },
    department: {
      presence: {
        message: this.validatejsI18N.getMessage('validatejs.blank.message')
      }
    },
    title: {
      length: {
        maximum: 20,
        tooLong: this.validatejsI18N.getMessage('validatejs.invalid.maxSize.message', {
          limit: 20
        })
      }
    },
    firstName: {
      presence: {
        message: this.validatejsI18N.getMessage('validatejs.blank.message')
      },
      length: {
        maximum: 100,
        tooLong: this.validatejsI18N.getMessage('validatejs.invalid.maxSize.message', {
          limit: 100
        })
      }
    },
    lastName: {
      presence: {
        message: this.validatejsI18N.getMessage('validatejs.blank.message')
      },
      length: {
        maximum: 100,
        tooLong: this.validatejsI18N.getMessage('validatejs.invalid.maxSize.message', {
          limit: 100
        })
      }
    },
    email: {
      presence: {
        message: this.validatejsI18N.getMessage('validatejs.blank.message')
      },
      email: {
        message: this.validatejsI18N.getMessage('validatejs.invalid.email.message')
      },
      length: {
        maximum: 100,
        tooLong: this.validatejsI18N.getMessage('validatejs.invalid.maxSize.message', {
          limit: 100
        })
      }
    },
    phone: {
      length: {
        maximum: 20,
        tooLong: this.validatejsI18N.getMessage('validatejs.invalid.maxSize.message', {
          limit: 20
        })
      }
    },
    mobile: {
      length: {
        maximum: 20,
        tooLong: this.validatejsI18N.getMessage('validatejs.invalid.maxSize.message', {
          limit: 20
        })
      }
    },
    fax: {
      length: {
        maximum: 20,
        tooLong: this.validatejsI18N.getMessage('validatejs.invalid.maxSize.message', {
          limit: 20
        })
      }
    }
  }

  /**
   * On Save or Update local handler
   */
  handleSaveOrUpdate = (event) => {
    event.preventDefault();

    const contact = this.state.contact;
    let errors = validator(this.state.contact, this.constraints, { fullMessages: false });
    if (!errors) {
      const editMode = this.props.editMode;

      if (editMode === 'edit') {
        this.props.onUpdate(contact);
      } else {
        this.props.onSave(contact);
      }
    } else {
      this.setState({ errors: errors });
    }
  };

  handleCancel = () => {
    const contact = this.state.contact;
    this.props.onCancel(contact);
  };

  fieldRender(tagClass, tagProps, child) {
    const name = tagProps.name;
    /* eslint-disable no-param-reassign*/
    tagProps.className = 'form-control';
    tagProps.id = name;

    const required = tagProps.required;

    if (required) {
      delete tagProps.required;
    }
    /* eslint-enable no-param-reassign*/

    let labelValue = this.context.i18n.getMessage(`SupplierContactEditor.Label.${name}`);

    /* eslint-disable no-param-reassign*/
    let tooltipOverlay;
    if (tagProps.tooltip) {
      tooltipOverlay = (<Popover id={'tooltip-' + name} title={labelValue}>{tagProps.tooltip}</Popover>);
      delete tagProps.tooltip;
    }

    tagProps.value = this.state.contact[name] || '';


    tagProps.onChange = (event) => {
      let newValue = event.target.value;
      let contact = this.state.contact;


      let oldValue = contact[name];
      contact[name] = newValue;

      if (oldValue !== newValue) {
        this.props.onChange(contact, name, oldValue, newValue);
      }

      this.setState({ contact: contact });// eslint-disable-line no-param-reassign
    };

    tagProps.onBlur = (event) => {
      let fieldName = event.target.name;
      const errors = this.state.errors || {};

      let fieldConstraints = {};
      fieldConstraints[fieldName] = this.constraints[fieldName];
      let fieldErrors = validator(this.state.contact, fieldConstraints, { fullMessages: false });
      if (fieldErrors) {
        errors[fieldName] = fieldErrors[fieldName];
      } else {
        delete errors[fieldName];
      }
      this.setState({ errors: errors });
    };
    /* eslint-enable no-param-reassign*/

    const element = React.createElement(tagClass, tagProps, child);

    let errors = this.state.errors || {};
    let errorMessages = errors[name] || [];
    let labelClassNames = {
      'control-label': true
    };
    labelClassNames[`col-sm-${(tooltipOverlay ? 3 : 4)}`] = true;

    if (required) {
      let lastWord = labelValue.substring(labelValue.lastIndexOf(' ') + 1, labelValue.length);
      labelValue = (
        <span>
          {labelValue.replace(lastWord, '')}<span><nobr>{lastWord} *</nobr></span>
        </span>
      );
    }

    return (
      <div className={classNames({ 'form-group': true, 'has-error': errorMessages.length > 0 })}>
        <label htmlFor={name} className={classNames(labelClassNames)}>
          {labelValue}
        </label>

        {tooltipOverlay ? (
          <div className="col-sm-1 text-right">
            <OverlayTrigger trigger="click" placement="bottom" overlay={tooltipOverlay} rootClose={true}>
              <i className="glyphicon glyphicon-info-sign text-muted form-control-static contact-info-sign" />
            </OverlayTrigger>
          </div>
        ) : null}

        <div className="col-sm-8">{element}</div>
        {errorMessages.map((errorMessage, index) => {
          return (
            <div key={'error-' + name + '-' + index} className="col-sm-offset-4 col-sm-8">
              <span className="label label-danger">{errorMessage}</span>
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const editMode = this.props.editMode;

    let message = this.context.i18n.getMessage;

    let typeOptions = [];

    typeOptions.push({
      value: '',
      label: message('SupplierContactEditor.Select.type'),
      disabled: true
    });

    for (let i = 0; i < CONTACT_TYPES.length; i++) {
      let type = CONTACT_TYPES[i];

      typeOptions.push({
        value: type,
        label: message(`SupplierContactEditor.ContactType.${type}`)
      })
    }

    let departmentOptions = [];

    departmentOptions.push({
      value: '',
      label: message('SupplierContactEditor.Select.department'),
      disabled: true
    });

    for (let i = 0; i < DEPARTMENTS.length; i++) {
      let department = DEPARTMENTS[i];

      departmentOptions.push({
        value: department,
        label: message(`SupplierContactEditor.Department.${department}`)
      })
    }

    return (
      <form className="form-horizontal" onSubmit={this.handleSaveOrUpdate}>

        {this.fieldRender('select', {
          name: 'contactType',
          tooltip: message('SupplierContactEditor.Tooltip.contactType'),
          required: true,
          disabled: (editMode === 'view')
        }, (
          typeOptions.map((item, index) => {
            return (<option key={'contact-type-' + index} value={item.value}
              disabled={item.disabled}
            >{item.label}</option>)
          })
        ))}

        {this.fieldRender('select', {
          name: 'department',
          required: true,
          disabled: (editMode === 'view')
        }, (
          departmentOptions.map((item, index) => {
            return <option key={'department-' + index} value={item.value} disabled={item.disabled}>{item.label}</option>
          })
        ))}

        {this.fieldRender('input', {
          name: 'title',
          disabled: (editMode === 'view')
        })}

        {this.fieldRender('input', {
          name: 'firstName',
          disabled: (editMode === 'view'),
          required: true
        })}

        {this.fieldRender('input', {
          name: 'lastName',
          disabled: (editMode === 'view'),
          required: true
        })}

        {this.fieldRender('input', {
          name: 'phone',
          disabled: (editMode === 'view')
        })}

        {this.fieldRender('input', {
          name: 'mobile',
          disabled: (editMode === 'view')
        })}

        {this.fieldRender('input', {
          name: 'fax',
          disabled: (editMode === 'view')
        })}

        {this.fieldRender('input', {
          name: 'email',
          tooltip: message('SupplierContactEditor.Tooltip.email'),
          disabled: (editMode === 'view'),
          required: true,
        })}

        <div className="col-sm-12 text-right contact-form-submit">
          {editMode !== 'create-first' ? (
            <Button bsStyle="link"
              onClick={this.handleCancel}
            >
            {this.context.i18n.getMessage('SupplierContactEditor.Button.' + (editMode === 'view' ? 'close' : 'cancel'))}
            </Button>
          ) : null}
          {editMode !== 'view' ? (
            <Button bsStyle="primary"
              type="submit"
            >{this.context.i18n.getMessage('SupplierContactEditor.Button.save')}</Button>
          ) : null}
        </div>
      </form>
    );
  }
}

export default SupplierContactEditForm;
