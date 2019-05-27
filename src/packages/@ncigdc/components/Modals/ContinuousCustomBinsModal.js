import React, { ReactNode } from 'react';
import { compose, withState, withProps } from 'recompose';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { visualizingButton } from '@ncigdc/theme/mixins';
import { Th, Tr } from '@ncigdc/uikit/Table';

const styles = {
  button: {
    ...visualizingButton,
    minWidth: 100,
  },
  formBg: {
    padding: '0 20px 20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '5px',
    width: '100%',
  },
  input: {
    padding: '5px',
    width: '100px',
    margin: '0 10px',
  },
  inputTable: {
    width: '100%',
    padding: '5px',
  },
  inputDisabled: {
    background: '#efefef',
  },
};

const defaultRangeRow = {
  name: {
    errors: [],
    testing: '',
  },
  min: {
    errors: [],
    testing: 0,
  },
  max: {
   errors: [],
   testing: 0,
  },
};

const defaultRangeRowDisplay = Array(5).fill(defaultRangeRow);

export default compose(
  withState('rangeRows', 'setRangeRows', defaultRangeRowDisplay),
  withState('warning' ,'setWarning', ''),
  withState('selectedBinningMethod', 'setSelectedBinningMethod', 'binByInterval'),
  withProps(({
    bins,
  }: any) => {
    const values = Object.keys(bins).map(n => Number(n)).sort((a,b) => a - b);
    const defaultMin = values.length ? values[0] : 0;
    const defaultMax = values.length ? values[values.length - 1] : 0;
    const quartileWithDecimals = (defaultMax - defaultMin) / 4;
    const defaultQuartile = quartileWithDecimals.toFixed(2);

    return ({
      defaultMin,
      defaultMax,
      defaultQuartile,
    });
  }),
  withState('customInterval', 'setCustomInterval', (props) => {
    const { defaultQuartile, defaultMax, defaultMin } = props;
    return ({
      amount: {
        errors: [],
        testing: defaultQuartile,
      },
      max: {
        errors: [],
        testing: defaultMax,
      },
      min: {
        errors: [],
        testing: defaultMin,
      },
    })
  })
)(
  ({
    bins,
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
      const nextRangeRows = rangeRows.map((rangeRow, rangeRowIndex) => rangeRowIndex === rowIndex
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
        ) : rangeRow
      );
      setRangeRows(nextRangeRows);
    };

    return (
      <Column style={{padding: '20px'}}>
        <h1 style={{ marginTop: 0 }}>
          {`Create Custom Bins: ${fieldName}`}
        </h1>
        <div>
          <p>Available values from <strong>{defaultMin}</strong> to <strong>{defaultMax}</strong></p>
          <p>Quartile bin interval: <strong>{defaultQuartile}</strong></p>
          <p>Configure your bins then click <strong>Save Bins</strong> to update the analysis plots.</p>
        </div>
        <form>
          <Row>
            <Column style={styles.formBg}>
              <h3>Define bins by:</h3>

              <div className="binning-interval" style={{marginBottom: '15px'}}>
                <input 
                  type="radio" 
                  id="binning-method-interval"
                  name="binning-method" 
                  value="interval"
                  style={{ marginRight: '15px'}} 
                  onClick={() => {
                    setSelectedBinningMethod('binByInterval');
                  }}
                  defaultChecked={selectedBinningMethod === 'binByInterval'}
                />
                <label htmlFor="binning-method-interval">Bin interval:</label>
                  <input 
                    id="custom-interval-amount" 
                    type="number" 
                    aria-label="bin interval" 
                    style={{
                      ...styles.input, 
                      ...(selectedBinningMethod === 'binByInterval' ? {} : styles.inputDisabled),
                    }}
                    onChange={e => {
                      updateCustomInterval(e.target);
                    }}
                    value={customInterval.amount}
                    disabled={selectedBinningMethod !== 'binByInterval'}
                  />
                <span>limit values from</span>
                <input 
                  id="custom-interval-min" 
                  type="number" 
                  aria-label="lower limit" 
                  style={{
                    ...styles.input, 
                    ...(selectedBinningMethod === 'binByInterval' ? {} : styles.inputDisabled),
                  }}
                  onChange={e => {
                    updateCustomInterval(e.target);
                  }}
                  value={customInterval.min}
                  disabled={selectedBinningMethod !== 'binByInterval'}
                />
                <span>to</span>
                <input 
                  id="custom-interval-max" 
                  type="number" 
                  arial-label="upper limit"
                  style={{
                    ...styles.input, 
                    ...(selectedBinningMethod === 'binByInterval' ? {} : styles.inputDisabled),
                  }}
                  onChange={e => {
                    updateCustomInterval(e.target);
                  }}
                  value={customInterval.max}
                  disabled={selectedBinningMethod !== 'binByInterval'}
                />
              </div>

              <div className="binning-range">
                <div style={{marginBottom: '15px'}}>
                  <input 
                    type="radio" 
                    id="binning-method-range"
                    name="binning-method" 
                    value="range"
                    style={{ marginRight: '15px'}} 
                    onClick={() => {
                      setSelectedBinningMethod('binByRange');
                    }}
                    defaultChecked={selectedBinningMethod === 'binByRange'}
                  />
                  <label htmlFor="binning-method-range">Manually</label>
                </div>
                <table style={{marginBottom: '20px', width: '100%'}}>
                  <thead>
                    <tr>
                      <Th scope="col" id="range-table-label-name">Bin Name</Th>
                      <Th scope="col" id="range-table-label-min">From</Th>
                      <Th scope="col" id="range-table-label-max">To</Th>
                      <Th scope="col">Remove</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {rangeRows.map((row, rowIndex) => (
                      <Tr key={`range-row-${rowIndex}`} index={rowIndex}>
                        {Object.keys(row).map(inputKey => (
                          <td key={`range-row-${rowIndex}-${inputKey}`} style={{padding: '5px'}}>
                            <input 
                              type={inputKey === 'name' ? 'text' : 'number'} 
                              onChange={e => {
                                updateRangeRows(e.target.value, rowIndex, inputKey);
                              }}
                              value={rangeRows[rowIndex][inputKey].testing}
                              aria-labelledby={`range-table-label-${inputKey}`}
                              style={{
                                ...styles.inputTable,
                                ...(selectedBinningMethod === 'binByRange' ? {} : styles.inputDisabled),
                              }}
                              disabled={selectedBinningMethod !== 'binByRange'}
                            />
                          </td>
                        ))}
                        <td>
                          <Button onClick={() => {
                              const nextRangeRows = rangeRows.filter((filterRow, filterRowIndex) => filterRowIndex !== rowIndex);
                              setRangeRows(nextRangeRows);
                            }}
                            aria-label="Remove"
                            style={{margin: '0 auto'}}
                            disabled={selectedBinningMethod !== 'binByRange'}
                          >
                            <i className="fa fa-trash" aria-hidden="true" />
                          </Button>
                        </td>
                      </Tr>
                    ))}
                  </tbody>
                </table>
                <Button onClick={() => {
                    const nextRangeRows = [
                      ...rangeRows, 
                      defaultRangeRow,
                    ];
                    setRangeRows(nextRangeRows);
                  }}
                  style={{
                    ...styles.button, 
                    maxWidth: '100px', 
                    marginLeft: 'auto', 
                    display: 'flex',
                    ...(selectedBinningMethod !== 'binByRange' ? styles.inputDisabled : {}),
                  }}
                  disabled={selectedBinningMethod !== 'binByRange'}
                >
                  <i className="fa fa-plus-circle" aria-hidden="true" /> &nbsp; Add
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
