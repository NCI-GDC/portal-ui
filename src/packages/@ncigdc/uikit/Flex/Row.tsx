import React, {
  Children,
  cloneElement,
  ComponentType,
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

export interface IFlexDivProps {
  children: any;
  flex?: string;
  wrap?: string;
  style?: CSSProperties;
  spacing?: string;
  className?: string;
}

const Row: ComponentType<IFlexDivProps> = ({
  flex,
  wrap,
  style,
  spacing,
  children,
  className,
  ...props
}) => (
  <div
    style={{
      ...baseStyle,
      flex,
      ...wrap ? { flexWrap: 'wrap' } : {},
      ...style,
    }}
    className={className}
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
