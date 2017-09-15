// @flow

// Vendor
import React, { Children } from 'react';
import PropTypes from 'prop-types';
import Color from 'color';
import { css } from 'glamor';
import { withTheme } from '@ncigdc/theme';

// Custom
import { Row, Column } from './Flex';

/*----------------------------------------------------------------------------*/

const borderStyle = theme => `1px solid ${theme.greyScale4}`;

const tabBorder = theme => ({
  borderLeft: borderStyle(theme),
  borderRight: borderStyle(theme),
  borderTop: borderStyle(theme),
});

const baseTabStyle = theme =>
  css({
    padding: '1.2rem 1.8rem',
    fontSize: '1.5rem',
    color: '#000',
    textDecoration: 'none',
    borderTop: '1px solid transparent',
    borderLeft: '1px solid transparent',
    borderBottom: '1px solid transparent',
    borderRight: '1px solid transparent',
    backgroundColor: theme.greyScale6,
    marginBottom: '-1px',
    transition: 'background-color 0.2s ease',
    borderRadius: '4px 4px 0 0',
    cursor: 'pointer',
  });

const styles = {
  active: theme =>
    css({
      backgroundColor: '#fff',
      zIndex: 2,
      ...tabBorder(theme),
      ':hover': {
        backgroundColor: 'white',
      },
    }),
  inactive: theme =>
    css({
      ':hover': {
        textDecoration: 'none',
        color: '#000',
        backgroundColor: Color(theme.greyScale6)
          .darken(0.05)
          .rgbString(),
        ...tabBorder(theme),
      },
    }),
  margin: css({
    marginLeft: '0.4rem',
  }),
  content: theme => ({
    border: borderStyle(theme),
    backgroundColor: '#fff',
  }),
};

const Tab = ({ active, sibling, children, theme, tabStyle = {}, ...props }) => (
  <div
    {...baseTabStyle(theme)}
    {...(active ? styles.active(theme) : styles.inactive(theme))}
    {...(sibling ? styles.margin : {})}
    style={tabStyle}
    {...props}
  >
    {children}
  </div>
);

const Tabs = ({
  style,
  tabs,
  activeIndex,
  children,
  onTabClick,
  side,
  contentStyle,
  theme,
  tabStyle,
  tabToolbar,
  ...props
}) =>
  side ? (
    <Row style={style} flex="1" {...props} className="test-tabs">
      <Column>
        {Children.map(tabs, (child, i) => (
          <Tab
            className="test-tab"
            onClick={() => (onTabClick ? onTabClick(i) : () => {})}
            active={i === activeIndex}
            sibling={i}
            theme={theme}
            tabStyle={tabStyle}
          >
            {child}
          </Tab>
        ))}
      </Column>
      <Column
        style={{ ...styles.content(theme), flex: 1, ...(contentStyle || {}) }}
      >
        {children}
      </Column>
    </Row>
  ) : (
    <Column style={style} className="test-tabs" {...props}>
      <Row style={{ alignItems: 'center' }}>
        {Children.map(tabs, (child, i) => (
          <Tab
            className="test-tab"
            onClick={() => (onTabClick ? onTabClick(i) : () => {})}
            active={i === activeIndex}
            sibling={i}
            theme={theme}
            tabStyle={tabStyle}
          >
            {child}
          </Tab>
        ))}
        {tabToolbar && <span style={{ marginLeft: 'auto' }}>{tabToolbar}</span>}
      </Row>
      <Column style={{ ...styles.content(theme), ...(contentStyle || {}) }}>
        {children}
      </Column>
    </Column>
  );

Tabs.propTypes = {
  children: PropTypes.node,
  activeIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.object,
  tabs: PropTypes.node,
};

/*----------------------------------------------------------------------------*/

export default withTheme(Tabs);
