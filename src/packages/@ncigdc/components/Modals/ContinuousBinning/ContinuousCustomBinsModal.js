import React, { Component } from 'react';
import { debounce, isFinite } from 'lodash';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import RangeTableRow from './RangeTableRow';
import BinningMethodInput from './BinningMethodInput';
import CustomIntervalFields from './CustomIntervalFields';
import styles from './styles';
import RangeInputRow from './RangeInputRow';
import { createContinuousGroupName, parseContinuousKey, } from '@ncigdc/utils/string';

const countDecimals = num => {
  return Math.floor(num) === num
    ? 0
    : (num.toString().split('.')[1].length || 0);
};

class ContinuousCustomBinsModal extends Component {
  state = {
    binningMethod: 'interval', // interval or range
    intervalErrors: {
      amount: '',
      max: '',
      min: '',
    },
    intervalFields: {
      // seed input values, from props
      amount: this.props.defaultContinuousData.quarter,
      max: this.props.defaultContinuousData.max,
      min: this.props.defaultContinuousData.min,
    },
    modalWarning: '',
    rangeNameErrors: [],
    rangeOverlapErrors: [],
    rangeRows: [],
  };

  componentDidMount = () => {
    const {
      binData,
      continuousBinType,
      rangeRows,
      continuousCustomInterval,
    } = this.props;

    this.validateRangeRow(rangeRows);

    this.debounceValidateIntervalFields = debounce(
      this.validateIntervalFields,
      300
    );

    if (continuousBinType === 'range') {
      this.setState({
        binningMethod: 'range',
        rangeRows: binData.map(bin => {
          const [from, to] = parseContinuousKey(bin.keyArray[0]);
          return ({
            active: false,
            fields: {
              from,
              name: bin.key,
              to,
            },
          });
        }),
      });
    } else if (continuousBinType === 'interval') {
      this.setState({
        binningMethod: 'interval',
        intervalFields: {
          amount: continuousCustomInterval,
          max: parseContinuousKey(binData[binData.length - 1].keyArray[0])[1],
          min: parseContinuousKey(binData[0].keyArray[0])[0],
        },
      });
    }
  };

  // binning method: interval

  updateIntervalFields = (updateEvent, inputError = null) => {
    const { intervalErrors, intervalFields } = this.state;

    const inputKey = updateEvent.target.id.split('-')[2];
    const inputValue = updateEvent.target.value;

    const nextIntervalFields = {
      ...intervalFields,
      [inputKey]: inputValue,
    };

    const nextIntervalErrors = {
      ...intervalErrors,
      [inputKey]: inputError === null
        ? intervalErrors[inputKey]
        : inputError,
    };

    if (inputError === null) updateEvent.persist();

    this.setState({
      intervalErrors: nextIntervalErrors,
      intervalFields: nextIntervalFields,
    }, () => {
      if (inputError === null) {
        this.debounceValidateIntervalFields(updateEvent);
      }
    });
  };

  validateIntervalFields = event => {
    const { defaultContinuousData } = this.props;
    const { intervalFields } = this.state;

    const inputKey = event.target.id.split('-')[2];
    const inputValue = Number(event.target.value);

    if (!isFinite(inputValue)) {
      const nanError = [`'${event.target.value}' is not a valid number.`];
      this.updateIntervalFields(event, nanError);
      return;
    }

    const currentMin = intervalFields.min;
    const currentMax = intervalFields.max;

    const checkMinInRange = currentMin >= defaultContinuousData.min && currentMin < defaultContinuousData.max;
    const validMin = checkMinInRange ? currentMin : defaultContinuousData.min;

    const checkMaxInRange = currentMax > defaultContinuousData.min && currentMax <= defaultContinuousData.max;
    const validMax = checkMaxInRange ? currentMax : defaultContinuousData.max;

    const validAmount = checkMinInRange && checkMaxInRange ? currentMax - currentMin : defaultContinuousData.max - defaultContinuousData.min;

    let inputError = '';

    const decimalError = 'Use up to 2 decimal places.';

    if (inputValue === '') {
      inputError = 'Required field.';
    } else {
      inputError = countDecimals(inputValue) > 2 ? decimalError : inputError;
    }

    if (inputError !== '') {
      this.updateIntervalFields(event, inputError);
      return;
    }

    if (inputKey === 'amount') {
      const amountTooLargeError = `Must be less than or equal to ${validAmount}.`;
      const amountTooSmallError = 'Must be greater than 0.';
      inputError = inputValue <= 0 ? amountTooSmallError : inputValue > validAmount ? amountTooLargeError : '';
      inputError = countDecimals(inputValue) > 2 ? decimalError : inputError;
    } else if (inputKey === 'max') {
      const maxTooSmallError = `Must be greater than ${validMin}.`;
      const maxTooLargeError = `Must be less than or equal to ${defaultContinuousData.max}.`;
      inputError = inputValue <= validMin ? maxTooSmallError : inputValue > defaultContinuousData.max ? maxTooLargeError : '';
      inputError = countDecimals(inputValue) > 2 ? decimalError : inputError;
    } else if (inputKey === 'min') {
      const minTooLargeError = `Must be less than ${validMax}.`;
      const maxTooSmallError = `Must be greater than or equal to ${defaultContinuousData.min}.`;
      inputError = inputValue >= validMax ? minTooLargeError : inputValue < defaultContinuousData.min ? maxTooSmallError : '';
      inputError = countDecimals(inputValue) > 2 ? decimalError : inputError;
    } else {
      inputError = '';
    }

    this.updateIntervalFields(event, inputError);
  };

  checkSubmitDisabled = () => {
    const {
      binningMethod, intervalErrors, rangeOverlapErrors, rangeRows,
    } = this.state;

    if (binningMethod === 'range' &&
      rangeRows.length === 0) return true;

    const checkInterval = Object.keys(intervalErrors)
      .filter(int => intervalErrors[int] !== '').length > 0;
    const checkRange = rangeRows
      .filter(row => row.active).length > 0;
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
    const nextRangeRows = rangeRows.filter((filterRow, filterRowIndex) => filterRowIndex !== rowIndex);
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

  validateNewRow = () => false;

  handleAddRow = inputRow => {
    const { rangeRows } = this.state;

    const rowHasErrors = this.validateNewRow(inputRow);
    if (rowHasErrors) return;

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

    this.setState({ rangeRows: nextRangeRows });
  }

  // submit

  handleSubmit = () => {
    const { onUpdate } = this.props;
    const {
      binningMethod, intervalFields, rangeRows,
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

      const continuousCustomInterval = binningMethod === 'interval'
        ? intervalFields.amount
        : 0;

      onUpdate(newBins, binningMethod, continuousCustomInterval);
    }
  };

  validateRangeNames = (rows = null) => {
    const { rangeRows } = this.state;
    const rowsToCheck = rows === null ? rangeRows : rows;
    const nameErrors = rowsToCheck.map((rowItem, rowIndex) => {
      const rowName = rowItem.fields.name.toLowerCase().trim();
      const duplicateNames = rowsToCheck.filter((duplicateItem, duplicateIndex) => {
        if (rowIndex === duplicateIndex) return;
        const duplicateName = duplicateItem.fields.name.toLowerCase().trim();
        return duplicateName === rowName;
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
    const overlapHasError = overlapErrors.filter(overlapErrorItem => overlapErrorItem.length > 0).length > 0;
    const nameHasError = nameErrors.filter(nameErrorItem => nameErrorItem !== '').length > 0;

    this.setState({
      rangeNameErrors: nameErrors,
      rangeOverlapErrors: overlapErrors,
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
      rangeNameErrors,
      rangeOverlapErrors,
      rangeRows,
    } = this.state;

    const submitDisabled = this.checkSubmitDisabled();

    return (
      <Column style={{ padding: '20px' }}>
        <div>
          <h1 style={{ marginTop: 0 }}>
            {`Create Custom Bins: ${fieldName}`}
          </h1>
          <p>
            Available values from
            <strong>{` ${defaultContinuousData.min} `}</strong>
            to
            <strong>{` \u003c ${defaultContinuousData.max} `}</strong>
          </p>
          <p>
            Bin size in quarters:
            <strong>{` ${defaultContinuousData.quarter}`}</strong>
          </p>
          <p>
            Configure your bins then click
            <strong> Save Bins </strong>
            to update the analysis plots.
          </p>
        </div>
        <div style={styles.formBg}>
          <Row>
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
                  this.validateIntervalFields(e);
                }}
              />
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
                label="Manually"
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
                  To &lt;
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
                    fields={row.fields}
                    handleRemoveRow={this.handleRemoveRow}
                    handleToggleActiveRow={this.handleToggleActiveRow}
                    handleUpdateBinningMethod={() => {
                      this.setState({ binningMethod: 'range' });
                    }}
                    handleUpdateRow={this.handleUpdateRow}
                    key={`range-row-${rowIndex}`}
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
                countDecimals={countDecimals}
                handleAddRow={this.handleAddRow}
                rangeMethodActive={binningMethod === 'range'}
                rangeRows={rangeRows}
                styles={styles}
              />
            </div>
          </div>
        </div>
        <Row
          spacing="1rem"
          style={{
            justifyContent: 'flex-end',
            margin: '20px',
          }}
        >
          <span style={{
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
            style={styles.visualizingButton}
          >
            Cancel
          </Button>
          <Button
            disabled={submitDisabled}
            onClick={() => this.handleSubmit()}
            onMouseDown={() => this.handleSubmit()}
            style={submitDisabled
              ? styles.inputDisabled
              : styles.visualizingButton}
          >
            Save Bins
          </Button>
        </Row>
      </Column>
    );
  }
}

export default ContinuousCustomBinsModal;
