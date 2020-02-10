import React from 'react';
import { css } from 'glamor';
import Color from 'color';

export const borderStyle = theme => `1px solid ${theme.greyScale4}`;

const tabBorder = (theme, side) => ({
  borderBottom: side && borderStyle(theme),
  borderLeft: borderStyle(theme),
  borderRight: !side && borderStyle(theme),
  borderTop: borderStyle(theme),
});

const styles = {
  active: (theme, side) => css({
    backgroundColor: '#fff',
    ...tabBorder(theme, side),
    ':hover': {
      backgroundColor: 'white',
    },
    left: '0px',
    position: 'relative',
    zIndex: 2,
  }),
  content: theme => ({
    backgroundColor: '#fff',
    border: borderStyle(theme),
  }),
  inactive: (theme, side) => css({
    ':hover': {
      backgroundColor: Color(theme.greyScale6)
        .darken(0.05)
        .rgbString(),
      color: '#000',
      ...tabBorder(theme, side),
      textDecoration: 'none',
    },
  }),
  margin: side => css({
    marginLeft: !side && '0.4rem',
    marginTop: side && '0.4rem',
  }),
};

const baseTabStyle = (theme, side) => css({
  backgroundColor: theme.greyScale6,
  borderBottom: '1px solid transparent',
  borderLeft: '1px solid transparent',
  borderRadius: side ? '4px 0 0 4px' : '4px 4px 0 0',
  borderRight: '1px solid transparent',
  borderTop: '1px solid transparent',
  color: '#000',
  cursor: 'pointer',
  fontSize: '1.5rem',
  marginBottom: !side && '-1px',
  marginRight: side && '-1px',
  overflow: 'hidden',
  padding: '1.2rem 1.8rem',
  textDecoration: 'none',
  transition: 'background-color 0.2s ease',
});

const Tab = ({
  active,
  sibling,
  children,
  theme,
  tabStyle = {},
  side,
  ...props
}) => (
  <div
    {...baseTabStyle(theme, side)}
    {...(active ? styles.active(theme, side) : styles.inactive(theme, side))}
    {...(sibling ? styles.margin(side) : {})}
    style={tabStyle}
    {...props}
    >
    {children}
  </div>
);

export default Tab;
