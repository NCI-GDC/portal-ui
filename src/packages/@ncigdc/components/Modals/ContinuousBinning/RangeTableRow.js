import React from 'react';
import Button from '@ncigdc/uikit/Button';
import BinningInput from './BinningInput';

const rowStyles = {
  active: {
    input: {

    },
  },
  fieldsWrapper: {
    display: 'flex',
    flex: '1 0 0',
  },
  optionsButton: {
    display: 'inline-block',
    margin: '2px 0 0 5px',
    textAlign: 'center',
    width: '40px',
  },
};

const RangeTableRow = ({
  disabled,
  handleCancel,
  handleChange,
  handleEdit,
  handleRemove,
  handleSave,
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
      <div style={rowStyles.fieldsWrapper}>
        {
          rangeTableRowFields.map(rowItem => (
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
          ))
        }
      </div>
      <div style={styles.optionsColumn}>
        {row.active ? (
          <React.Fragment>
            <Button
              aria-label="Save"
              buttonContentStyle={{ justifyContent: 'center' }}
              disabled={disabled}
              onClick={handleSave}
              style={{
                ...rowStyles.optionsButton,
                ...(disabled || { background: 'green' }),
              }}
              >
              <i aria-hidden="true" className="fa fa-check" />
            </Button>
            <Button
              aria-label="Cancel"
              buttonContentStyle={{ justifyContent: 'center' }}
              disabled={disabled}
              onClick={handleCancel}
              style={{
                ...rowStyles.optionsButton,
                ...(disabled || { background: 'red' }),
              }}
              >
              <i aria-hidden="true" className="fa fa-close" />
            </Button>
          </React.Fragment>
        ) : (
          <Button
              aria-label="Edit"
              disabled={disabled}
              onClick={handleEdit}
              style={{ ...rowStyles.optionsButton }}
              >
              <i aria-hidden="true" className="fa fa-pencil" />
            </Button>
          )}
        <Button
          aria-label="Remove"
          buttonContentStyle={{ justifyContent: 'center' }}
          disabled={disabled}
          onClick={handleRemove}
          style={{ ...rowStyles.optionsButton }}
          >
          <i aria-hidden="true" className="fa fa-trash" />
        </Button>
      </div>
    </div>
  );
};

export default RangeTableRow;
