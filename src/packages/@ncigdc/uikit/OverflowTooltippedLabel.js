// @flow
import React from 'react';
import { compose, withState } from 'recompose';

import withTooltip from '@ncigdc/uikit/Tooltip/withTooltip';

const OverflowTooltippedLabel = compose(
  withTooltip,
  withState('hasTooltip', 'setHasTooltip', false),
)(
  class extends React.Component {
    render() {
      const {
        setHasTooltip,
        hasTooltip,
        children,
        style,
        htmlFor,
        props,
        setTooltip,
      } = this.props;
      return (
        <label
          style={{
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            minWidth: 0,
            overflow: 'hidden',
            padding: '0 0.25rem',
            ...style,
          }}
          ref={el => {
            if (!hasTooltip && el) {
              if (el.clientWidth < el.scrollWidth) {
                setHasTooltip(true);
              }
            }
          }}
          onMouseOver={() => hasTooltip && setTooltip(children)}
          onMouseOut={() => hasTooltip && setTooltip()}
          htmlFor={htmlFor}
          {...props}
        >
          {children}
        </label>
      );
    }
  },
);

export default OverflowTooltippedLabel;
