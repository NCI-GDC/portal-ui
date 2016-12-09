import React, { Component, PropTypes } from 'react';

export default function withToggle(ComposedComponent) {
  return class Toggle extends Component {
    constructor(props) {
      super(props);
      this.state = { active: props.active || false };
    }

    setActive = (active: boolean): void => this.setState({ active });
    toggleActive = (): void => this.setState({ active: !this.state.active });

    render() {
      return (
        <ComposedComponent
          {...this.state}
          {...this.props}
          setActive={this.setActive}
          toggleActive={this.toggleActive}
        />
      );
    }
  };
}
