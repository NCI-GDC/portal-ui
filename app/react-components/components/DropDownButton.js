import React from 'react';
import Button from '../uikit/Button';
import withDropdown from '../uikit/withDropdown';
import Column from '../uikit/Flex/Column';
import Row from '../uikit/Flex/Row';
import { dropdown, visualizingButton } from '../theme/mixins';
import theme from '../theme';
import Tooltip from '../uikit/Tooltip';

const styles = {
  row: {
    padding: '0.6rem 1rem',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: theme.greyScale6,
    },
  },
};

const DropDownButton = ({
  active,
  setActive,
  mouseDownHandler,
  mouseUpHandler,
  style,
  icon,
  label,
  options = [],
  disabled,
  tooltipHTML,
}) => {
  const button = (
    <Button
      style={visualizingButton}
      onClick={() => setActive(!active)}
      leftIcon={icon}
      disabled={disabled || !options.length}
    >
      {label}
    </Button>
  );

  return (
    <span
      style={{
        position: 'relative',
        ...style,
      }}
      onMouseDown={mouseDownHandler}
      onMouseUp={mouseUpHandler}
    >
      {tooltipHTML ? <Tooltip innerHTML={tooltipHTML}>{button}</Tooltip> : button}
      {active &&
        <Column style={dropdown} >
          {options.map(option => (
            <Row
              key={option.key || option.text}
              style={styles.row}
              onClick={() => {
                setActive(false);
                option.onClick();
              }}
            >{option.text}</Row>
          ))}
        </Column>
      }
    </span>
  );
};

export default withDropdown(DropDownButton);
