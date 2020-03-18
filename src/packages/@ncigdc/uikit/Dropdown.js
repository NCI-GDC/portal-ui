// @flow

import React from 'react';
import withRouter from '@ncigdc/utils/withRouter';
import DownCaretIcon from 'react-icons/lib/fa/caret-down';
import * as styles from '@ncigdc/theme/mixins';
import withDropdown from './withDropdown';
import { Row, Column } from './Flex';

const Dropdown = ({
  active,
  activeStyle = {},
  autoclose = true,
  basePath = '',
  button = null,
  children,
  className = '',
  dropdownClassName = 'dropdown-items',
  dropdownStyle = {},
  isDisabled = false,
  location: { pathname = '' },
  selected,
  setActive,
  style,
}) => (
  <span
    className={`dropdown${
      active ? ' active' : ''}${
      className ? `${className} ` : ''
    }`}
    style={{
      position: 'relative',
      ...style,
    }}
    >
    <span onClick={e => !isDisabled && setActive(!active)}>
      {button
        ? React.cloneElement(button, {
          className: `${button.props.className}${active ? ' dropdown-active' : ''}`,
          style: {
            ...button.props.style,
            ...pathname.toLowerCase().includes(basePath.toLowerCase()) && activeStyle,
          },
        })
        : (
          <Row style={styles.dropdownButton}>
            <span>{selected}</span>
            <DownCaretIcon style={{ marginLeft: 'auto' }} />
          </Row>
        )}
    </span>

    {active && (
      <Column
        className={dropdownClassName}
        onClick={e => !autoclose && e.stopPropagation()}
        style={{
          ...styles.dropdown,
          ...dropdownStyle,
        }}
        >
        {children}
      </Column>
    )}
  </span>
);

export default withRouter(withDropdown(Dropdown));
