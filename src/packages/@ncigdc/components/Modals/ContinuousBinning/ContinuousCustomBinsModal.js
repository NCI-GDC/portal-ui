import React from 'react';
import { compose, withState, withProps } from 'recompose';
import { isFinite } from 'lodash';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { visualizingButton } from '@ncigdc/theme/mixins';
import RangeTableRow from './RangeTableRow';
import BinningMethodInput from './BinningMethodInput';
import CustomIntervalFields from './CustomIntervalFields';

const styles = {
  button: {
    ...visualizingButton,
    minWidth: 100,
  },
  formBg: {
    backgroundColor: '#f5f5f5',
    borderRadius: '5px',
    padding: '0 20px 20px',
    width: '100%',
  },
  rangeTable: {
    column: {
      flex: '1 0 0 ',
      padding: '5px',
    },
    heading: {
      background: '#dedddd',
      display: 'flex',
      fontWeight: 'bold',
      lineHeight: '20px',
      marginBottom: '5px',
      padding: '2px 5px',
    },
    optionsColumn: {
      flex: '0 0 150px',
      padding: '5px',
      textAlign: 'right',
    },
    wrapper: {
      marginBottom: '20px',
      width: '100%',
    },
  },
};

const defaultRangeRow = {
  active: true,
  fields: {
    max: {
      errors: [],
      value: '',
    },
    min: {
      errors: [],
      value: '',
    },
    name: {
      errors: [],
      value: '',
    },
  },
};

export default compose(
  withState('rangeRows', 'setRangeRows', [defaultRangeRow]),
  withState('warning', 'setWarning', ''),
  withState('selectedBinningMethod', 'setSelectedBinningMethod', 'interval'),
  withProps(({
    bins,
  }: any) => {
    const values = Object.keys(bins).map(n => Number(n)).sort((a, b) => a - b);
    const defaultMin = values.length ? values[0] : 0;
    const defaultMax = values.length ? values[values.length - 1] : 0;
    const quartileWithDecimals = (defaultMax - defaultMin) / 4;
    const defaultQuartile = Number(quartileWithDecimals.toFixed(2));

    return ({
      defaultMax,
      defaultMin,
      defaultQuartile,
    });
  }),
  withState('customInterval', 'setCustomInterval', props => {
    const { defaultMax, defaultMin, defaultQuartile } = props;
    return ({
      amount: {
        errors: [],
        value: defaultQuartile,
      },
      max: {
        errors: [],
        value: defaultMax,
      },
      min: {
        errors: [],
        value: defaultMin,
      },
    });
  })
)(
  ({
    customInterval,
    defaultMax,
    defaultMin,
    defaultQuartile,
    fieldName,
    onClose,
    rangeRows,
    selectedBinningMethod,
    setCustomInterval,
    setRangeRows,
    setSelectedBinningMethod,
    warning,
  }) => {
    const updateCustomInterval = (target, inputErrors = null) => {
      const inputKey = target.id.split('-')[2];
      const inputValue = target.value;

      const nextCustomInterval = {
        ...customInterval,
        [inputKey]: {
          errors: inputErrors === null ? customInterval[inputKey].errors : inputErrors,
          value: inputValue,
        },
      };
      setCustomInterval(nextCustomInterval);
    };

    const validateCustomInterval = target => {
      const inputKey = target.id.split('-')[2];
      const inputValue = Number(target.value);

      if (!isFinite(inputValue)) {
        const nanError = [`'${target.value}' is not a valid number.`];
        updateCustomInterval(target, nanError);
        return;
      }

      const currentMin = customInterval.min.value;
      const currentMax = customInterval.max.value;

      const checkMinInRange = currentMin >= defaultMin && currentMin < defaultMax;
      const validMin = checkMinInRange ? currentMin : defaultMin;

      const checkMaxInRange = currentMax > defaultMin && currentMax <= defaultMax;
      const validMax = checkMaxInRange ? currentMax : defaultMax;

      const validAmount = checkMinInRange && checkMaxInRange ? currentMax - currentMin : defaultMax - defaultMin;

      let inputErrors;

      if (inputKey === 'amount') {
        const amountTooLargeError = [`Interval must be less than or equal to ${validAmount}.`];
        const amountTooSmallError = ['Interval must be at least 1.'];
        inputErrors = inputValue < 1 ? amountTooSmallError : inputValue > validAmount ? amountTooLargeError : [];
      } else if (inputKey === 'max') {
        const maxTooSmallError = [`Max must be greater than ${validMin}.`];
        const maxTooLargeError = [`Max must be less than or equal to ${defaultMax}.`];
        inputErrors = inputValue <= validMin ? maxTooSmallError : inputValue > defaultMax ? maxTooLargeError : [];
      } else if (inputKey === 'min') {
        const minTooLargeError = [`Min must be less than ${validMax}.`];
        const maxTooSmallError = [`Min must be greater than or equal to ${defaultMin}.`];
        inputErrors = inputValue >= validMax ? minTooLargeError : inputValue < defaultMin ? maxTooSmallError : [];
      } else {
        inputErrors = [];
      }

      updateCustomInterval(target, inputErrors);
    };

    const updateRangeRows = (target, inputErrors = null) => {
      const targetInfo = target.id.split('-');
      const inputRowIndex = Number(targetInfo[2]);
      const inputKey = targetInfo[3];
      const inputValue = target.value;

      const nextRangeRows = rangeRows.map((rangeRow, rangeRowIndex) => (rangeRowIndex === inputRowIndex
        ? ({
          ...rangeRow,
          fields: {
            ...rangeRow.fields,
            [inputKey]:
            {
              errors: inputErrors === null ? rangeRow.fields[inputKey].errors : inputErrors,
              value: inputValue,
            },
          },
        })
        : rangeRow));

      setRangeRows(nextRangeRows);
    };

    const validateRangeRowsOnSubmit = () => {
      let manualEntryHasEmptyFields = false;

      const emptyNameError = ['Please enter a bin name.'];
      const emptyMinError = ['Please enter a minimum value.'];
      const emptyMaxError = ['Please enter a maximum value.'];

      const rowsWithEmptyFieldErrors = rangeRows.map(row => {
        const isMinEmpty = row.fields.min.value === 0 || row.fields.min.value === '';
        const isMaxEmpty = row.fields.max.value === 0 || row.fields.max.value === '';
        const areMinMaxEmpty = isMinEmpty && isMaxEmpty;
        const isNameEmpty = row.fields.name.value === '';

        if (areMinMaxEmpty || isNameEmpty) manualEntryHasEmptyFields = true;

        return ({
          max: {
            errors: areMinMaxEmpty ? emptyMaxError : row.fields.max.errors,
            value: row.fields.max.value,
          },
          min: {
            errors: areMinMaxEmpty ? emptyMinError : row.fields.min.errors,
            value: row.fields.min.value,
          },
          name: {
            errors: isNameEmpty ? emptyNameError : row.fields.name.errors,
            value: row.fields.name.value,
          },
        });
      });

      if (manualEntryHasEmptyFields) {
        setRangeRows(rowsWithEmptyFieldErrors);
        return false;
      }
    };

    const toggleSubmitButton = () => (selectedBinningMethod === 'interval' ? Object.keys(customInterval).some(field => customInterval[field].errors.length > 0) : rangeRows.some(row => row.active));

    const submitDisabled = toggleSubmitButton();

    return (
      <Column style={{ padding: '20px' }}>
        <h1 style={{ marginTop: 0 }}>
          {`Create Custom Bins: ${fieldName}`}
        </h1>
        <div>
          <p>
            Available values from
            <strong>{` ${defaultMin}`}</strong>
            to
            <strong>{` ${defaultMax} `}</strong>
          </p>
          <p>
            Quartile bin interval:
            <strong>{` ${defaultQuartile}`}</strong>
          </p>
          <p>
            Configure your bins then click
            <strong> Save Bins </strong>
            to update the analysis plots.
          </p>
        </div>
        <Row>
          <Column style={styles.formBg}>
            <h3>Define bins by:</h3>
            <CustomIntervalFields
              customInterval={customInterval}
              disabled={selectedBinningMethod !== 'interval'}
              handleChange={e => {
                updateCustomInterval(e.target);
              }}
              handleUpdateBinningMethod={() => {
                setSelectedBinningMethod('interval');
              }}
              validateCustomInterval={e => {
                validateCustomInterval(e.target);
              }}
              />

            <div className="binning-range">
              <div style={{ marginBottom: '15px' }}>
                <BinningMethodInput
                  binningMethod="range"
                  defaultChecked={selectedBinningMethod === 'range'}
                  label="Manually"
                  onClick={() => {
                    setSelectedBinningMethod('range');
                  }}
                  />
              </div>
              <div style={styles.rangeTable.wrapper}>
                <div style={styles.rangeTable.heading}>
                  <div
                    id="range-table-label-name"
                    style={styles.rangeTable.column}
                    >
                    Bin Name
                  </div>
                  <div
                    id="range-table-label-min"
                    style={styles.rangeTable.column}
                    >
                    From
                  </div>
                  <div
                    id="range-table-label-max"
                    style={styles.rangeTable.column}
                    >
                    To
                  </div>
                  <div
                    id="range-table-label-options"
                    style={styles.rangeTable.optionsColumn}
                    >
                    Options
                  </div>
                </div>
                <div>
                  {rangeRows.map((row, rowIndex) => (
                    <RangeTableRow
                      disabled={!row.active || selectedBinningMethod !== 'range'}
                      handleChange={e => {
                        updateRangeRows(e.target);
                      }}
                      handleRemove={() => {
                        const nextRangeRows = rangeRows.filter((filterRow, filterRowIndex) => filterRowIndex !== rowIndex);
                        setRangeRows(nextRangeRows);
                      }}
                      key={`range-row-${rowIndex}`}
                      row={row}
                      rowIndex={rowIndex}
                      styles={styles.rangeTable}
                      />
                  ))}
                </div>
              </div>
              <Button
                disabled={selectedBinningMethod !== 'range'}
                onClick={() => {
                  const nextRangeRows = [...rangeRows, defaultRangeRow];
                  setRangeRows(nextRangeRows);
                }}
                style={{
                  ...styles.button,
                  display: 'flex',
                  marginLeft: 'auto',
                  maxWidth: '100px',
                  ...(selectedBinningMethod !== 'range' ? styles.inputDisabled : {}),
                }}
                >
                <i aria-hidden="true" className="fa fa-plus-circle" />
                &nbsp; Add
              </Button>
            </div>
          </Column>
        </Row >
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
            visibility: warning.length > 0 ? 'visible' : 'hidden',
          }}
                >
            {`Warning: ${warning}`}
          </span>
          <Button
            onClick={onClose}
            style={styles.button}
            >
            Cancel
          </Button>
          <Button
            disabled={submitDisabled}
            onClick={() => validateRangeRowsOnSubmit()}
            style={styles.button}
            >
            Save Bins
          </Button>
        </Row>
      </Column >
    );
  }
);
