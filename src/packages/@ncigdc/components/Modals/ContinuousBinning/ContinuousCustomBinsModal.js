import React, { Component } from 'react';
import { isFinite } from 'lodash';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import RangeTableRow from './RangeTableRow';
import BinningMethodInput from './BinningMethodInput';
import CustomIntervalFields from './CustomIntervalFields';
import styles from './styles';

const defaultRangeRow = {
  active: true,
  fields: {
    from: '',
    name: '',
    to: '',
  },
};

const defaultRangesTESTWithOverlap = [
  {
    active: false,
    fields: {
      from: '1',
      name: 'a',
      to: '5000',
    },
  },
  {
    active: false,
    fields: {
      from: '5001',
      name: 'b',
      to: '30000',
    },
  },
  // {
  //   active: false,
  //   fields: {
  //     from: '30002',
  //     name: 'c',
  //     to: '80000',
  //   },
  // },
];

// const defaultRangesTESTNoOverlap = [
//   {
//     active: false,
//     fields: {
//       from: '0',
//       name: 'a',
//       to: '1',
//     },
//   },
//   {
//     active: false,
//     fields: {
//       from: '1',
//       name: 'b',
//       to: '2',
//     },
//   },
//   {
//     active: false,
//     fields: {
//       from: '2',
//       name: 'c',
//       to: '3',
//     },
//   },
// ];

class ContinuousCustomBinsModal extends Component {
  state = {
    binningMethod: 'interval', // or range
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
    rangeOverlapErrors: [],
    rangeRows: [defaultRangeRow],
    // rangeRows: defaultRangesTESTWithOverlap,
    // rangeRows: defaultRangesTESTNoOverlap,
  };

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

    if (inputValue === '') {
      inputError = 'Required field.';
    } else if (inputKey === 'amount') {
      const amountTooLargeError = `Must be less than or equal to ${validAmount}.`;
      const amountTooSmallError = 'Must be greater than 0.';
      inputError = inputValue <= 0 ? amountTooSmallError : inputValue > validAmount ? amountTooLargeError : '';
    } else if (inputKey === 'max') {
      const maxTooSmallError = `Must be greater than ${validMin}.`;
      const maxTooLargeError = `Must be less than or equal to ${defaultData.max}.`;
      inputError = inputValue <= validMin ? maxTooSmallError : inputValue > defaultData.max ? maxTooLargeError : '';
    } else if (inputKey === 'min') {
      const minTooLargeError = `Must be less than ${validMax}.`;
      const maxTooSmallError = `Must be greater than or equal to ${defaultData.min}.`;
      inputError = inputValue >= validMax ? minTooLargeError : inputValue < defaultData.min ? maxTooSmallError : '';
    } else {
      inputError = '';
    }

    this.updateIntervalFields(target, inputError);
  };

  checkSubmitDisabled = () => {
    const { binningMethod, intervalErrors, rangeRows } = this.state;
    const checkInterval = Object.keys(intervalErrors)
      .filter(int => intervalErrors[int] !== '').length > 0;
    const checkRange = rangeRows
      .filter(row => row.active).length > 0;
    return binningMethod === 'interval' ? checkInterval : checkRange;
  };

  // binning method: range

  handleRemoveRow = rowIndex => {
    const { rangeRows } = this.state;
    const filteredRangeRows = rangeRows.filter((filterRow, filterRowIndex) => filterRowIndex !== rowIndex);
    const nextRangeRows = filteredRangeRows.length === 0 ? [defaultRangeRow] : filteredRangeRows;
    this.setState({ rangeRows: nextRangeRows });
  };

  handleToggleActiveRow = (inputRowIndex, inputIsActive) => {
    const { rangeRows } = this.state;
    const nextRangeRows = rangeRows.map((rangeRow, rowIndex) => ({
      ...rangeRow,
      active: rowIndex === inputRowIndex ? inputIsActive : rangeRow.active,
    }));
    this.setState({ rangeRows: nextRangeRows });
  };

  handleUpdateRow = (inputRowIndex, inputRow) => {
    const { rangeOverlapErrors, rangeRows } = this.state;
    const nextRangeRows = rangeRows.map((rangeRow, rowIndex) => (rowIndex === inputRowIndex ? inputRow : rangeRow));
    this.setState({ rangeRows: nextRangeRows }, () => {
      if (rangeOverlapErrors.filter(err => err !== '').length > 0) {
        // console.log('has errors');
        // this.validateOverlap();
        const formHasErrors = this.validateOverlap();
        console.log('formHasErrors', formHasErrors);
      }
    });
  };

  // submit

  handleSubmit = () => {
    const formHasErrors = this.validateOverlap();

    console.log('formHasErrors', formHasErrors);
  }

  validateOverlap = () => {
    // assume all rows are complete and from < to

    const { rangeRows } = this.state;

    const overlapErrors = rangeRows.map((rowItem, rowIndex) => {
      const rowFrom = Number(rowItem.fields.from);
      const rowTo = Number(rowItem.fields.to);

      const overlapNames = rangeRows.reduce((acc, curr, overlapIndex) => {
        if (rowIndex === overlapIndex) return acc;

        const overlapFrom = Number(curr.fields.from);
        const overlapTo = Number(curr.fields.to);
        const overlapName = curr.fields.name;

        const fromHasOverlap = rowFrom >= overlapFrom && rowFrom <= overlapTo;
        const toHasOverlap = rowTo >= overlapFrom && rowTo <= overlapTo;

        const hasOverlap = fromHasOverlap || toHasOverlap;

        return hasOverlap ? [...acc, overlapName] : acc;
      }, []);

      return overlapNames.length > 0 ? overlapNames : '';
    });
    this.setState({ rangeOverlapErrors: overlapErrors });

    return overlapErrors.filter(overlapItem => overlapItem !== '').length > 0;
  }

  render() {
    const { defaultData, fieldName, onClose } = this.props;
    const {
      binningMethod, intervalErrors, intervalFields, modalWarning, rangeOverlapErrors, rangeRows,
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
                    rowOverlapErrors={rangeOverlapErrors[rowIndex]}
                    rowsLength={rangeRows.length}
                    styles={styles}
                    />
                ))}
              </div>
            </div>
            <Button
              disabled={binningMethod !== 'range'}
              onClick={() => {
                const nextRangeRows = [...rangeRows, defaultRangeRow];
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
            </Button>
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
