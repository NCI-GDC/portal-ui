
import React from 'react';

const styles = {
  td: {
    padding: '3px',
    whiteSpace: 'nowrap',
  },
};

interface ITdProps {
  children: React.ReactNode;
  style?: any;
}

export type TTd = (props: ITdProps) => JSX.Element;

const Td: TTd = ({ style, children, ...props }) => (
  <td
    style={{
      ...styles.td,
      ...style,
    }}
    {...props}>
    {children}
  </td>
);

export default Td;
