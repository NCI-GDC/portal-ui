import React from 'react';
import { isEqual, isFinite } from 'lodash';
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

const defaultFieldState = {
  from: '',
  name: '',
  to: '',
};

class RangeTableRow extends React.Component {
  state = {
    fieldErrors: defaultFieldState,
    fieldValues: defaultFieldState,
  };

  fieldsOrder = [
    'name',
    'from',
    'to',
  ];

  componentDidMount() {
    const { fields } = this.props;
    /* eslint-disable */
    this.setState({ fieldValues: fields });
    /* eslint-enable */
  }


  componentDidUpdate(prevProps) {
    const { fields } = this.props;
    if (!isEqual(fields, prevProps.fields)) {
      /* eslint-disable */
      this.setState({ fieldValues: fields }, () => {
        const validateFieldsResult = this.validateFields();
        this.setState({ fieldErrors: validateFieldsResult });
      });
      /* eslint-enable */
    }
  }

  handleSave = () => {
    const validateFieldsResult = this.validateFields();
    this.setState({ fieldErrors: validateFieldsResult });
    const rowIsValid = Object.keys(validateFieldsResult)
      .filter(field => validateFieldsResult[field].length > 0).length === 0;

    if (rowIsValid) {
      const { handleUpdateRow, rowIndex } = this.props;
      const { fieldValues } = this.state;
      const nextRow = {
        active: false,
        fields: fieldValues,
      };
      handleUpdateRow(rowIndex, nextRow);
    }
  };

  handleEdit = () => {
    const { handleToggleActiveRow, rowIndex } = this.props;
    handleToggleActiveRow(rowIndex, true);
  }

  handleCancel = () => {
    const { fields, handleToggleActiveRow, rowIndex } = this.props;
    this.setState({
      fieldErrors: defaultFieldState,
      fieldValues: fields,
    });
    handleToggleActiveRow(rowIndex, false);
  }

  handleRemove = () => {
    const { handleRemoveRow, rowIndex, rowsLength } = this.props;
    // if removing the only row, just erase the values
    if (rowsLength === 1) {
      this.setState({
        fieldErrors: defaultFieldState,
        fieldValues: defaultFieldState,
      });
    }
    handleRemoveRow(rowIndex);
  }

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

  validateFields = () => {
    const {
      fieldValues,
    } = this.state;
    // check empty & NaN errors first
    // then make sure that from < to
    const errorsEmptyOrNaN = Object.keys(fieldValues).reduce((acc, curr) => {
      const currentValue = fieldValues[curr];
      const currentValueNumber = Number(currentValue);

      const nextErrors = currentValue === ''
        ? 'Required field.' : curr === 'name'
          ? '' : isFinite(currentValueNumber)
            ? '' : `'${currentValue}' is not a number.`;

      return ({
        ...acc,
        [curr]: nextErrors,
      });
    }, {});

    const checkFromToValues = errorsEmptyOrNaN.to === '' &&
      errorsEmptyOrNaN.from === '' &&
      Number(fieldValues.to) <= Number(fieldValues.from);
    return checkFromToValues ? ({
      from: `'From' must be less than ${fieldValues.to}.`,
      name: '',
      to: `'To' must be greater than ${fieldValues.from}.`,
    }) : errorsEmptyOrNaN;
  };

  render = () => {
    const {
      rangeMethodActive,
      rowActive,
      rowIndex,
      rowOverlapErrors,
      styles,
    } = this.props;

    const { fieldErrors, fieldValues } = this.state;

    return (
      <OutsideClickHandler
        disabled={!rowActive || !rangeMethodActive}
        onOutsideClick={() => {
          this.handleSave();
        }}
        >
        <div style={{ display: 'flex' }}>
          <div
            onMouseDown={() => {
              if (!rowActive) this.handleEdit();
            }}
            role="presentation"
            style={rowStyles.fieldsWrapper}
            >
            {
              this.fieldsOrder.map(rowItem => (
                <div
                  key={`range-row-${rowIndex}-${rowItem}`}
                  style={styles.column}
                  >
                  <BinningInput
                    binningMethod="range"
                    disabled={!rowActive || !rangeMethodActive}
                    errorVisible={rangeMethodActive}
                    handleChange={e => {
                      this.updateInput(e.target);
                    }}
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
                  onClick={() => {
                    this.handleSave();
                  }}
                  style={{
                    ...(rangeMethodActive ? { background: 'green' } : styles.inputDisabled),
                    ...rowStyles.optionsButton,
                  }}
                  >
                  <i aria-hidden="true" className="fa fa-check" />
                </Button>
                <Button
                  aria-label="Cancel"
                  buttonContentStyle={{ justifyContent: 'center' }}
                  disabled={!rangeMethodActive}
                  id={`range-row-${rowIndex}-cancel`}
                  onClick={() => {
                    this.handleCancel();
                  }}
                  style={{
                    ...(rangeMethodActive ? { background: 'red' } : styles.inputDisabled),
                    ...rowStyles.optionsButton,
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
                  onClick={() => {
                    this.handleEdit();
                  }}
                  style={{
                    ...(rangeMethodActive ? styles.visualizingButton : styles.inputDisabled),
                    ...rowStyles.optionsButton,
                  }}
                  >
                  <i aria-hidden="true" className="fa fa-pencil" />
                </Button>
              )}
            <Button
              aria-label="Remove"
              buttonContentStyle={{ justifyContent: 'center' }}
              disabled={!rangeMethodActive}
              id={`range-row-${rowIndex}-remove`}
              onClick={() => {
                this.handleRemove();
              }}
              style={{
                ...(rangeMethodActive ? styles.visualizingButton : styles.inputDisabled),
                ...rowStyles.optionsButton,
              }}
              >
              <i aria-hidden="true" className="fa fa-trash" />
            </Button>
          </div>
        </div>
        {rowOverlapErrors && (
          <div style={{
            color: 'red',
            padding: '0 5px 10px',
          }}
               >
            {`${fieldValues.name} overlaps with ${rowOverlapErrors.join(', ')}`}
          </div>
        )}
      </OutsideClickHandler>
    );
  }
}

export default RangeTableRow;
