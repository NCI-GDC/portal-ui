import React, { Component } from 'react';
import { debounce, isEmpty, isFinite } from 'lodash';

import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { createContinuousGroupName } from '@ncigdc/utils/string';
import Undo from '@ncigdc/theme/icons/Undo';
import { theme } from '@ncigdc/theme/index';
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

const defaultInterval = {
  amount: '',
  max: '',
  min: '',
};

const defaultState = {
  binningMethod: 'interval', // interval or range
  continuousReset: false,
  intervalErrors: defaultInterval,
  intervalFields: defaultInterval,
  modalWarning: '',
  rangeInputErrors: defaultRangeFieldsState,
  rangeInputOverlapErrors: [],
  rangeInputValues: defaultRangeFieldsState,
  rangeNameErrors: [],
  rangeOverlapErrors: [],
  rangeRows: [],
};

class ContinuousCustomBinsModal extends Component {
  state = defaultState;

  componentDidMount = () => {
    const {
      continuousBinType = 'default',
      continuousCustomInterval = 0,
      continuousCustomRanges = [],
      defaultContinuousData,
    } = this.props;

    this.debounceValidateIntervalFields = debounce(
      this.validateIntervalFields,
      300
    );

    this.setState({
      ...continuousBinType === 'default'
        ? {}
        : { binningMethod: continuousBinType },
      intervalFields: isEmpty(continuousCustomInterval)
        ? {
          amount: defaultContinuousData.quarter,
          max: defaultContinuousData.max,
          min: defaultContinuousData.min,
        }
        : continuousCustomInterval,
      rangeRows: continuousCustomRanges,
    });
  };

  resetModal = () => {
    const { defaultContinuousData } = this.props;
    this.setState({
      ...defaultState,
      continuousReset: true,
      intervalFields: {
        amount: defaultContinuousData.quarter,
        max: defaultContinuousData.max,
        min: defaultContinuousData.min,
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
    const inputValue = Number(value);

    let inputError = inputValue === ''
      ? 'Required field.'
      : isFinite(inputValue)
        ? ''
        : `'${value}' is not a valid number.`;

    const currentMin = intervalFields.min;
    const currentMax = intervalFields.max;
    const currentAmount = Number(intervalFields.amount);
    const validAmount = currentMax - currentMin;

    if (inputError !== '') {
      // if the current value is empty or NaN,
      // remove all errors except empty or NaN
      this.setState({
        intervalErrors: {
          ...intervalErrors,
          amount: isFinite(currentAmount)
            ? ''
            : intervalErrors.amount,
          [inputKey]: inputError,
          ...inputKey === 'max'
            ? {
              min: isFinite(Number(currentMin))
                ? ''
                : intervalErrors.min,
            }
            : {
              max: isFinite(Number(currentMax))
                ? ''
                : intervalErrors.min,
            },
        },
      });
      return;
    }

    const ALLOWED_DECIMAL_PLACES = 2;

    inputError = countDecimals(inputValue) > ALLOWED_DECIMAL_PLACES
      ? `Use up to ${ALLOWED_DECIMAL_PLACES} decimal places.`
      : inputError;

    if (inputError !== '') {
      this.setState({
        intervalErrors: {
          ...intervalErrors,
          [inputKey]: inputError,
        },
      });
      return;
    }

    const amountError = `Must be less than or equal to ${validAmount}.`;

    if (inputKey === 'amount') {
      inputError = inputValue <= 0
        ? 'Must be greater than 0.'
        : inputValue > validAmount &&
          validAmount > 0
          ? amountError
          : '';
    } else if (inputKey === 'max') {
      inputError = inputValue <= currentMin
        ? `Must be greater than ${currentMin}.`
        : '';
    } else if (inputKey === 'min') {
      inputError = inputValue >= currentMax
        ? `Must be less than ${currentMax}.`
        : '';
    } else {
      inputError = '';
    }

    this.setState({
      intervalErrors: {
        ...intervalErrors,
        [inputKey]: inputError,
        ...inputKey === 'max' &&
          isFinite(Number(currentMin)) &&
          isFinite(inputValue) &&
          inputValue <= currentMin
          ? { min: '' }
          : {},
        ...inputKey === 'min' &&
          isFinite(inputValue) &&
          isFinite(Number(currentMax)) &&
          currentMax <= inputValue
          ? { max: '' }
          : {},
      },
    }, () => {
      if ((inputKey === 'max' || inputKey === 'min') &&
        isFinite(currentAmount)) {
        this.setState({
          intervalErrors: {
            ...intervalErrors,
            amount: inputError === '' &&
              currentAmount > validAmount
              ? amountError
              : '',
          },
        });
      }
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

  handleAddRow = inputRow => {
    const { rangeRows } = this.state;

    this.setState({ rangeRows: rangeRows.concat(inputRow) });
  }

  handleUpdateRow = (inputRowIndex, inputRow) => {
    const { rangeRows } = this.state;
    const nextRangeRows = rangeRows
      .map((rangeRow, rowIndex) => (rowIndex === inputRowIndex
        ? inputRow
        : rangeRow));

    const rowHasErrors = this.validateRangeRow(nextRangeRows);
    if (rowHasErrors) return;

    this.setState({
      continuousReset: false,
      rangeRows: nextRangeRows,
    });
  }

  // submit

  handleSubmit = () => {
    const { onUpdate } = this.props;
    const {
      binningMethod, continuousReset, intervalFields, rangeRows,
    } = this.state;

    const formHasErrors = binningMethod === 'range' &&
      this.validateRangeRow();

    if (!formHasErrors) {
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
            ...(curr.name === '' ? {} : {
              [rowKey]: {
                groupName: curr.name,
                key: rowKey,
              },
            }),
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
    // assume all rows are complete and from < to

    const { rangeRows } = this.state;

    const rowsToCheck = rows === null ? rangeRows : rows;

    const overlapErrors = rowsToCheck.map((rowItem, rowIndex) => {
      const rowFrom = Number(rowItem.fields.from);
      const rowTo = Number(rowItem.fields.to);

      const overlapNames = rowsToCheck
        .reduce((acc, curr, overlapIndex) => {
          const overlapFromStr = curr.fields.from;
          const overlapToStr = curr.fields.to;

          if (rowIndex === overlapIndex ||
            curr.fields.from === '' ||
            curr.fields.to === '') {
            return acc;
          }

          const overlapFrom = Number(overlapFromStr);
          const overlapTo = Number(overlapToStr);
          const overlapName = curr.fields.name;

          const hasOverlap = (rowTo > overlapFrom && rowTo < overlapTo) ||
            (rowFrom > overlapFrom && rowFrom < overlapTo) ||
            (rowFrom === overlapFrom && rowTo === overlapTo);

          return hasOverlap ? [...acc, overlapName] : acc;
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
    const overlapHasError = overlapErrors
      .filter(overlapErrorItem => overlapErrorItem.length > 0).length > 0;
    const nameHasError = nameErrors
      .filter(nameErrorItem => nameErrorItem !== '').length > 0;

    this.setState({
      rangeNameErrors: nameErrors,
      rangeOverlapErrors: overlapErrors,
    });

    return nameHasError || overlapHasError;
  }

  // range input

  handleRangeInputValidate = () => {
    this.setState({ rangeInputErrors: this.validateRangeInputBeforeSave() });
  }

  handleAddRow = () => {
    const { rangeInputValues, rangeRows } = this.state;
    const validationResult = this.validateRangeInputBeforeSave();

    const rowHasErrors = Object.keys(validationResult)
      .filter(field => validationResult[field].length > 0).length > 0;
    this.setState({ rangeInputErrors: validationResult }, () => {
      if (rowHasErrors) return;

      const hasOverlap = this.validateRangeInputOnSave();
      if (hasOverlap) return;

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
    });
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

  validateRangeInputBeforeSave = () => {
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
    // assume all fields are complete and from < to
    const { rangeInputValues, rangeRows } = this.state;

    const fieldFrom = Number(rangeInputValues.from);
    const fieldTo = Number(rangeInputValues.to);

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

  validateRangeInputOnSave = () => {
    const { rangeInputErrors } = this.state;

    const rangeInputOverlapErrors = this.validateRangeInputOverlap();
    const nameError = this.validateRangeInputName();
    const overlapHasError = rangeInputOverlapErrors.length > 0;
    const nameHasError = nameError.length > 0;

    this.setState({
      rangeInputErrors: {
        ...rangeInputErrors,
        name: nameError,
      },
      rangeInputOverlapErrors,
    });

    return nameHasError || overlapHasError;
  }


  render = () => {
    const { defaultContinuousData, fieldName, onClose } = this.props;
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
      <Column style={{ padding: '20px' }}>
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
              <strong>{` ${defaultContinuousData.min} `}</strong>
              to
              <strong>{` \u003c ${defaultContinuousData.max} `}</strong>
            </p>
            <p style={styles.defaultInfo.paragraph}>|</p>
            <p style={styles.defaultInfo.paragraph}>
              Bin size in quarters:
              <strong>{` ${defaultContinuousData.quarter}`}</strong>
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
                  id="range-table-label-options"
                  style={styles.optionsColumn}
                  >
                  Options
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
            style={submitDisabled
              ? styles.inputDisabled : {}}
            >
            Save Bins
          </Button>
        </Row>
      </Column>
    );
  }
}

export default ContinuousCustomBinsModal;
