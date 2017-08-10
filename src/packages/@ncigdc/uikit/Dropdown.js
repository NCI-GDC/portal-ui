// @flow

import React from 'react';
import DownCaretIcon from 'react-icons/lib/fa/caret-down';
import * as styles from '@ncigdc/theme/mixins';
import withDropdown from './withDropdown';
import { Row, Column } from './Flex';

const Dropdown = ({
  style,
  selected,
  active,
  setActive,
  children,
  dropdownStyle = {},
  dropdownClassName = '',
  button = null,
  isDisabled = false,
  autoclose = true,
  className,
}) =>
  <span
    style={{ position: 'relative', ...style }}
    className={className + ' dropdown'}
  >
    <span onClick={e => !isDisabled && setActive(!active)}>
      {button ||
        <Row style={styles.dropdownButton}>
          <span>{selected}</span>
          <DownCaretIcon style={{ marginLeft: 'auto' }} />
        </Row>}
    </span>
    {active &&
      <Column
        className={dropdownClassName}
        style={{ ...styles.dropdown, ...dropdownStyle }}
        onClick={e => !autoclose && e.stopPropagation()}
      >
        {children}
      </Column>}
  </span>;

export default withDropdown(Dropdown);
