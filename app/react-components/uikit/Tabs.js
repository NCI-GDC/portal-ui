// Vendor
import React, { Children, PropTypes } from 'react';
import Color from 'color';
import { css } from 'glamor';

// Custom
import { Row, Column } from './Flex';
import theme from '../theme';

/*----------------------------------------------------------------------------*/

const borderStyle = `1px solid ${theme.greyScale4}`;

const tabBorder = {
  borderLeft: borderStyle,
  borderRight: borderStyle,
  borderTop: borderStyle,
};

const baseTabStyle = css({
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
  active: css({
    ...baseTabStyle,
    backgroundColor: '#fff',
    zIndex: 2,
    ...tabBorder,
    ':hover': {
      backgroundColor: 'white',
    },
  }),
  inactive: css({
    ':hover': {
      textDecoration: 'none',
      color: '#000',
      backgroundColor: Color(theme.greyScale6).darken(0.05).rgbString(),
      ...tabBorder,
    },
  }),
  margin: css({
    marginLeft: '0.4rem',
  }),
  content: {
    border: borderStyle,
    backgroundColor: '#fff',
  },
};

const Tab = ({ active, sibling, children, ...props }) => (
  <div
    {...baseTabStyle}
    {...(active ? styles.active : styles.inactive)}
    {...(sibling ? styles.margin : {})}
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
  ...props,
}) => (
  side ?
    <Row style={style} flex="1" {...props}>
      <Column>
        {Children.map(tabs, (child, i) =>
          <Tab
            onClick={() => onTabClick ? onTabClick(i) : (() => {})}
            active={i === activeIndex}
            sibling={i}
          >
            {child}
          </Tab>
        )}
      </Column>
      <Column style={{ ...styles.content, flex: 1, ...(contentStyle || {}) }}>{children}</Column>
    </Row>
  :
    <Column style={style} {...props}>
      <Row>
        {Children.map(tabs, (child, i) =>
          <Tab
            onClick={() => onTabClick ? onTabClick(i) : (() => {})}
            active={i === activeIndex}
            sibling={i}
          >
            {child}
          </Tab>
        )}
      </Row>
      <Column style={{ ...styles.content, ...(contentStyle || {}) }}>{children}</Column>
    </Column>
);


Tabs.propTypes = {
  children: PropTypes.node,
  activeIndex: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  style: PropTypes.object,
  tabs: PropTypes.node,
};

/*----------------------------------------------------------------------------*/

export default Tabs;
