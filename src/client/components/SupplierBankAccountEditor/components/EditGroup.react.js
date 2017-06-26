import React, {Component} from "react";
import Button from "react-bootstrap/lib/Button";
import i18n from "../../../i18n/I18nDecorator.react";
import DisplayField from '../../DisplayTable/DisplayField.react.js';

@i18n
class EditGroup extends Component {
  render() {
    return (<DisplayField>
      <Button bsSize="sm">
        <span className="glyphicon glyphicon-edit"/>&nbsp;
        {this.context.i18n.getMessage('SupplierBankAccountEditor.Button.edit')}
      </Button>
      <Button bsSize="sm">
        <span className="glyphicon glyphicon-trash"/>&nbsp;
        {this.context.i18n.getMessage('SupplierBankAccountEditor.Button.delete')}
      </Button>
    </DisplayField>)
  }
}

export default EditGroup;