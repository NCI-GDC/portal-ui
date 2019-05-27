import React from 'react';
import Button from '@ncigdc/uikit/Button';
import { Tr } from '@ncigdc/uikit/Table';
import BinningInput from './BinningInput';

const RangeTableRow = ({
  disabled,
  handleChange,
  handleRemove,
  row,
  rowIndex,
}) => {
  return (
    <Tr index={rowIndex} key={`range-row-${rowIndex}`}>
      {Object.keys(row).map(rowItem => (
        <td key={`range-row-${rowIndex}-${rowItem}`} style={{ padding: '5px' }}>
          <BinningInput
            binningMethod="range"
            disabled={disabled}
            handleChange={handleChange}
            inputErrors={row[rowItem].errors}
            inputId={`range-row-${rowIndex}-${rowItem}`}
            inputKey={rowItem}
            key={`range-row-${rowIndex}-${rowItem}`}
            rowIndex={rowIndex}
            valid={row[rowItem].errors.length === 0}
            value={row[rowItem].value}
            />
        </td>
      ))}
      <td>
        <Button
          aria-label="Remove"
          disabled={disabled}
          onClick={handleRemove}
          style={{ margin: '0 auto' }}
          >
          <i aria-hidden="true" className="fa fa-trash" />
        </Button>
      </td>
    </Tr>
  );
};

export default RangeTableRow;
