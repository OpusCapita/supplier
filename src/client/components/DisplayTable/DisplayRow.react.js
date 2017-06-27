import React, {Component} from "react";

class DisplayField extends Component {

  render() {
    return (
      <tr>{ this.props.children }</tr>
    );
  }
}

export default DisplayField;
