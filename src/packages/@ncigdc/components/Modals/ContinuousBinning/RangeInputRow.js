import React from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import Button from '@ncigdc/uikit/Button';
import RangeInput from './RangeInput';
import styles from './styles';

const {
  input: {
    inputDisabled,
  },
  optionsButton,
  optionsColumn,
  row: {
    rowError,
    rowFieldsWrapper,
  },
  visualizingButton,
} = styles;

const RangeInputRow = props => {
  const {
    allFieldsEmpty,
    handleAddRow,
    handleRangeInputValidate,
    rangeFieldsOrder,
    rangeInputErrors,
    rangeInputOverlapErrors,
    rangeInputValues,
    rangeMethodActive,
    rowIndex,
    updateRangeInput,
  } = props;

  return (
    <OutsideClickHandler
      disabled={!rangeMethodActive}
      onOutsideClick={handleRangeInputValidate}
      >
      <div style={{ display: 'flex' }}>
        <div
          style={rowFieldsWrapper}
          >
          {
              rangeFieldsOrder.map(rowItem => {
                const rowId = `range-row-${rowIndex}-${rowItem}`;
                return (
                  <RangeInput
                    disabled={!rangeMethodActive}
                    error={rangeInputErrors[rowItem]}
                    errorVisible={rangeMethodActive}
                    handleChange={updateRangeInput}
                    id={rowId}
                    key={rowId}
                    value={rangeInputValues[rowItem]}
                    />
                );
              })}
        </div>
        <div style={optionsColumn}>
          <Button
            aria-label="Add row"
            buttonContentStyle={{ justifyContent: 'center' }}
            disabled={allFieldsEmpty || !rangeMethodActive}
            id={`range-row-${rowIndex}-add`}
            onClick={handleAddRow}
            style={{
              ...(allFieldsEmpty || !rangeMethodActive
                  ? inputDisabled
                  : visualizingButton),
              ...optionsButton,
              width: '100%',
            }}
            >
            <i aria-hidden="true" className="fa fa-plus-circle" />
              &nbsp; Add
          </Button>
        </div>
      </div>
      {rangeMethodActive && rangeInputOverlapErrors.length > 0 && (
        <div style={rowError}>
          {`'${rangeInputValues.name}' overlaps with ${rangeInputOverlapErrors
            .map(err => `'${err}'`).join(', ')}`}
        </div>
      )
        }
    </OutsideClickHandler>
  );
};

export default RangeInputRow;
