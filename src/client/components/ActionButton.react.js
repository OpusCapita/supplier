import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class ActionButton extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    style: PropTypes.string,
    type: PropTypes.string,
    action: PropTypes.string,
    isSmall: PropTypes.bool,
    showIcon: PropTypes.bool
  };

  static defaultProps = {
    isSmall: false,
    showIcon: false,
    style: 'default',
    type: 'button'
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
    const { style, type } = this.props;
    const buttonClassNames = classNames({
      'btn': true,
      'btn-default': style === 'default',
      'btn-primary': style === 'primary',
      'btn-link': style === 'link',
      'btn-sm': this.props.isSmall,
    });

    return (
      <button className={buttonClassNames} onClick={this.props.onClick.bind(this)} type={type}>
        { this.renderIcon() }
        { this.props.label }
      </button>
    );
  }
};
