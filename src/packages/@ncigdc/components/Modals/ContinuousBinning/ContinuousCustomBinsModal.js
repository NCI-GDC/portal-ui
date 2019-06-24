import React, { Component } from 'react';
import { isFinite } from 'lodash';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import RangeTableRow from './RangeTableRow';
import BinningMethodInput from './BinningMethodInput';
import CustomIntervalFields from './CustomIntervalFields';
import styles from './styles';

const defaultRangeRow = [
  {
    active: true,
    fields: {
      from: '',
      name: '',
      to: '',
    },
  },
];

// const defaultRangesTESTWithOverlap = [
//   {
//     active: false,
//     fields: {
//       from: '1',
//       name: 'a',
//       to: '2',
//     },
//   },
//   {
//     active: false,
//     fields: {
//       from: '3',
//       name: 'b',
//       to: '4',
//     },
//   },
//   {
//     active: false,
//     fields: {
//       from: '0',
//       name: 'c',
//       to: '5',
//     },
//   },
// ];

// const defaultRangesTESTNoOverlap = [
//   {
//     active: false,
//     fields: {
//       from: '0',
//       name: 'a',
//       to: '10000',
//     },
//   },
//   {
//     active: false,
//     fields: {
//       from: '10001',
//       name: 'b',
//       to: '15000',
//     },
//   },
//   {
//     active: false,
//     fields: {
//       from: '15001',
//       name: 'c',
//       to: '20000',
//     },
//   },
// ];

const countDecimals = num => {
  return Math.floor(num) === num ? 0 : (num.toString().split('.')[1].length || 0);
};

class ContinuousCustomBinsModal extends Component {
  state = {
    binningMethod: 'range', // interval or range
    intervalErrors: {
      amount: '',
      max: '',
      min: '',
    },
    intervalFields: {
      // seed input values, from props
      amount: this.props.defaultData.quartile,
      max: this.props.defaultData.max,
      min: this.props.defaultData.min,
    },
    modalWarning: '',
    rangeNameErrors: [],
    rangeOverlapErrors: [],
    rangeRows: defaultRangeRow,
    // rangeRows: defaultRangesTESTWithOverlap,
    // rangeRows: defaultRangesTESTNoOverlap,
  };

  componentDidMount = () => {
    const { rangeRows } = this.props;
    this.validateRangeRow(rangeRows);
  }

  // binning method: interval

  updateIntervalFields = (target, inputError = null) => {
    const { intervalErrors, intervalFields } = this.state;
    const inputKey = target.id.split('-')[2];
    const inputValue = target.value;

    const nextIntervalFields = {
      ...intervalFields,
      [inputKey]: inputValue,
    };

    const nextIntervalErrors = {
      ...intervalErrors,
      [inputKey]: inputError === null ? intervalErrors[inputKey] : inputError,
    };

    this.setState({
      intervalErrors: nextIntervalErrors,
      intervalFields: nextIntervalFields,
    });
  };

  validateIntervalFields = target => {
    const { defaultData } = this.props;
    const { intervalFields } = this.state;
    const inputKey = target.id.split('-')[2];
    const inputValue = Number(target.value);

    if (!isFinite(inputValue)) {
      const nanError = [`'${target.value}' is not a valid number.`];
      this.updateIntervalFields(target, nanError);
      return;
    }

    const currentMin = intervalFields.min;
    const currentMax = intervalFields.max;

    const checkMinInRange = currentMin >= defaultData.min && currentMin < defaultData.max;
    const validMin = checkMinInRange ? currentMin : defaultData.min;

    const checkMaxInRange = currentMax > defaultData.min && currentMax <= defaultData.max;
    const validMax = checkMaxInRange ? currentMax : defaultData.max;

    const validAmount = checkMinInRange && checkMaxInRange ? currentMax - currentMin : defaultData.max - defaultData.min;

    let inputError;

    const decimalError = 'Use up to 2 decimal places.';

    if (inputValue === '') {
      inputError = 'Required field.';
    } else {
      inputError = countDecimals(inputValue) > 2 ? decimalError : inputError;
    }

    if (inputError !== '') {
      this.updateIntervalFields(target, inputError);
      return;
    }

    if (inputKey === 'amount') {
      const amountTooLargeError = `Must be less than or equal to ${validAmount}.`;
      const amountTooSmallError = 'Must be greater than 0.';
      inputError = inputValue <= 0 ? amountTooSmallError : inputValue > validAmount ? amountTooLargeError : '';
      inputError = countDecimals(inputValue) > 2 ? decimalError : inputError;
    } else if (inputKey === 'max') {
      const maxTooSmallError = `Must be greater than ${validMin}.`;
      const maxTooLargeError = `Must be less than or equal to ${defaultData.max}.`;
      inputError = inputValue <= validMin ? maxTooSmallError : inputValue > defaultData.max ? maxTooLargeError : '';
      inputError = countDecimals(inputValue) > 2 ? decimalError : inputError;
    } else if (inputKey === 'min') {
      const minTooLargeError = `Must be less than ${validMax}.`;
      const maxTooSmallError = `Must be greater than or equal to ${defaultData.min}.`;
      inputError = inputValue >= validMax ? minTooLargeError : inputValue < defaultData.min ? maxTooSmallError : '';
      inputError = countDecimals(inputValue) > 2 ? decimalError : inputError;
    } else {
      inputError = '';
    }

    this.updateIntervalFields(target, inputError);
  };

  checkSubmitDisabled = () => {
    const {
      binningMethod, intervalErrors, rangeOverlapErrors, rangeRows,
    } = this.state;
    const checkInterval = Object.keys(intervalErrors)
      .filter(int => intervalErrors[int] !== '').length > 0;
    const checkRange = rangeRows
      .filter(row => row.active).length > 0;
    const checkOverlap = rangeOverlapErrors.filter(err => err.length > 0).length > 0;
    const result = binningMethod === 'interval' ? checkInterval : checkRange || checkOverlap;
    return result;
  };

  // binning method: range

  handleRemoveRow = rowIndex => {
    const { rangeRows } = this.state;
    const filteredRangeRows = rangeRows.filter((filterRow, filterRowIndex) => filterRowIndex !== rowIndex);
    const nextRangeRows = filteredRangeRows.length === 0 ? defaultRangeRow : filteredRangeRows;
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

  handleUpdateRow = (inputRowIndex, inputRow) => {
    const { rangeRows } = this.state;
    const nextRangeRows = rangeRows.map((rangeRow, rowIndex) => (rowIndex === inputRowIndex ? inputRow : rangeRow));

    const rowHasErrors = this.validateRangeRow(nextRangeRows);
    if (rowHasErrors) return;

    const checkIsLastRow = inputRowIndex + 1 === rangeRows.length;
    const addNewRow = nextRangeRows.concat(defaultRangeRow);

    this.setState({ rangeRows: checkIsLastRow ? addNewRow : nextRangeRows });
  }

  // submit

  handleSubmit = () => {
    const formHasErrors = this.validateRangeRow();

    if (!formHasErrors) {
      const { onUpdate } = this.props;
      const { rangeRows } = this.state;

      const newBins = rangeRows.map(row => row.fields).reduce((acc, curr) => {
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
      }, {});

      onUpdate(newBins);
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

      const overlapNames = rowsToCheck.reduce((acc, curr, overlapIndex) => {
        const overlapFromStr = curr.fields.from;
        const overlapToStr = curr.fields.to;

        if (rowIndex === overlapIndex || curr.fields.from === '' || curr.fields.to === '') {
          return acc;
        }

        const overlapFrom = Number(overlapFromStr);
        const overlapTo = Number(overlapToStr);
        const overlapName = curr.fields.name;

        const hasNoOverlap = rowTo < overlapFrom || rowFrom > overlapTo;

        return hasNoOverlap ? acc : [...acc, overlapName];
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
    const { defaultData, fieldName, onClose } = this.props;
    const {
      binningMethod, intervalErrors, intervalFields, modalWarning, rangeNameErrors, rangeOverlapErrors, rangeRows,
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
            <strong>{` ${defaultData.min} `}</strong>
            to
            <strong>{` ${defaultData.max} `}</strong>
          </p>
          <p>
            Quartile bin interval:
            <strong>{` ${defaultData.quartile}`}</strong>
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
                defaultData={defaultData}
                disabled={binningMethod !== 'interval'}
                handleChange={e => {
                  this.updateIntervalFields(e.target);
                }}
                handleUpdateBinningMethod={() => {
                  this.setState({ binningMethod: 'interval' });
                }}
                intervalErrors={intervalErrors}
                intervalFields={intervalFields}
                validateIntervalFields={e => {
                  this.validateIntervalFields(e.target);
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
                  To
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
                    rowsLength={rangeRows.length}
                    styles={styles}
                  />
                ))}
              </div>
            </div>
            {/* <Button
            disabled={binningMethod !== 'range'}
            onClick={() => {
              const nextRangeRows = [...rangeRows, ...defaultRangeRow];
              this.setState({ rangeRows: nextRangeRows });
            }}
            style={{
              display: 'flex',
              marginLeft: 'auto',
              maxWidth: '100px',
              ...(binningMethod === 'range' ? styles.visualizingButton : styles.inputDisabled),
            }}
          >
            <i aria-hidden="true" className="fa fa-plus-circle" />
            &nbsp; Add
            </Button> */}
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
            style={submitDisabled ? styles.inputDisabled : styles.visualizingButton}
          >
            Save Bins
          </Button>
        </Row>
      </Column>
    );
  }
}

export default ContinuousCustomBinsModal;
