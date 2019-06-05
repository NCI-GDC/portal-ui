import React from 'react';
import { compose, withState } from 'recompose';
import { isFinite } from 'lodash';
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

    const validateRow = () => {
      // check empty & NaN errors first
      // then make sure that min < max
      const validFields = Object.keys(rowFields).reduce((acc, curr) => {
        const fieldValue = rowFields[curr].value;
        const fieldValueNumber = Number(fieldValue);

        const nextErrors = fieldValue === '' ? ['Required field.'] : curr === 'name' ? [] : isFinite(fieldValueNumber) ? [] : [`'${fieldValue}' is not a number.`];

        return ({
          ...acc,
          [curr]: {
            ...rowFields[curr],
            errors: nextErrors,
          },
        });
      }, {});

      const checkMinMaxValues = validFields.max.errors.length === 0 && validFields.min.errors.length === 0 && Number(validFields.max.value) < Number(validFields.min.value);

      if (checkMinMaxValues) {
        return ({
          ...validFields,
          max: {
            ...validFields.max,
            errors: [`'To' must be greater than ${validFields.min.value}.`],
          },
          min: {
            ...validFields.min,
            errors: [`'From' must be less than ${validFields.max.value}.`],
          },
        });
      }

      return validFields;
    };

    const updateRowField = (target, inputErrors = null) => {
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

      console.log('nextRowFields', nextRowFields);

      setRowFields(nextRowFields);
    };

    const updateRow = updateType => {
      if (updateType === 'cancel') {
        setRowFields(rowFields);
      }

      if (updateType === 'edit' || updateType === 'cancel') {
        const nextRow = {
          active: !rowActive,
          fields: rowFields,
        };
        handleUpdateRow(rowIndex, nextRow);
        setRowActive(!rowActive);
      } else if (updateType === 'save') {
        const rowFieldsValidated = validateRow();
        setRowFields(rowFieldsValidated);

        const rowIsValid = Object.keys(rowFieldsValidated).filter(field => rowFieldsValidated[field].errors.length > 0).length === 0;

        if (rowIsValid) {
          const nextRow = {
            active: !rowActive,
            fields: rowFieldsValidated,
          };
          setRowActive(!rowActive);
          handleUpdateRow(nextRow);
        }
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
                    updateRowField(e.target);
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
