import React, {Component} from "react";

class DisplayField extends Component {
  static propTypes = {
    classNames: React.PropTypes.string
  };

  render() {
    return (
      <td className={this.props.classNames || ''}>{ this.props.children }</td>
    );
  }
}

export default DisplayField;
