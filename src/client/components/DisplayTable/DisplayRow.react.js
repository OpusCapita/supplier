import React, {Component} from "react";
import i18n from "../../i18n/I18nDecorator.react.js";

@i18n
class DisplayRow extends Component {

  render() {
    return (
      <tr>{ this.props.children }</tr>
    );
  }
}

export default DisplayRow;