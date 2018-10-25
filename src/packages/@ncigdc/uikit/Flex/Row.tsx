import React, {
  Children,
  cloneElement,
  CSSProperties,
  ReactElement,
} from 'react';

const baseStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  boxSizing: 'border-box',
  position: 'relative',
  outline: 'none',
};

const Row = ({
  flex,
  wrap,
  style,
  spacing,
  children,
  className,
  ...props
}: {
  flex?: string;
  wrap?: string;
  style?: CSSProperties;
  spacing?: string;
  className?: string;
  children: any;
}) => (
  <div
    style={{
      ...baseStyle,
      flex,
      ...wrap ? { flexWrap: 'wrap' } : {},
      ...style,
    }}
    {...props}
  >
    {!spacing && children}
    {spacing &&
      Children.map(
        children,
        (child: ReactElement<any>, i) =>
          child &&
          cloneElement(child, {
            ...child.props,
            style: {
              ...i ? { marginLeft: spacing } : {},
              ...child.props.style ? child.props.style : {},
            },
          })
      )}
  </div>
);

export default Row;
