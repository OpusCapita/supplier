import React, {Component} from "react";

class DisplayField extends Component {

  render() {
    return (
      <td className={this.props.className || ''}>{ this.props.children }</td>
    );
  }
}

export default DisplayField;
