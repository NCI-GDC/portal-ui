import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '@ncigdc/theme';
import { Row, Column } from './Flex';
import Tab, { borderStyle } from './Tab';

const styles = {
  content: theme => ({
    backgroundColor: '#fff',
    border: borderStyle(theme),
  }),
};

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
      <Column>
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
            ...tabs.length === 0 &&
              { display: 'none' },
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
          overflow: 'auto',
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
