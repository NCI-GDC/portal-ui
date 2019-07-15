import React from 'react';
import { isEqual, isFinite } from 'lodash';
import OutsideClickHandler from 'react-outside-click-handler';
import Button from '@ncigdc/uikit/Button';
import RangeInput from './RangeInput';
import styles from './styles';

const {
  input: {
    inputDisabled,
  },
  optionsButton,
  optionsColumn,
  row: {
    rowError,
    rowFieldsWrapper,
  },
  visualizingButton,
} = styles;

class RangeTableRow extends React.Component {
  state = {
    fieldErrors: {},
    fieldValues: {},
  };

  componentDidMount() {
    const { defaultFieldState, fields } = this.props;

    this.setState({
      fieldErrors: defaultFieldState,
      fieldValues: fields,
    });
  }

  componentDidUpdate(prevProps) {
    const { fields } = this.props;
    if (!isEqual(fields, prevProps.fields)) {
      this.setState({ fieldValues: fields }, () => {
        const validateFieldsResult = this.validateFields();
        this.setState({ fieldErrors: validateFieldsResult });
      });
    }
  }

  handleSave = () => {
    const validateFieldsResult = this.validateFields();
    this.setState({ fieldErrors: validateFieldsResult });
    const rowIsValid = Object.keys(validateFieldsResult)
      .filter(field => validateFieldsResult[field].length > 0).length === 0;

    if (rowIsValid) {
      const { handleUpdateRow, rowIndex } = this.props;
      const { fieldValues } = this.state;
      const nextRow = {
        active: false,
        fields: fieldValues,
      };
      handleUpdateRow(rowIndex, nextRow);
    }
  };

  handleEdit = () => {
    const { handleToggleActiveRow, rowIndex } = this.props;
    handleToggleActiveRow(rowIndex, true);
  }

  handleCancel = () => {
    const {
      defaultFieldState, fields, handleToggleActiveRow, rowIndex,
    } = this.props;
    this.setState({
      fieldErrors: defaultFieldState,
      fieldValues: fields,
    });
    handleToggleActiveRow(rowIndex, false);
  }

  handleRemove = () => {
    const { handleRemoveRow, rowIndex } = this.props;
    handleRemoveRow(rowIndex);
  }

  updateInput = target => {
    const inputKey = target.id.split('-')[3];
    const inputValue = target.value;

    const { fieldValues } = this.state;

    this.setState({
      fieldValues: {
        ...fieldValues,
        [inputKey]: inputValue,
      },
    });
  };

  validateFields = () => {
    const {
      fieldValues,
    } = this.state;
    const { countDecimals } = this.props;

    // check empty & NaN errors first
    // then make sure that from < to
    const errorsEmptyOrNaN = Object.keys(fieldValues).reduce((acc, curr) => {
      const currentValue = fieldValues[curr];
      const currentValueNumber = Number(currentValue);

      const nextErrors = currentValue === ''
        ? 'Required field.' : curr === 'name'
          ? '' : !isFinite(currentValueNumber)
            ? `'${currentValue}' is not a number.`
            : countDecimals(currentValueNumber) > 2 ? 'Use up to 2 decimal places.' : '';

      return ({
        ...acc,
        [curr]: nextErrors,
      });
    }, {});

    const checkFromToValues = errorsEmptyOrNaN.to === '' &&
      errorsEmptyOrNaN.from === '' &&
      Number(fieldValues.to) <= Number(fieldValues.from);
    return checkFromToValues ? ({
      from: `'From' must be less than ${fieldValues.to}.`,
      name: '',
      to: `'To' must be greater than ${fieldValues.from}.`,
    }) : errorsEmptyOrNaN;
  };

  render = () => {
    const {
      fieldsOrder,
      rangeMethodActive,
      rowActive,
      rowIndex,
      rowNameError,
      rowOverlapErrors,
    } = this.props;

    const { fieldErrors, fieldValues } = this.state;

    return (
      <OutsideClickHandler
        disabled={!rowActive || !rangeMethodActive}
        onOutsideClick={() => {
          this.handleSave();
        }}
        >
        <div style={{ display: 'flex' }}>
          <div
            onMouseDown={() => {
              rowActive || this.handleEdit();
            }}
            role="presentation"
            style={rowFieldsWrapper}
            >
            {
              fieldsOrder.map(rowItem => {
                const rowId = `range-row-${rowIndex}-${rowItem}`;
                return (
                  <RangeInput
                    disabled={!rowActive || !rangeMethodActive}
                    error={fieldErrors[rowItem]}
                    errorVisible={rangeMethodActive}
                    handleChange={e => {
                      this.updateInput(e.target);
                    }}
                    id={rowId}
                    key={rowId}
                    value={fieldValues[rowItem]}
                    />
                );
              })}
          </div>
          <div style={optionsColumn}>
            {rowActive ? (
              <React.Fragment>
                <Button
                  aria-label="Save"
                  buttonContentStyle={{ justifyContent: 'center' }}
                  disabled={!rangeMethodActive}
                  id={`range-row-${rowIndex}-save`}
                  onClick={() => {
                    this.handleSave();
                  }}
                  style={{
                    ...(rangeMethodActive ? { background: 'green' } : inputDisabled),
                    ...optionsButton,
                  }}
                  >
                  <i aria-hidden="true" className="fa fa-check" />
                </Button>
                <Button
                  aria-label="Cancel"
                  buttonContentStyle={{ justifyContent: 'center' }}
                  disabled={!rangeMethodActive}
                  id={`range-row-${rowIndex}-cancel`}
                  onClick={() => {
                    this.handleCancel();
                  }}
                  onMouseDown={() => {
                    this.handleCancel();
                  }}
                  style={{
                    ...(rangeMethodActive ? { background: 'red' } : inputDisabled),
                    ...optionsButton,
                  }}
                  >
                  <i aria-hidden="true" className="fa fa-close" />
                </Button>
              </React.Fragment>
            ) : (
              <Button
                aria-label="Edit"
                disabled={!rangeMethodActive}
                id={`range-row-${rowIndex}-edit`}
                onClick={() => {
                  this.handleEdit();
                }}
                onMouseDown={() => {
                  this.handleEdit();
                }}
                style={{
                  ...(rangeMethodActive ? visualizingButton : inputDisabled),
                  ...optionsButton,
                }}
                >
                <i aria-hidden="true" className="fa fa-pencil" />
              </Button>
              )}
            <Button
              aria-label="Remove"
              buttonContentStyle={{ justifyContent: 'center' }}
              disabled={!rangeMethodActive}
              id={`range-row-${rowIndex}-remove`}
              onClick={() => {
                this.handleRemove();
              }}
              onMouseDown={() => {
                this.handleRemove();
              }}
              style={{
                ...(rangeMethodActive ? visualizingButton : inputDisabled),
                ...optionsButton,
              }}
              >
              <i aria-hidden="true" className="fa fa-trash" />
            </Button>
          </div>
        </div>
        {rangeMethodActive && rowNameError.length > 0 && (
          <div style={rowError}>
            {rowNameError}
          </div>
        )
        }
        {rangeMethodActive && rowOverlapErrors.length > 0 && (
          <div style={rowError}>
            {`'${fieldValues.name}' overlaps with ${rowOverlapErrors.map(err => `'${err}'`).join(', ')}`}
          </div>
        )
        }
      </OutsideClickHandler>
    );
  }
}

export default RangeTableRow;
