import React, {Component} from "react";

class DisplayRow extends Component {

  render() {
    return (
      <td>{ this.props.children }</td>
    );
  }
}

export default DisplayRow;
