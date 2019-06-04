import React from 'react';
import { compose, withState } from 'recompose';
import OutsideClickHandler from 'react-outside-click-handler';
import Button from '@ncigdc/uikit/Button';
import BinningInput from './BinningInput';

const rowStyles = {
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

export default compose(
  withState('rowActive', 'setRowActive', props => props.row.active),
  withState('rowFields', 'setRowFields', props => props.row.fields)
)(
  ({
    disabled,
    handleRemoveRow,
    handleUpdateRow,
    row,
    rowActive,
    rowFields,
    rowIndex,
    setRowActive,
    setRowFields,
    styles,
  }) => {
    const rowFieldsOrder = [
      'name',
      'min',
      'max',
    ];

    const updateRowFields = (target, inputErrors = null) => {
      const targetInfo = target.id.split('-');
      const inputKey = targetInfo[3];
      const inputValue = target.value;

      const nextRowFields = Object.keys(rowFields).reduce((acc, curr) => ({
        ...acc,
        [curr]: {
          ...(curr === inputKey ? ({
            errors: inputErrors === null ? rowFields[inputKey].errors : inputErrors,
            value: inputValue,
          }) : rowFields[curr]),
        },
      }), {});

      setRowFields(nextRowFields);
    };

    const updateRow = (updateType, target) => {
      const inputRowIndex = Number(target.id.split('-')[2]);
      if (updateType === 'cancel' || updateType === 'edit') {
        const nextRow = {
          ...row,
          active: !rowActive,
        };
        setRowActive(!rowActive);
        console.log('nextRow', nextRow);
        handleUpdateRow(inputRowIndex, nextRow);
      } else {
        console.log('updateType', updateType);
      }
    };

    return (
      <OutsideClickHandler
        disabled={!rowActive || disabled}
        display="flex"
        onOutsideClick={e => {
          updateRow('save', e.target);
        }}
      >
        <div style={rowStyles.fieldsWrapper}>
          {
            rowFieldsOrder.map(rowItem => (
              <div
                key={`range-row-${rowIndex}-${rowItem}`}
                style={styles.column}
              >
                <BinningInput
                  binningMethod="range"
                  disabled={!rowActive || disabled}
                  handleChange={e => {
                    updateRowFields(e.target);
                  }}
                  inputErrors={rowFields[rowItem].errors}
                  inputId={`range-row-${rowIndex}-${rowItem}`}
                  inputKey={rowItem}
                  key={`range-row-${rowIndex}-${rowItem}`}
                  rowIndex={rowIndex}
                  valid={rowFields[rowItem].errors.length === 0}
                  value={rowFields[rowItem].value}
                />
              </div>
            ))
          }
        </div>
        <div style={styles.optionsColumn}>
          {rowActive ? (
            <React.Fragment>
              <Button
                aria-label="Save"
                buttonContentStyle={{ justifyContent: 'center' }}
                disabled={disabled}
                id={`range-row-${rowIndex}-save`}
                onClick={e => {
                  updateRow('save', e.target);
                }}
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
                id={`range-row-${rowIndex}-cancel`}
                onClick={e => {
                  updateRow('cancel', e.target);
                }}
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
                id={`range-row-${rowIndex}-edit`}
                onClick={e => {
                  updateRow('edit', e.target);
                }}
                style={{ ...rowStyles.optionsButton }}
              >
                <i aria-hidden="true" className="fa fa-pencil" />
              </Button>
            )}
          <Button
            aria-label="Remove"
            buttonContentStyle={{ justifyContent: 'center' }}
            disabled={disabled}
            id={`range-row-${rowIndex}-remove`}
            onClick={handleRemoveRow}
            style={{ ...rowStyles.optionsButton }}
          >
            <i aria-hidden="true" className="fa fa-trash" />
          </Button>
        </div>
      </OutsideClickHandler>
    );
  }
);
