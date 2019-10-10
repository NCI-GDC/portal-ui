import React, { Component } from 'react';
import withToggle from './withToggle';

export default function withDropdown(ComposedComponent) {
  class Dropdown extends Component {
    closeDropdown = e => {
      if (!(e.target.id && e.target.id === this.props.fieldNoDoctype)) {
        this.props.setActive(false);
      }
    };

    constructor(props) {
      super(props);

      if (props.active) {
        window.addEventListener('click', this.closeDropdown);
      }
    }

    componentWillUnmount() {
      window.removeEventListener('click', this.closeDropdown);
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.active !== this.props.active) {
        if (nextProps.active) {
          setTimeout(
            () => window.addEventListener('click', this.closeDropdown), // timeout to add listener outside of click events
          );
        } else {
          window.removeEventListener('click', this.closeDropdown);
        }
      }
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  return withToggle(Dropdown);
}
