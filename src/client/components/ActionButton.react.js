import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class ActionButton extends Component {
  static propTypes = {
    action: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    isSmall: PropTypes.bool,
    showIcon: PropTypes.bool
  };

  static defaultProps = {
    isSmall: false,
    showIcon: true
  };

  renderIcon() {
    if (!this.props.showIcon) return null;

    const action = this.props.action;
    const classes = classNames({
      'glyphicon': true,
      'glyphicon-plus': action === 'add',
      'glyphicon-edit': action === 'edit',
      'glyphicon-trash': action === 'delete'
    });
    return (<span className={ classes }></span>);
  }

  render() {
    const buttonClassNames = classNames({
      'btn': true,
      'btn-default': true,
      'btn-sm': this.props.isSmall,
    });

    return (
      <button className={ buttonClassNames } onClick={ this.props.onClick.bind(this) }>
        { this.renderIcon() }
        { this.props.label }
      </button>
    );
  }
};
