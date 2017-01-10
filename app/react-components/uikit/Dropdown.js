import React, { Children, cloneElement } from 'react';
import DownCaretIcon from 'react-icons/lib/fa/caret-down';
import withDropdown from './withDropdown';
import * as styles from '../theme/mixins';
import { Row, Column } from './Flex';
import UnstyledButton from './UnstyledButton';

const Dropdown = ({
  style,
  selected,
  active,
  setActive,
  mouseDownHandler,
  mouseUpHandler,
  children,
}) => {
  return (
    <UnstyledButton onClick={() => setActive(true)} style={{ position: 'relative', ...style }}>
      <Row style={styles.dropdownButton}>
        <span>{selected}</span>
        <DownCaretIcon style={{ marginLeft: 'auto' }} />
      </Row>
      {active &&
        <Column
          style={styles.dropdown}
          onMouseDown={mouseDownHandler}
          onMouseUp={mouseUpHandler}
          onClick={() => setTimeout(() => setActive(false))}
        >
          {Children.map(children, child =>
            <Row className="dropdown-item">
              {cloneElement(child, {
                ...child.props,
                style: { ...child.props.style, ...styles.dropdownLink },
              })}
            </Row>
          )}
        </Column>
      }
    </UnstyledButton>
  );
};

export default withDropdown(Dropdown);
