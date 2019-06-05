import React from 'react';
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

class RangeTableRow extends React.Component {
  state = {
    fieldValues: {
      max: '',
      min: '',
      name: '',
    },
  };

  rowFieldsOrder = [
    'name',
    'min',
    'max',
  ];

  updateRow = updateType => {
    const {
      handleUpdateRow,
      rowIndex,
    } = this.props;
    const {
      rowActive,
    } = this.state;

    if (updateType === 'cancel') {
      this.resetToModalState();
    }

    if (updateType === 'edit' || updateType === 'cancel') {
      const nextRow = {
        active: !rowActive,
      };
      console.log('roxIndex', rowIndex);
      handleUpdateRow(rowIndex, nextRow);
      this.setState({ rowActive: !rowActive });
    } else if (updateType === 'save') {
      const rowFieldsValidated = this.validateRow();
      // setRowFields(rowFieldsValidated);

      const rowIsValid = Object.keys(rowFieldsValidated).filter(field => rowFieldsValidated[field].errors.length > 0).length === 0;

      if (rowIsValid) {
        const nextRow = {
          active: !rowActive,
          fields: rowFieldsValidated,
        };
        this.setState({ rowActive: !rowActive });
        console.log('rangetablerow rowIndex', rowIndex);
        handleUpdateRow(rowIndex, nextRow);
      }
    }
  };

  updateInput = target => {
    const inputKey = target.id.split('-')[3];
    const inputValue = target.value;

    const { fieldValues } = this.state;

    this.setState({
      fieldValues: {
        ...fieldValues,
        [inputKey]: inputValue,
      },
    });
  };

  updateRowField = (target, inputErrors = null) => {
    const {
      fields,
      handleUpdateRow,
      rowIndex,
    } = this.props;

    const { values } = this.props;

    const targetInfo = target.id.split('-');
    const inputKey = targetInfo[3];
    const inputValue = target.value;

    const nextRowFields = Object.keys(fields).reduce((acc, curr) => ({
      ...acc,
      [curr]: {
        ...(curr === inputKey ? ({
          errors: inputErrors === null ? fields[inputKey].errors : inputErrors,
          value: inputValue,
        }) : fields[curr]),
      },
    }), {});

    // setRowFields(nextRowFields);
    handleUpdateRow(rowIndex, {
      active: true,
      fields: nextRowFields,
    });
  };

  validateRow = () => {
    const {
      fields,
    } = this.props;
    // check empty & NaN errors first
    // then make sure that min < max
    const validFields = Object.keys(fields).reduce((acc, curr) => {
      const fieldValue = fields[curr].value;
      const fieldValueNumber = Number(fieldValue);

      const nextErrors = fieldValue === '' ? ['Required field.'] : curr === 'name' ? [] : isFinite(fieldValueNumber) ? [] : [`'${fieldValue}' is not a number.`];

      return ({
        ...acc,
        [curr]: {
          ...fields[curr],
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

  resetToModalState = () => {
    const {
      max,
      min,
      name,
    } = this.props;
    this.setState({
      fieldValues: {
        max,
        min,
        name,
      },
    });
  }

  componentDidMount = () => {
    this.resetToModalState();
  };

  render = () => {
    const {
      handleRemoveRow,
      rangeMethodActive,
      rowActive,
      rowIndex,
      styles,
    } = this.props;

    const { fieldValues } = this.state;

    const fieldErrors = {
      max: '',
      min: '',
      name: '',
    };

    return (
      <OutsideClickHandler
        disabled={!rowActive || !rangeMethodActive}
        display="flex"
        onOutsideClick={e => {
          console.log('click!');
          // updateRow('save', e.target);
        }}
      >
        <div style={rowStyles.fieldsWrapper}>
          {
            this.rowFieldsOrder.map(rowItem => (
              <div
                key={`range-row-${rowIndex}-${rowItem}`}
                style={styles.column}
              >
                <BinningInput
                  binningMethod="range"
                  disabled={!rowActive || !rangeMethodActive}
                  handleChange={e => {
                    this.updateInput(e.target);
                  }}
                  handleClick={() => { console.log('todo: select binning method or make the field editable'); }}
                  inputError={fieldErrors[rowItem]}
                  inputId={`range-row-${rowIndex}-${rowItem}`}
                  inputKey={rowItem}
                  key={`range-row-${rowIndex}-${rowItem}`}
                  rowIndex={rowIndex}
                  valid={fieldErrors[rowItem].length === 0}
                  value={fieldValues[rowItem]}
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
                disabled={!rangeMethodActive}
                id={`range-row-${rowIndex}-save`}
                onClick={e => {
                  this.updateRow('save', e.target);
                }}
                style={{
                  ...rowStyles.optionsButton,
                  ...(!rangeMethodActive || { background: 'green' }),
                }}
              >
                <i aria-hidden="true" className="fa fa-check" />
              </Button>
              <Button
                aria-label="Cancel"
                buttonContentStyle={{ justifyContent: 'center' }}
                disabled={!rangeMethodActive}
                id={`range-row-${rowIndex}-cancel`}
                onClick={e => {
                  this.updateRow('cancel', e.target);
                }}
                style={{
                  ...rowStyles.optionsButton,
                  ...(!rangeMethodActive || { background: 'red' }),
                }}
              >
                <i aria-hidden="true" className="fa fa-close" />
              </Button>
            </React.Fragment>
          ) : (
              <Button
                aria-label="Edit"
                disabled={!rangeMethodActive}
                id={`range-row-${rowIndex}-edit`}
                onClick={e => {
                  this.updateRow('edit', e.target);
                }}
                style={{ ...rowStyles.optionsButton }}
              >
                <i aria-hidden="true" className="fa fa-pencil" />
              </Button>
            )}
          <Button
            aria-label="Remove"
            buttonContentStyle={{ justifyContent: 'center' }}
            disabled={!rangeMethodActive}
            id={`range-row-${rowIndex}-remove`}
            onClick={() => { handleRemoveRow(rowIndex); }}
            style={{ ...rowStyles.optionsButton }}
          >
            <i aria-hidden="true" className="fa fa-trash" />
          </Button>
        </div>
      </OutsideClickHandler>
    );
  }
}

export default RangeTableRow;
