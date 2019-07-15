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

const checkEmptyFields = fieldValues => Object.keys(fieldValues)
  .map(field => fieldValues[field])
  .every(el => el === '');

class RangeInputRow extends React.Component {
  state = {
    fieldErrors: {},
    fieldValues: {},
    overlapErrors: [],
  };

  componentDidMount() {
    const { defaultRangeFieldsState } = this.props;
    this.setState({
      fieldErrors: defaultRangeFieldsState,
      fieldValues: defaultRangeFieldsState,
    });
  }

  componentDidUpdate(prevProps) {
    const { fields } = this.props;
    if (!isEqual(fields, prevProps.fields)) {
      this.setState({ fieldValues: fields }, () => {
        const validateFieldsResult = this.validateOnBlur();
        this.setState({ fieldErrors: validateFieldsResult });
      });
    }
  }

  handleValidate = () => {
    const validateFieldsResult = this.validateOnBlur();
    this.setState({ fieldErrors: validateFieldsResult });
  }

  handleAdd = () => {
    const { defaultRangeFieldsState } = this.props;
    const validateFieldsResult = this.validateOnBlur();
    const rowHasErrors = Object.keys(validateFieldsResult)
      .filter(field => validateFieldsResult[field].length > 0).length > 0;
    this.setState({ fieldErrors: validateFieldsResult }, () => {
      if (rowHasErrors) return;

      const hasOverlap = this.validateOnSave();
      if (hasOverlap) return;

      const { handleAddRow } = this.props;
      const { fieldValues } = this.state;
      const nextRow = {
        active: false,
        fields: fieldValues,
      };

      handleAddRow(nextRow);
      this.setState({ fieldValues: defaultRangeFieldsState });
    });
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

  validateOnBlur = () => {
    const {
      fieldValues,
    } = this.state;
    const { countDecimals } = this.props;

    // check empty & NaN errors first
    // then make sure that from < to

    const allFieldsEmpty = checkEmptyFields(fieldValues);

    const errorsEmptyOrNaN = Object.keys(fieldValues)
      .reduce((acc, curr) => {
        const currentValue = fieldValues[curr];
        const currentValueNumber = Number(currentValue);

        const nextErrors = allFieldsEmpty
          ? ''
          : currentValue === ''
            ? 'Required field.'
            : curr === 'name'
              ? ''
              : !isFinite(currentValueNumber)
                ? `'${currentValue}' is not a number.`
                : countDecimals(currentValueNumber) > 2
                  ? 'Use up to 2 decimal places.'
                  : '';

        return ({
          ...acc,
          [curr]: nextErrors,
        });
      }, {});

    const fromGreaterThanto = allFieldsEmpty
      ? ''
      : (errorsEmptyOrNaN.to === '' &&
        errorsEmptyOrNaN.from === '' &&
        Number(fieldValues.to) <= Number(fieldValues.from));

    return !allFieldsEmpty && fromGreaterThanto
      ? ({
        from: `'From' must be less than ${fieldValues.to}.`,
        name: '',
        to: `'To' must be greater than ${fieldValues.from}.`,
      })
      : errorsEmptyOrNaN;
  };

  validateName = () => {
    const { rangeRows } = this.props;
    const { fieldValues } = this.state;

    const fieldName = fieldValues.name.toLowerCase().trim();
    const duplicateNames = rangeRows.filter(row => {
      const rowName = row.fields.name.toLowerCase().trim();
      return rowName === fieldName;
    });

    return duplicateNames.length > 0
      ? 'Bin names must be unique.'
      : '';
  }

  validateOverlap = () => {
    // assume all fields are complete and from < to
    const { rangeRows } = this.props;
    const { fieldValues } = this.state;

    const fieldFrom = Number(fieldValues.from);
    const fieldTo = Number(fieldValues.to);

    const overlapErrors = rangeRows.reduce((acc, curr) => {
      const overlapFromStr = curr.fields.from;
      const overlapToStr = curr.fields.to;

      const overlapFrom = Number(overlapFromStr);
      const overlapTo = Number(overlapToStr);
      const overlapName = curr.fields.name;

      const hasOverlap = (fieldTo > overlapFrom && fieldTo <= overlapTo) ||
        (fieldFrom >= overlapFrom && fieldFrom < overlapTo) ||
        (fieldFrom <= overlapFrom && fieldTo >= overlapTo);

      return hasOverlap
        ? [...acc, overlapName]
        : acc;
    }, []);

    return overlapErrors;
  }

  validateOnSave = () => {
    const { fieldErrors } = this.state;

    const overlapErrors = this.validateOverlap();
    const nameError = this.validateName();
    const overlapHasError = overlapErrors.length > 0;
    const nameHasError = nameError.length > 0;

    this.setState({
      fieldErrors: {
        ...fieldErrors,
        name: nameError,
      },
      overlapErrors,
    });

    return nameHasError || overlapHasError;
  }

  render = () => {
    const {
      rangeFieldsOrder,
      rangeMethodActive,
      rowIndex,
    } = this.props;

    const {
      fieldErrors,
      fieldValues,
      overlapErrors,
    } = this.state;

    const allFieldsEmpty = checkEmptyFields(fieldValues);

    return (
      <OutsideClickHandler
        disabled={!rangeMethodActive}
        onOutsideClick={() => {
          this.handleValidate();
        }}
        >
        <div style={{ display: 'flex' }}>
          <div
            style={rowFieldsWrapper}
            >
            {
              rangeFieldsOrder.map(rowItem => {
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
              disabled={allFieldsEmpty || !rangeMethodActive}
              id={`range-row-${rowIndex}-add`}
              onClick={() => {
                this.handleAdd();
              }}
              style={{
                ...(allFieldsEmpty || !rangeMethodActive
                  ? inputDisabled
                  : visualizingButton),
                ...optionsButton,
                width: '100%',
              }}
              >
              <i aria-hidden="true" className="fa fa-plus-circle" />
              &nbsp; Add
            </Button>
          </div>
        </div>
        {rangeMethodActive && overlapErrors.length > 0 && (
          <div style={rowError}>
            {`'${fieldValues.name}' overlaps with ${overlapErrors
              .map(err => `'${err}'`).join(', ')}`}
          </div>
        )
        }
      </OutsideClickHandler>
    );
  }
}

export default RangeInputRow;
