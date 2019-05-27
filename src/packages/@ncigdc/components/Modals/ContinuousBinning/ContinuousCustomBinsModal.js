import React from 'react';
import { compose, withState, withProps } from 'recompose';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { visualizingButton } from '@ncigdc/theme/mixins';
import { Th } from '@ncigdc/uikit/Table';
import RangeTableRow from './RangeTableRow';
import BinningMethodInput from './BinningMethodInput';

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
};

const defaultRangeRow = {
  name: {
    errors: [],
    value: '',
  },
  min: {
    errors: [],
    value: 0,
  },
  max: {
    errors: [],
    value: 0,
  },
};

const defaultRangeRowDisplay = Array(5).fill(defaultRangeRow);

export default compose(
  withState('rangeRows', 'setRangeRows', defaultRangeRowDisplay),
  withState('warning', 'setWarning', ''),
  withState('selectedBinningMethod', 'setSelectedBinningMethod', 'interval'),
  withProps(({
    bins,
  }: any) => {
    const values = Object.keys(bins).map(n => Number(n)).sort((a, b) => a - b);
    const defaultMin = values.length ? values[0] : 0;
    const defaultMax = values.length ? values[values.length - 1] : 0;
    const quartileWithDecimals = (defaultMax - defaultMin) / 4;
    const defaultQuartile = quartileWithDecimals.toFixed(2);

    return ({
      defaultMax,
      defaultMin,
      defaultQuartile,
    });
  }),
  withState('customInterval', 'setCustomInterval', (props) => {
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
    const updateCustomInterval = (target) => {
      const inputKey = target.id.split('-')[2];
      const inputValue = Number(target.value);

      const nextCustomInterval = {
        ...customInterval,
        [inputKey]: inputValue,
      };
      setCustomInterval(nextCustomInterval);
    };

    const updateRangeRows = (inputValue: string, rowIndex: number, inputKey: string) => {
      const nextRangeRows = rangeRows.map((rangeRow, rangeRowIndex) => (rangeRowIndex === rowIndex
        ? Object.assign(
          {},
          rangeRow,
          {
            [inputKey]: Object.assign(
              {},
              rangeRow[inputKey],
              {
                testing: inputKey === 'name' ? inputValue : Number(inputValue),
              }
            ),
          }
        ) : rangeRow));
      setRangeRows(nextRangeRows);
    };

    return (
      <Column style={{ padding: '20px' }}>
        <h1 style={{ marginTop: 0 }}>
          {`Create Custom Bins: ${fieldName}`}
        </h1>
        <div>
          <p>
            Available values from
            {' '}
            <strong>{defaultMin}</strong>
            {' '}
            to
            {' '}
            <strong>{defaultMax}</strong>
          </p>
          <p>
            Quartile bin interval:
            {' '}
            <strong>{defaultQuartile}</strong>
          </p>
          <p>
            Configure your bins then click
            {' '}
            <strong>Save Bins</strong>
            {' '}
            to update the analysis plots.
          </p>
        </div>
        <form>
          <Row>
            <Column style={styles.formBg}>
              <h3>Define bins by:</h3>

              <div className="binning-interval" style={{ marginBottom: '15px' }}>
                <BinningMethodInput
                  binningMethod="interval"
                  defaultChecked={selectedBinningMethod === 'interval'}
                  label="Bin Interval"
                  onClick={() => {
                    setSelectedBinningMethod('interval');
                  }}
                  />

                <input
                  aria-label="bin interval"
                  disabled={selectedBinningMethod !== 'interval'}
                  id="custom-interval-amount"
                  onChange={e => {
                    updateCustomInterval(e.target);
                  }}
                  style={{
                    ...styles.input,
                    ...(selectedBinningMethod === 'interval' ? {} : styles.inputDisabled),
                  }}
                  type="number"
                  value={customInterval.amount}
                  />
                <span>limit values from</span>
                <input
                  aria-label="lower limit"
                  disabled={selectedBinningMethod !== 'interval'}
                  id="custom-interval-min"
                  onChange={e => {
                    updateCustomInterval(e.target);
                  }}
                  style={{
                    ...styles.input,
                    ...(selectedBinningMethod === 'interval' ? {} : styles.inputDisabled),
                  }}
                  type="number"
                  value={customInterval.min}
                  />
                <span>to</span>
                <input
                  arial-label="upper limit"
                  disabled={selectedBinningMethod !== 'interval'}
                  id="custom-interval-max"
                  onChange={e => {
                    updateCustomInterval(e.target);
                  }}
                  style={{
                    ...styles.input,
                    ...(selectedBinningMethod === 'interval' ? {} : styles.inputDisabled),
                  }}
                  type="number"
                  value={customInterval.max}
                  />
              </div>

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
                <table style={{
                  marginBottom: '20px',
                  width: '100%',
                }}
                       >
                  <thead>
                    <tr>
                      <Th id="range-table-label-name" scope="col">Bin Name</Th>
                      <Th id="range-table-label-min" scope="col">From</Th>
                      <Th id="range-table-label-max" scope="col">To</Th>
                      <Th scope="col">Remove</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {rangeRows.map((row, rowIndex) => (
                      <RangeTableRow
                        disabled={selectedBinningMethod !== 'range'}
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
                        />
                    ))}
                  </tbody>
                </table>
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
                  {' '}
                  &nbsp; Add
                </Button>
              </div>
            </Column>
          </Row>
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
              onClick={() => console.log('update')}
              style={styles.button}
              >
              Save Bins
            </Button>
          </Row>
        </form>
      </Column>
    );
  }
);
