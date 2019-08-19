import React, { Children } from 'react';
import PropTypes from 'prop-types';
import Color from 'color';
import { css } from 'glamor';
import { withTheme } from '@ncigdc/theme';
import { Row, Column } from './Flex';

const borderStyle = theme => `1px solid ${theme.greyScale4}`;

const tabBorder = (theme, side) => ({
  borderBottom: side && borderStyle(theme),
  borderLeft: borderStyle(theme),
  borderRight: !side && borderStyle(theme),
  borderTop: borderStyle(theme),
});

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
  activeIndex,
  children,
  contentStyle = {},
  onTabClick,
  side,
  style = {},
  tabContainerStyle = {},
  tabStyle = {},
  tabToolbar,
  tabs,
  theme,
  ...props
}) => (side
  ? (
    <Row className="test-tabs" style={style} {...props}>
      <Column style={tabs.length ? {} : { display: 'none' }}>
        <div
          style={{
            backgroundColor: 'white',
            left: '1px',
            maxHeight: '550px',
            minWidth: '190px',
            msOverflowStyle: 'none',
            overflowX: 'hidden',
            overflowY: 'auto',
            position: 'relative',
            ...tabContainerStyle,
          }}
          >
          {Children.map(tabs, (child, i) => (
            <Tab
              active={i === activeIndex}
              className="test-tab"
              onClick={() => (onTabClick ? onTabClick(i) : () => {})}
              sibling={i}
              side
              tabStyle={tabStyle}
              theme={theme}
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
    <Column className="test-tabs" style={style} {...props}>
      <Row style={{ alignItems: 'center' }}>
        {Children.map(tabs, (child, i) => (
          <Tab
            active={i === activeIndex}
            className="test-tab"
            onClick={() => (onTabClick ? onTabClick(i) : () => {})}
            sibling={i}
            side={false}
            tabStyle={tabStyle}
            theme={theme}
            >
            {child}
          </Tab>
        ))}
        {tabToolbar && <span style={{ marginLeft: 'auto' }}>{tabToolbar}</span>}
      </Row>
      <Column
        style={{
          ...styles.content(theme),
          ...(contentStyle || {}),
        }}
        >
        {children}
      </Column>
    </Column>
  ));

Tabs.propTypes = {
  activeIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node,
  style: PropTypes.object,
  tabs: PropTypes.node,
};

export default withTheme(Tabs);
