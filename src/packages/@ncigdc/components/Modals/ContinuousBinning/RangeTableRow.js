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
  withState('rowFields', 'setRowFields', props => props.row.fields)
)(
  ({
    disabled,
    handleChange,
    handleRemove,
    row,
    rowFields,
    rowIndex,
    setRowFields,
    styles,
  }) => {
    // make sure the fields are in order no matter
    // what happens to the object in state
    const rangeTableRowFields = [
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

    const validateFields = () => {
      console.log('validate');
    };

    const updateRowStatus = rowAction => {
      if (rowAction === 'cancel') {
        setRowFields(row.fields);
        handleChange('cancel');
      } else if (rowAction === 'edit') {
        handleChange('edit');
      } else if (rowAction === 'save' || rowAction === 'outside-click') {
        validateFields();
        // valid? send handleChange update
        // invalid? throw errors
      }
    };

    return (
      <OutsideClickHandler
        disabled={disabled || !row.active}
        display="flex"
        onOutsideClick={() => {
          updateRowStatus('outside-click');
        }}
        >
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
          {row.active ? (
            <React.Fragment>
              <Button
                aria-label="Save"
                buttonContentStyle={{ justifyContent: 'center' }}
                disabled={disabled}
                id={`range-row-${rowIndex}-save`}
                onClick={() => {
                  updateRowStatus('save');
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
                onClick={() => {
                  updateRowStatus('cancel');
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
                onClick={() => {
                  updateRowStatus('edit');
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
            onClick={handleRemove}
            style={{ ...rowStyles.optionsButton }}
            >
            <i aria-hidden="true" className="fa fa-trash" />
          </Button>
        </div>
      </OutsideClickHandler>
    );
  }
);
