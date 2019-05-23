import React from 'react';
import Button from '@ncigdc/uikit/Button';
import Overlay from '@ncigdc/uikit/Overlay';
import Spinner from '@ncigdc/uikit/Loaders/Material';

export default class SetActionButton extends React.Component {
  clicked = false;

  UNSAFE_componentWillReceiveProps(next) {
    if (next.forceClick && !this.clicked) {
      const { createSet } = this.props;
      this.clicked = true;
      createSet(this.props);
    }
  }

  render() {
    const {
      style,
      children,
      disabled,
      createSet,
      leftIcon,
      id,
      onClick = () => {},
      Component = Button,
      displaySpinnerOverlay = true,
      ...props
    } = this.props;
    return (
      <span>
        <Overlay show={displaySpinnerOverlay && props.isCreating}>
          <Spinner />
        </Overlay>
        <Component
          disabled={disabled}
          leftIcon={leftIcon}
          onClick={() => {
            onClick();
            createSet(props);
          }}
          style={style}
          >
          {children}
        </Component>
      </span>
    );
  }
}
