import React, { PropTypes, Component } from 'react';
import validator from "validate.js";
import AttributeValueEditorRow from '../AttributeValueEditorRow.react.js';
import { Supplier } from '../../api';

class SupplierAccessRequestForm extends Component {
  static propTypes = {
    supplierAttributes: PropTypes.object.isRequired,
    onCreateSupplierAccess: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = { supplier: {}, accessReason: '', fieldErrors: {} };
    this.supplierApi = new Supplier();
  }

  componentWillMount() {
    this.constraints = {
      accessReason: {
        presence: {
          message: this.context.i18n.getMessage('SupplierValidatejs.blank.message')
        }
      }
    };
  }

  componentDidMount() {
    this.supplierApi.searchSupplier(this.props.supplierAttributes).then(supplier => {
      this.setState({ supplier: supplier });
    }).catch(error => null);
  }

  setFieldErrorsState = (errors) => {
    this.setState({
      fieldErrors: {
        ...this.state.fieldErrors,
        accessReason: errors ? errors.accessReason.map(msg => ({ message: msg })) : []
      }
    });
  };

  handleBlur = () => {
    const errors = validator({ accessReason: this.state.accessReason }, this.constraints, { fullMessages: false });
    this.setFieldErrorsState(errors);
  };

  handleChange = (event) => {
    this.setState({ accessReason: event.target.value });
  };

  handleCancel = (event) => {
    event.preventDefault();
    this.props.onCancel();
  };

  handleCreate = (event) => {
    event.preventDefault();

    const { accessReason, supplier } = this.state;

    const supplierAccess = { accessReason: accessReason, supplierId: supplier.id };
    const errors = validator(supplierAccess, this.constraints, { fullMessages: false });
    this.setFieldErrorsState(errors);

    if (!errors) this.props.onCreateSupplierAccess(supplierAccess, supplier);
  };

  renderField = (attrs) => {
    const { fieldErrors } = this.state;
    const { isRequired, component, fieldName } = attrs;
    const fieldNames = [fieldName];

    let rowErrors = fieldNames.reduce((rez, name) => rez.concat(fieldErrors[name] || []), []);

    return (
      <AttributeValueEditorRow
        labelText={ this.context.i18n.getMessage(`SupplierRegistrationEditor.Label.${fieldName}`) }
        required={ isRequired || false }
        rowErrors={ rowErrors }
      >
        { component }
      </AttributeValueEditorRow>
    );
  };

  render() {
    const { accessReason, supplier } = this.state;

    if (!supplier.id) {
      return null;
    }

    return (
      <div className="row">
        <div className="col-md-8">
          <form className="form-horizontal">
            <div className="row">
              <div className="col-md-12">
                { this.renderField({ fieldName: 'name', component: <p>{supplier.name}</p>}) }
                { this.renderField({
                  fieldName: 'accessReason',
                  isRequired: true,
                  component: (
                    <textarea
                      className="form-control"
                      value={accessReason}
                      onChange={this.handleChange.bind(this)}
                      onBlur={this.handleBlur.bind(this)}
                    />
                  )
                }) }
                <div className='supplier-registration-form-submit'>
                  <div className='text-right form-submit'>
                    <button className="btn btn-link" onClick={this.handleCancel}>
                      {this.context.i18n.getMessage('SupplierRegistrationEditor.ButtonLabel.cancel')}
                    </button>
                    <button className="btn btn-primary" onClick={ this.handleCreate }>
                      {this.context.i18n.getMessage('SupplierRegistrationEditor.ButtonLabel.request')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="col-md-4">
          <p>{this.context.i18n.getMessage('SupplierRegistrationEditor.Messages.accessInformation1', { name: supplier.name })}</p>
          <p>{this.context.i18n.getMessage('SupplierRegistrationEditor.Messages.accessInformation2')}</p>
          <p>{this.context.i18n.getMessage('SupplierRegistrationEditor.Messages.accessInformation3')}</p>
          <p>{this.context.i18n.getMessage('SupplierRegistrationEditor.Messages.accessInformation4')}</p>
        </div>
      </div>
    );
  }
}

export default SupplierAccessRequestForm;
