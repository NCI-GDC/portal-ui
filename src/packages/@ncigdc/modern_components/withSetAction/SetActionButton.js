import React from 'react';
import Button from '@ncigdc/uikit/Button';
import Overlay from '@ncigdc/uikit/Overlay';
import Spinner from '@ncigdc/uikit/Loaders/Material';

export default class extends React.Component {
  clicked = false;
  componentWillReceiveProps(next) {
    if (next.forceClick && !this.clicked) {
      this.clicked = true;
      this.props.createSet(this.props);
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
          style={style}
          onClick={() => {
            onClick();
            createSet(props);
          }}
          leftIcon={leftIcon}
        >
          {children}
        </Component>
      </span>
    );
  }
}
