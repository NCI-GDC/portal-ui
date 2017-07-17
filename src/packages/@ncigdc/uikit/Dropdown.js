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
  mouseDownHandler,
  mouseUpHandler,
  children,
  dropdownStyle = {},
  dropdownClassName = '',
  button = null,
  isDisabled = false,
  autoclose = true,
  ...props
}) =>
  <span
    style={{ position: 'relative', ...style }}
    data-test={props['data-test']}
  >
    <span
      onMouseDown={mouseDownHandler}
      onMouseUp={mouseUpHandler}
      onClick={() => !isDisabled && setActive(!active)}
    >
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
        onMouseDown={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        onClick={() => autoclose && setTimeout(() => setActive(false))}
      >
        {children}
      </Column>}
  </span>;

export default withDropdown(Dropdown);
