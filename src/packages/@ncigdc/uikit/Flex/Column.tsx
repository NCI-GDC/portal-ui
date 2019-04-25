import React, { Children, cloneElement, ReactElement } from 'react';
import Row, { IFlexDivProps } from './Row';

/*----------------------------------------------------------------------------*/

const Column: React.SFC<IFlexDivProps> = ({
  style,
  children,
  spacing,
  ...props
}) => (
  <Row
    style={{
      ...style,
      flexDirection: 'column',
    }}
    {...props}>
    {!spacing && children}
    {spacing &&
      Children.map(
        children,
        (child: ReactElement<any>, i) => child &&
          cloneElement(child, {
            ...child.props,
            style: {
              ...i ? { marginTop: spacing } : {},
              ...child.props.style ? child.props.style : {},
            },
          })
      )}
  </Row>
);

export default Column;
