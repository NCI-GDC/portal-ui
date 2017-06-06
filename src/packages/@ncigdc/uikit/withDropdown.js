import React, { Component } from 'react';
import withToggle from './withToggle';

export default function withDropdown(ComposedComponent) {
  class Dropdown extends Component {
    constructor(props) {
      super(props);
      this.state = { mouseIsDownOnComponent: false };
      window.addEventListener('mousedown', this.closeDropdown);
    }

    componentWillUnmount() {
      window.removeEventListener('mousedown', this.closeDropdown);
    }

    closeDropdown = () => {
      if (this.state.mouseIsDownOnComponent) return;
      this.props.setActive(false);
    };

    mouseDownHandler = () => this.setState({ mouseIsDownOnComponent: true });
    mouseUpHandler = () => this.setState({ mouseIsDownOnComponent: false });

    render() {
      return (
        <ComposedComponent
          {...this.state}
          {...this.props}
          mouseDownHandler={this.mouseDownHandler}
          mouseUpHandler={this.mouseUpHandler}
        />
      );
    }
  }

  return withToggle(Dropdown);
}
