import React from 'react';
import { isEqual, isFinite } from 'lodash';
import OutsideClickHandler from 'react-outside-click-handler';
import Button from '@ncigdc/uikit/Button';
import RangeInput from './RangeInput';
import styles from './styles';
import { defaultFieldState, fieldsOrder } from './RangeTableRow';

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

class RangeInputRow extends React.Component {
  state = {
    fieldErrors: defaultFieldState,
    fieldValues: defaultFieldState,
  };

  // componentDidMount() {
  //   const { fields } = this.props;

  //   this.setState({ fieldValues: fields });
  // }

  componentDidUpdate(prevProps) {
    const { fields } = this.props;
    if (!isEqual(fields, prevProps.fields)) {
      this.setState({ fieldValues: fields }, () => {
        const validateFieldsResult = this.validateFields();
        this.setState({ fieldErrors: validateFieldsResult });
      });
    }
  }

  handleAdd = () => {
    // const validateFieldsResult = this.validateFields();
    // this.setState({ fieldErrors: validateFieldsResult });
    // const rowIsValid = Object.keys(validateFieldsResult)
    //   .filter(field => validateFieldsResult[field].length > 0).length === 0;

    // if (rowIsValid) {
    const { handleAddRow } = this.props;
    const { fieldValues } = this.state;
    const nextRow = {
      active: false,
      fields: fieldValues,
    };
    handleAddRow(nextRow);
    this.setState({ fieldValues: defaultFieldState });
    // }
  };

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
      handleAddRow,
      rangeMethodActive,
      rowIndex,
    } = this.props;

    const { fieldErrors, fieldValues } = this.state;

    return (
      <OutsideClickHandler
        disabled={!rangeMethodActive}
        onOutsideClick={() => {
          // this.handleValidate();
        }}
      >
        <div style={{ display: 'flex' }}>
          <div
            style={rowFieldsWrapper}
          >
            {
              fieldsOrder.map(rowItem => {
                const rowId = `range-row-${rowIndex}-${rowItem}`;
                return (
                  <RangeInput
                    disabled={!rangeMethodActive}
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
            <Button
              aria-label="Add row"
              buttonContentStyle={{ justifyContent: 'center' }}
              disabled={!rangeMethodActive}
              id={`range-row-${rowIndex}-add`}
              onClick={() => {
                this.handleAdd();
              }}
              style={{
                ...(rangeMethodActive
                  ? visualizingButton
                  : inputDisabled),
                ...optionsButton,
                width: '100%',
              }}
            >
              <i aria-hidden="true" className="fa fa-plus-circle" />
              &nbsp; Add
            </Button>
          </div>
        </div>
        {/* {rangeMethodActive && rowNameError.length > 0 && (
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
        } */}
      </OutsideClickHandler>
    );
  }
}

export default RangeInputRow;
