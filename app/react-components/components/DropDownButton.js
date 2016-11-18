import Button from '../uikit/Button';
import withDropdown from '../uikit/withDropdown';
import Column from '../uikit/Flex/Column';
import Row from '../uikit/Flex/Row';
import { dropdown } from '../theme/mixins'
import theme from '../theme';

const styles = {
  button: {
    color: '#333',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    marginRight: 12,
    minWidth: 46,
    minHeight: 34,
    display: 'inline-flex',
  },
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
}) => (
  <span
    style={{
      position: 'relative',
      ...style,
    }}
    onMouseDown={mouseDownHandler}
    onMouseUp={mouseUpHandler}
  >
    <Button
      style={styles.button}
      onClick={() => setActive(!active)}
      leftIcon={icon}
      disabled={disabled || !options.length}
    >
      {label}
    </Button>
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

export default withDropdown(DropDownButton);