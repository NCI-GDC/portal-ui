import React, { Component } from 'react';
import {
  debounce, isEmpty, isEqual, isFinite,
} from 'lodash';
import Button from '@ncigdc/uikit/Button';
import Undo from '@ncigdc/theme/icons/Undo';


import { Row, Column } from '@ncigdc/uikit/Flex';

import { theme } from '@ncigdc/theme/index';
import {
  createContinuousGroupName,
  DEFAULT_BIN_TYPE,
  DEFAULT_DATA,
  DEFAULT_INTERVAL,
  DEFAULT_RANGES,
} from '../../helpers';
import RangeTableRow from './RangeTableRow';
import BinningMethodInput from './BinningMethodInput';
import CustomIntervalFields from './CustomIntervalFields';
import styles from './styles';
import RangeInputRow from './RangeInputRow';

const countDecimals = num => (Math.floor(num) === num
  ? 0
  : (num.toString().split('.')[1].length || 0));

const checkEmptyFields = fieldValues => Object.keys(fieldValues)
  .map(field => fieldValues[field])
  .every(el => el === '');

const defaultRangeFieldsState = {
  from: '',
  name: '',
  to: '',
};

const rangeFieldsOrder = [
  'name',
  'from',
  'to',
];

const testNumDash = input => (/^(\-?\d+\.?\d*)$/).test(input);
// positive or negative, optional decimals
const testNum = input => (/^(\d+\.?\d*)$/).test(input);
// positive only, optional decimals

const defaultState = {
  binningMethod: 'interval', // interval or range
  continuousReset: false,
  intervalErrors: DEFAULT_INTERVAL,
  intervalFields: DEFAULT_INTERVAL,
  modalWarning: '',
  rangeInputErrors: defaultRangeFieldsState,
  rangeInputOverlapErrors: [],
  rangeInputValues: defaultRangeFieldsState,
  rangeNameErrors: [],
  rangeOverlapErrors: [],
  rangeRows: DEFAULT_RANGES,
};

class ContinuousCustomBinsModal extends Component {
  state = defaultState;

  componentDidMount = () => {
    const {
      continuousBinType = DEFAULT_BIN_TYPE,
      customInterval = DEFAULT_INTERVAL,
      customRanges = DEFAULT_RANGES,
      defaultData = DEFAULT_DATA,
    } = this.props;

    this.debounceValidateIntervalFields = debounce(
      this.validateIntervalFields,
      300
    );

    this.setState({
      ...continuousBinType === 'default'
        ? {}
        : { binningMethod: continuousBinType },
      intervalFields: isEqual(customInterval, DEFAULT_INTERVAL) || 
        isEmpty(customInterval)
          ? {
            amount: defaultData.quarter,
            max: defaultData.max,
            min: defaultData.min,
          }
          : customInterval,
      rangeRows: customRanges,
    });
  };

  resetModal = () => {
    const { defaultData } = this.props;
    this.setState({
      ...defaultState,
      continuousReset: true,
      intervalFields: {
        amount: defaultData.quarter,
        max: defaultData.max,
        min: defaultData.min,
      },
    });
  }

  // binning method: interval

  updateIntervalFields = updateEvent => {
    const { intervalFields } = this.state;
    const { target: { id, value } } = updateEvent;

    this.setState({
      continuousReset: false,
      intervalFields: {
        ...intervalFields,
        [id.split('-')[2]]: value,
      },
    }, () => {
      this.debounceValidateIntervalFields(id, value);
    });
  };

  validateIntervalFields = (id, value) => {
    const { intervalErrors, intervalFields } = this.state;

    const inputKey = id.split('-')[2];
    const numValue = Number(value);

    const emptyOrNaNError = value === ''
      ? 'Required field.'
      // min/max value can be negative or only '-', 
      // but amount value can't have dashes
      : (inputKey === 'amount' && testNum(value)) ||
        (inputKey !== 'amount' && testNumDash(value))
          ? ''
          : `'${value}' is not a valid number.`;
    
    const currentMin = intervalFields.min;
    const currentMax = intervalFields.max;
    const currentAmount = intervalFields.amount;
    const validAmount = currentMax - currentMin;

    this.setState({
      intervalErrors: {
        ...intervalErrors,
        // add empty or NaN error, or remove errors.
        [inputKey]: emptyOrNaNError,
        // if this field is empty or NaN,
        // remove errors that depend on this field's value.
        // only keep empty or NaN errors.
        ...emptyOrNaNError !== '' &&
          {
          ...inputKey !== 'amount' &&
            {
              amount: testNum(currentAmount)
                ? ''
                : intervalErrors.amount,
            },
          ...inputKey === 'max' &&
            {
              min: testNumDash(currentMin)
                ? ''
                : intervalErrors.min,
            },
          ...inputKey === 'min' &&
            {
              max: testNumDash(currentMax)
                ? ''
                : intervalErrors.max,
            },
        },
      },
    });

    if (emptyOrNaNError !== '') {
      return;
    }

    const ALLOWED_DECIMAL_PLACES = 2;
    const decimalError = countDecimals(numValue) > ALLOWED_DECIMAL_PLACES
      ? `Use up to ${ALLOWED_DECIMAL_PLACES} decimal places.`
      : '';

    if (decimalError !== '') {
      this.setState({
        intervalErrors: {
          ...intervalErrors,
          [inputKey]: decimalError,
        },
      });
      return;
    }

    // only do math checks if all fields have valid numbers
    // const isFormValid = ['amount', 'max', 'min']
    //   .filter(field => field !== inputKey
    //     ? true
    //     : field === 'amount'
    //       ? testNum(currentAmount)
    //       : testNumDash(intervalFields[field]))
    //   .length === 3;
    
    // if (!isFormValid) {
    //   return;
    // }

    const mathErrors = {
      amount: value <= 0
        ? 'Must be greater than 0.'
        : value > validAmount && validAmount > 0
          ? `Must be less than or equal to ${validAmount}.`
          : '',
      max: value <= currentMin
        ? `Must be greater than ${currentMin}.`
        : '',
      min: currentMax <= value
        ? `Must be less than ${currentMax}.`
        : ''
    };

    this.setState({
      intervalErrors: {
        ...intervalErrors,
        [inputKey]: mathErrors[inputKey],
        // if min/max have valid values,
        // and max <= min, 
        // only show the error on the current field
        ...inputKey === 'max' &&
          testNumDash(currentMin) &&
          mathErrors.max &&
          { min: '' },
        ...inputKey === 'min' &&
          testNumDash(currentMax) &&
          mathErrors.min &&
          { max: '' },
        ...inputKey !== 'amount' &&
          testNum(currentAmount) &&
          {
            amount: currentAmount > validAmount
              ? 'test' // TODO: put amount error back
              : '',
          },
        },
      });
  };

  checkSubmitDisabled = () => {
    const {
      binningMethod, intervalErrors, rangeOverlapErrors, rangeRows,
    } = this.state;

    if (binningMethod === 'range' &&
      rangeRows.length === 0) return true;

    const checkInterval = Object.keys(intervalErrors)
      .filter(int => intervalErrors[int] !== '').length > 0;
    const checkRange = rangeRows.filter(row => row.active).length > 0;
    const checkOverlap = rangeOverlapErrors
      .filter(err => err.length > 0).length > 0;
    const result = binningMethod === 'interval'
      ? checkInterval
      : checkRange || checkOverlap;
    return result;
  };

  // binning method: range

  handleRemoveRow = rowIndex => {
    const { rangeRows } = this.state;
    const nextRangeRows = rangeRows
      .filter((filterRow, filterRowIndex) => filterRowIndex !== rowIndex);
    this.setState({ rangeRows: nextRangeRows });
    this.validateRangeRow(nextRangeRows);
    this.validateRangeInput();
  };

  handleToggleActiveRow = (inputRowIndex, inputIsActive) => {
    const { rangeRows } = this.state;
    const nextRangeRows = rangeRows.map((rangeRow, rowIndex) => ({
      ...rangeRow,
      active: rowIndex === inputRowIndex ? inputIsActive : rangeRow.active,
    }));
    this.setState({ rangeRows: nextRangeRows });
    this.validateRangeRow(nextRangeRows);
  };

  handleUpdateRow = (inputRowIndex, inputRow) => {
    const { rangeRows } = this.state;
    const nextRangeRows = rangeRows
      .map((rangeRow, rowIndex) => (rowIndex === inputRowIndex
        ? inputRow
        : rangeRow));

    this.validateRangeRow(nextRangeRows);
    this.setState({
      continuousReset: false,
      rangeRows: nextRangeRows,
    });
    this.validateRangeInput();
  }

  // submit

  handleSubmit = () => {
    const { onUpdate } = this.props;
    const {
      binningMethod, continuousReset, intervalFields, rangeRows,
    } = this.state;

    const formIsValid = binningMethod === 'interval' ||
      this.validateRangeRow();

    if (formIsValid) {
      const makeCustomIntervalBins = () => {
        const intervalAmount = Number(intervalFields.amount);
        const intervalMax = Number(intervalFields.max);
        const intervalMin = Number(intervalFields.min);

        const bucketRange = intervalMax - intervalMin;
        const bucketCount = Math.round(bucketRange / intervalAmount);

        const buckets = Array(bucketCount).fill(1)
          .map((val, key) => {
            const from = key * intervalAmount + intervalMin;
            const to = (key + 1) === bucketCount
              ? intervalMax
              : intervalMin + (key + 1) * intervalAmount;

            const objKey = `${from}-${to}`;

            return ({
              [objKey]: {
                groupName: createContinuousGroupName(objKey),
                key: objKey,
              },
            });
          }).reduce((acc, curr) => ({
            ...acc,
            ...curr,
          }), {});

        return buckets;
      };

      const newBins = binningMethod === 'range'
        ? rangeRows.map(row => row.fields).reduce((acc, curr) => {
          const rowKey = `${curr.from}-${curr.to}`;
          return ({
            ...acc,
            ...(curr.name === ''
              ? {}
              : {
                [rowKey]: {
                  groupName: curr.name,
                  key: rowKey,
                },
              }
            ),
          });
        }, {})
        : makeCustomIntervalBins();

      onUpdate(newBins, binningMethod, intervalFields, rangeRows, continuousReset);
    }
  };

  validateRangeNames = (rows = null) => {
    const { rangeRows } = this.state;
    const rowsToCheck = rows === null ? rangeRows : rows;
    const nameErrors = rowsToCheck.map((rowItem, rowIndex) => {
      const rowName = rowItem.fields.name.toLowerCase().trim();
      const duplicateNames = rowsToCheck
        .filter((duplicateItem, duplicateIndex) => {
          return rowIndex !== duplicateIndex &&
            duplicateItem.fields.name.toLowerCase().trim() === rowName;
        });
      return duplicateNames.length > 0 ? 'Bin names must be unique.' : '';
    });
    return nameErrors;
  }

  validateRangeOverlap = (rows = null) => {
    const { rangeRows } = this.state;

    const rowsToCheck = rows === null ? rangeRows : rows;

    const overlapErrors = rowsToCheck.map((rowItem, aIndex) => {
      const aFrom = Number(rowItem.fields.from);
      const aTo = Number(rowItem.fields.to);

      const overlapNames = rowsToCheck
        .reduce((acc, curr, bIndex) => {
          const bFromStr = curr.fields.from;
          const bToStr = curr.fields.to;

          if (aIndex === bIndex ||
            bFromStr === '' ||
            bToStr === '') {
            return acc;
          }

          const bFrom = Number(bFromStr);
          const bTo = Number(bToStr);
          const bName = curr.fields.name;

          const hasOverlap = (aTo > bFrom && aTo < bTo) ||
            // "to" is within range B
            (aFrom > bFrom && aFrom < bTo) ||
            // "from" is within range B
            (aFrom < bFrom && aTo > bTo) || 
            // range B is within range A
            (aFrom === bFrom || aTo === bTo);
            // "from" or "to" are the same in both ranges

          return hasOverlap ? [...acc, bName] : acc;
        }, []);
      return overlapNames.length > 0 ? overlapNames : [];
    });

    return overlapErrors;
  }

  validateRangeRow = (rows = null) => {
    const { rangeRows } = this.state;

    const rowsToCheck = rows === null ? rangeRows : rows;

    const overlapErrors = this.validateRangeOverlap(rowsToCheck);
    const nameErrors = this.validateRangeNames(rowsToCheck);
    const overlapIsValid = overlapErrors
      .filter(overlapErrorItem => overlapErrorItem.length > 0).length === 0;
    const nameIsValid = nameErrors
      .filter(nameErrorItem => nameErrorItem !== '').length === 0;

    this.setState({
      rangeNameErrors: nameErrors,
      rangeOverlapErrors: overlapErrors,
    });

    return nameIsValid && overlapIsValid;
  }

  // range input

  handleRangeInputValidate = () => {
    this.setState({ rangeInputErrors: this.validateRangeInputFormatting() });
  }

  validateRangeInput = () => {
    const validationResult = this.validateRangeInputFormatting();
    const inputFormatIsValid = Object.keys(validationResult)
      .filter(field => validationResult[field].length > 0).length === 0;

    if (inputFormatIsValid) {
      const rangeInputOverlapErrors = this.validateRangeInputOverlap();
      const rangeInputNameError = this.validateRangeInputName();

      this.setState({
        rangeInputErrors: {
          ...validationResult,
          name: rangeInputNameError,
        },
        rangeInputOverlapErrors,
      });

      const overlapIsValid = rangeInputOverlapErrors.length === 0;
      const nameIsValid = rangeInputNameError.length === 0;

      return nameIsValid && overlapIsValid;
    } else {
      this.setState({ 
        rangeInputErrors: validationResult, 
        rangeInputOverlapErrors: [],
      });
      return false;
    }
  }

  handleAddRow = () => {
    const { rangeInputValues, rangeRows } = this.state;
    const inputRowIsValid = this.validateRangeInput();

    if (inputRowIsValid) {
      const nextRow = {
        active: false,
        fields: rangeInputValues,
      };
      this.setState({
        continuousReset: false,
        rangeInputErrors: defaultRangeFieldsState,
        rangeInputValues: defaultRangeFieldsState,
        rangeRows: rangeRows.concat(nextRow),
      });
    }
  };

  updateRangeInput = (id, value) => {
    const { rangeInputValues } = this.state;

    this.setState({
      rangeInputValues: {
        ...rangeInputValues,
        [id.split('-')[3]]: value,
      },
    });
  };

  validateRangeInputFormatting = () => {
    const { rangeInputValues } = this.state;

    // check empty & NaN errors first
    // then make sure that from < to

    const allFieldsEmpty = checkEmptyFields(rangeInputValues);

    const errorsEmptyOrNaN = Object.keys(rangeInputValues)
      .reduce((acc, curr) => {
        const currentValue = rangeInputValues[curr];
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
        Number(rangeInputValues.to) <= Number(rangeInputValues.from));

    return !allFieldsEmpty && fromGreaterThanto
      ? ({
        from: `'From' must be less than ${rangeInputValues.to}.`,
        name: '',
        to: `'To' must be greater than ${rangeInputValues.from}.`,
      })
      : errorsEmptyOrNaN;
  };

  validateRangeInputName = () => {
    const { rangeInputValues, rangeRows } = this.state;

    const fieldName = rangeInputValues.name.toLowerCase().trim();
    const duplicateNames = rangeRows.filter(row => {
      const rowName = row.fields.name.toLowerCase().trim();
      return rowName === fieldName;
    });

    return duplicateNames.length > 0
      ? 'Bin names must be unique.'
      : '';
  }

  validateRangeInputOverlap = () => {
    const { rangeInputValues, rangeRows } = this.state;

    const fieldFrom = Number(rangeInputValues.from);
    const fieldTo = Number(rangeInputValues.to);

    return (rangeInputValues.from === '' ||
      rangeInputValues.to === '' ||
      fieldFrom >= fieldTo)
        ? [] 
        : rangeRows.reduce((acc, curr) => {
          const overlapFromStr = curr.fields.from;
          const overlapToStr = curr.fields.to;

          const overlapFrom = Number(overlapFromStr);
          const overlapTo = Number(overlapToStr);
          const overlapName = curr.fields.name;

          const hasOverlap = (fieldTo > overlapFrom && fieldTo < overlapTo) ||
            (fieldFrom > overlapFrom && fieldFrom < overlapTo) ||
            (fieldFrom < overlapFrom && fieldTo > overlapTo) || 
            (fieldFrom === overlapFrom || fieldTo === overlapTo);

          return hasOverlap
            ? [...acc, overlapName]
            : acc;
        }, []);
  }


  render = () => {
    const { defaultData, fieldName, onClose } = this.props;
    const {
      binningMethod,
      intervalErrors,
      intervalFields,
      modalWarning,
      rangeInputErrors,
      rangeInputOverlapErrors,
      rangeInputValues,
      rangeNameErrors,
      rangeOverlapErrors,
      rangeRows,
    } = this.state;

    const submitDisabled = this.checkSubmitDisabled();

    return (
      <Column style={{ padding: '2rem 2rem 0.5rem' }}>
        <div>
          <h2
            style={{
              borderBottom: `1px solid ${theme.greyScale5}`,
              marginTop: 0,
              paddingBottom: '1rem',
            }}
            >
            {`Create Custom Bins: ${fieldName}`}
          </h2>
          <p>
            Configure your bins then click
            <strong> Save Bins </strong>
            to update the analysis plots.
          </p>
          <Row style={styles.defaultInfo}>
            <p style={styles.defaultInfo.paragraph}>
              Available values from
              <strong>{` ${defaultData.min} `}</strong>
              to
              <strong>{` \u003c ${defaultData.max} `}</strong>
            </p>
            <p style={styles.defaultInfo.paragraph}>|</p>
            <p style={styles.defaultInfo.paragraph}>
              Bin size in quarters:
              <strong>{` ${defaultData.quarter}`}</strong>
            </p>
          </Row>
        </div>
        <div style={styles.formBg}>
          <Row
            style={{
              justifyContent: 'space-between',
            }}
            >
            <Column className="binning-interval">
              <h3>Define bins by:</h3>
              <CustomIntervalFields
                countDecimals={countDecimals}
                disabled={binningMethod !== 'interval'}
                handleChange={e => {
                  this.updateIntervalFields(e);
                }}
                handleUpdateBinningMethod={() => {
                  this.setState({ binningMethod: 'interval' });
                }}
                intervalErrors={intervalErrors}
                intervalFields={intervalFields}
                validateIntervalFields={e => {
                  const { target: { id, value } } = e;
                  this.validateIntervalFields(id, value);
                }}
                />
            </Column>
            <Column>
              <Button
                aria-label="Reset modal"
                onClick={() => {
                  this.resetModal();
                }}
                onMouseDown={() => {
                  this.resetModal();
                }}
                style={{
                  ...styles.visualizingButton,
                  ...styles.resetButton,
                }}
                >
                <Undo />
              </Button>
            </Column>
          </Row>
          <div
            className="binning-range"
            onClick={() => {
              if (binningMethod !== 'range') {
                this.setState({ binningMethod: 'range' });
              }
            }}
            role="presentation"
            >
            <div style={{ marginBottom: '15px' }}>
              <BinningMethodInput
                binningMethod="range"
                checked={binningMethod === 'range'}
                handleChange={() => {
                  this.setState({ binningMethod: 'range' });
                }}
                label="Custom ranges"
                />
            </div>
            <div style={styles.wrapper}>
              <div style={styles.heading}>
                <div
                  id="range-table-label-name"
                  style={styles.column}
                  >
                  Bin Name
                </div>
                <div
                  id="range-table-label-min"
                  style={styles.column}
                  >
                  From
                </div>
                <div
                  id="range-table-label-max"
                  style={styles.column}
                  >
                  To less than
                </div>
                <div
                  id="range-table-label-actions"
                  style={styles.actionsColumn}
                  >
                  Actions
                </div>
              </div>
              <div style={styles.scrollingTable}>
                {rangeRows.map((row, rowIndex) => (
                  <RangeTableRow
                    countDecimals={countDecimals}
                    defaultRangeFieldsState={defaultRangeFieldsState}
                    fields={row.fields}
                    handleRemoveRow={this.handleRemoveRow}
                    handleToggleActiveRow={this.handleToggleActiveRow}
                    handleUpdateBinningMethod={() => {
                      this.setState({ binningMethod: 'range' });
                    }}
                    handleUpdateRow={this.handleUpdateRow}
                    key={`range-row-${rowIndex}`}
                    rangeFieldsOrder={rangeFieldsOrder}
                    rangeMethodActive={binningMethod === 'range'}
                    rowActive={row.active}
                    rowIndex={rowIndex}
                    rowNameError={rangeNameErrors[rowIndex] || ''}
                    rowOverlapErrors={rangeOverlapErrors[rowIndex] || []}
                    styles={styles}
                    />
                ))}
              </div>
              <RangeInputRow
                allFieldsEmpty={checkEmptyFields(rangeInputValues)}
                handleAddRow={this.handleAddRow}
                handleRangeInputValidate={this.handleRangeInputValidate}
                rangeFieldsOrder={rangeFieldsOrder}
                rangeInputErrors={rangeInputErrors}
                rangeInputOverlapErrors={rangeInputOverlapErrors}
                rangeInputValues={rangeInputValues}
                rangeMethodActive={binningMethod === 'range'}
                styles={styles}
                updateRangeInput={e => {
                  const { target: { id, value } } = e;
                  this.updateRangeInput(id, value);
                }}
                />
            </div>
          </div>
        </div>
        <Row
          spacing="1rem"
          style={{
            borderTop: '1px solid #e5e5e5',
            justifyContent: 'flex-end',
            marginTop: '20px',
            padding: '15px',
          }}
          >
          <span
            style={{
              color: 'red',
              justifyContent: 'flex-start',
              visibility: modalWarning.length > 0 ? 'visible' : 'hidden',
            }}
            >
            {`Warning: ${modalWarning}`}
          </span>
          <Button
            onClick={onClose}
            onMouseDown={onClose}
            >
            Cancel
          </Button>
          <Button
            disabled={submitDisabled}
            onClick={() => this.handleSubmit()}
            onMouseDown={() => this.handleSubmit()}
            >
            Save Bins
          </Button>
        </Row>
      </Column>
    );
  }
}

export default ContinuousCustomBinsModal;
