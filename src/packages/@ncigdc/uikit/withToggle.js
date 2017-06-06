import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default function withToggle(ComposedComponent) {
  return class Toggle extends Component {
    static propTypes = {
      // Allow active state changes to trigger actions such as toggling relay variables
      onActivate: PropTypes.func,
      onDeactivate: PropTypes.func,
      active: PropTypes.bool,
    };

    static defaultProps = {
      onActivate: () => {},
      onDeactivate: () => {},
      active: false,
    };

    constructor(props) {
      super(props);
      this.state = { active: props.active };
    }

    setActive = (active: boolean): void => {
      this.setState({ active });
      if (active) {
        this.props.onActivate();
      } else {
        this.props.onDeactivate();
      }
    };

    toggleActive = (): void => this.setActive(!this.state.active);

    render() {
      return (
        <ComposedComponent
          {...this.state}
          {..._.omit(this.props, Object.keys(Toggle.defaultProps))}
          setActive={this.setActive}
          toggleActive={this.toggleActive}
        />
      );
    }
  };
}
