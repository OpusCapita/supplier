import React, {Component} from "react";
import Button from "react-bootstrap/lib/Button";
import '../../DisplayTable/DisplayField.react.js';
import DisplayField from '../../DisplayTable/DisplayField.react.js';

class ViewGroup extends Component {

  static propTypes = {
    viewAction: React.PropTypes.func,
    viewLabel: React.PropTypes.string
  };

  static defaultProps = {
    viewAction: () => { console.warn('viewAction not provided')}
  };

  render() {
    return (<DisplayField><Button bsSize="sm">
      <span className='glyphicon glyphicon-eye-open'/>&nbsp;
      { this.props.viewLabel }
    </Button></DisplayField>)
  }
}

export default ViewGroup;
