import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import ActionButton from './ActionButton.react';

/**
 * Provides skeleton for displaying label and input field of ane types.
 */
export default class AttributeValueEditorRow extends Component {

  static propTypes = {
    labelText: PropTypes.string.isRequired,
    required: PropTypes.bool,
    rowErrors: PropTypes.array,
    onErrorLinkClick: PropTypes.func,
    marked: PropTypes.bool,
    marked3: PropTypes.bool
  };

  static defaultProps = {
    required: false,
    marked: false,
    marked3: false,
    rowErrors: [],
  };

  errorStyles() {
    return {
      marginBottom: '0px',
      padding: '6px',
      border: '0px'
    }
  }

  labelTextString() {
    const { marked, marked3, required, labelText } = this.props;

    if (required) return labelText + '\u00a0*';
    if (marked) return labelText + '\u00a0**';
    if (marked3) return labelText + '\u00a0***';

    return labelText;
  }

  handleOnClick(error, event) {
    event.preventDefault();
    this.props.onErrorLinkClick(error);
  }

  renderButtonLink(error) {
    if (!error.hasLink) return null;

    return <ActionButton onClick={this.handleOnClick.bind(this, error)} label={error.linkMessage} isSmall={true} />;
  }

  render() {
    const { rowErrors } = this.props;

    return (
      <div
        className={classNames({
          'form-group': true,
          'has-error': !!rowErrors.length
        })}
      >
        <label className={`col-sm-4 control-label`}>
          {this.labelTextString()}
        </label>

        <div className={`col-sm-8`}>
          { this.props.children }

          {rowErrors.map((error, index) =>
            <div className="alert alert-danger" key={index} style={this.errorStyles()}>
              <p>{ error.message }</p>
              {this.renderButtonLink(error)}
            </div>
          )}
        </div>
      </div>
    );
  }
}
