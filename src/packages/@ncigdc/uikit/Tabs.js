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

const tabBorder = (theme, side) => ({
  borderLeft: borderStyle(theme),
  borderRight: !side && borderStyle(theme),
  borderTop: borderStyle(theme),
  borderBottom: side && borderStyle(theme),
});

const baseTabStyle = (theme, side) =>
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
    marginBottom: !side && '-1px',
    marginRight: side && '-1px',
    transition: 'background-color 0.2s ease',
    borderRadius: side ? '4px 0 0 4px' : '4px 4px 0 0',
    cursor: 'pointer',
    overflow: 'hidden',
  });

const styles = {
  active: (theme, side) =>
    css({
      backgroundColor: '#fff',
      ...tabBorder(theme, side),
      position: 'relative',
      left: '0px',
      zIndex: 2,
      ':hover': {
        backgroundColor: 'white',
      },
    }),
  inactive: (theme, side) =>
    css({
      ':hover': {
        textDecoration: 'none',
        color: '#000',
        backgroundColor: Color(theme.greyScale6)
          .darken(0.05)
          .rgbString(),
        ...tabBorder(theme, side),
      },
    }),
  margin: side =>
    css({
      marginLeft: !side && '0.4rem',
      marginTop: side && '0.4rem',
    }),
  content: theme => ({
    border: borderStyle(theme),
    backgroundColor: '#fff',
  }),
};

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
    <Row style={style} {...props} className="test-tabs">
      <Column>
        <div
          style={{
            maxHeight: '550px',
            minWidth: '190px',
            overflowY: 'scroll',
            overflowX: 'hidden',
            msOverflowStyle: 'none',
            backgroundColor: 'white',
            position: 'relative',
            left: '1px',
          }}
        >
          {Children.map(tabs, (child, i) => (
            <Tab
              className="test-tab"
              onClick={() => (onTabClick ? onTabClick(i) : () => {})}
              active={i === activeIndex}
              sibling={i}
              theme={theme}
              tabStyle={tabStyle}
              side
            >
              {child}
            </Tab>
          ))}
        </div>
        {tabToolbar}
      </Column>
      <Column
        style={{
          ...styles.content(theme),
          flex: 1,
          width: 1,
          ...(contentStyle || {}),
        }}
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
            side={false}
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
