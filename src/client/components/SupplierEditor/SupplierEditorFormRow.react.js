import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

/**
 * Provides skeleton for displaying label and input field of ane types.
 */
export default class AttributeValueEditorRow extends Component {
  static propTypes = {
    labelText: PropTypes.string.isRequired,
    required: PropTypes.bool,
    rowErrors: PropTypes.array,
    isOnboarding: PropTypes.bool
  };

  static defaultProps = {
    required: false,
    rowErrors: [],
  };

  render() {
    const { required, rowErrors, isOnboarding } = this.props;
    let labelText = this.props.labelText;

    if (required) {
      labelText += '\u00a0*';
    }

    return (
      <div
        className={classNames({
          'form-group': true,
          'has-error': !!rowErrors.length
        })}
      >
        <label className={`col-sm-${isOnboarding ? '4' : '2'} control-label`}>
          {labelText}
        </label>

        <div className={`col-sm-${isOnboarding ? '8' : '4'}`}>
          { this.props.children }

          {rowErrors.map((error, index) =>
            <div key={index}>
              <span className="label label-danger">{ error.message }</span>
            </div>
          )}
        </div>
      </div>
    );
  }
}
