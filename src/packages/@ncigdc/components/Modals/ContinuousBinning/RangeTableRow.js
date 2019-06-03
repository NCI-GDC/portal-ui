import React from 'react';
import Button from '@ncigdc/uikit/Button';
import BinningInput from './BinningInput';

const RangeTableRow = ({
  disabled,
  handleChange,
  handleRemove,
  row,
  rowIndex,
  styles,
}) => {
  // make sure the fields are in order no matter
  // what happens to the object in state
  const rangeTableRowFields = [
    'name',
    'min',
    'max',
  ];
  return (
    <div index={rowIndex} key={`range-row-${rowIndex}`} style={{ display: 'flex' }}>
      <div style={styles.fieldsWrapper}>
        {rangeTableRowFields.map(rowItem => (
          <div
            key={`range-row-${rowIndex}-${rowItem}`}
            style={styles.column}
            >
            <BinningInput
              binningMethod="range"
              disabled={disabled}
              handleChange={handleChange}
              inputErrors={row.fields[rowItem].errors}
              inputId={`range-row-${rowIndex}-${rowItem}`}
              inputKey={rowItem}
              key={`range-row-${rowIndex}-${rowItem}`}
              rowIndex={rowIndex}
              valid={row.fields[rowItem].errors.length === 0}
              value={row.fields[rowItem].value}
              />
          </div>
        ))}
      </div>
      <div style={styles.removeColumn}>
        <Button
          aria-label="Remove"
          disabled={disabled}
          onClick={handleRemove}
          style={{ margin: '2px auto' }}
          >
          <i aria-hidden="true" className="fa fa-trash" />
        </Button>
      </div>
    </div >
  );
};

export default RangeTableRow;
