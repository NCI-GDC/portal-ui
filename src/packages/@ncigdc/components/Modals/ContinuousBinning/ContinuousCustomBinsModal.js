import React, { Component } from 'react';
import { isFinite } from 'lodash';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { visualizingButton } from '@ncigdc/theme/mixins';
import RangeTableRow from './RangeTableRow';
import BinningMethodInput from './BinningMethodInput';
import CustomIntervalFields from './CustomIntervalFields';

const styles = {
  button: {
    ...visualizingButton,
    minWidth: 100,
  },
  formBg: {
    backgroundColor: '#f5f5f5',
    borderRadius: '5px',
    padding: '0 20px 20px',
    width: '100%',
  },
  rangeTable: {
    column: {
      flex: '1 0 0 ',
      padding: '5px',
    },
    heading: {
      background: '#dedddd',
      display: 'flex',
      fontWeight: 'bold',
      lineHeight: '20px',
      marginBottom: '5px',
      padding: '2px 5px',
    },
    optionsColumn: {
      flex: '0 0 150px',
      padding: '5px',
      textAlign: 'right',
    },
    wrapper: {
      marginBottom: '20px',
      width: '100%',
    },
  },
};

const defaultRangeRow = {
  active: true,
  fields: {
    from: '',
    name: '',
    to: '',
  },
};

class ContinuousCustomBinsModal extends Component {
  state = {
    binningMethod: 'range', // or interval
    intervalErrors: {
      amount: '',
      max: '',
      min: '',
    },
    intervalFields: {
      // seed input values, from props
      amount: this.props.defaultData.quartile,
      max: this.props.defaultData.max,
      min: this.props.defaultData.min,
    },
    modalWarning: '',
    rangeRows: [defaultRangeRow],
  };

  render() {
    const { defaultData, fieldName } = this.props;
    const {
      binningMethod, intervalErrors, intervalFields,
    } = this.state;

    console.log('intervalFields', intervalFields);
    console.log('intervalErrors', intervalErrors);

    const updateIntervalFields = (target, inputError = null) => {
      const inputKey = target.id.split('-')[2];
      const inputValue = target.value;

      const nextIntervalFields = {
        ...intervalFields,
        [inputKey]: inputValue,
      };

      const nextIntervalErrors = {
        ...intervalErrors,
        [inputKey]: inputError === null ? intervalErrors[inputKey] : inputError,
      };

      this.setState({
        intervalErrors: nextIntervalErrors,
        intervalFields: nextIntervalFields,
      });
    };

    const validateIntervalFields = target => {
      const inputKey = target.id.split('-')[2];
      const inputValue = Number(target.value);

      if (!isFinite(inputValue)) {
        const nanError = [`'${target.value}' is not a valid number.`];
        updateIntervalFields(target, nanError);
        return;
      }

      const currentMin = intervalFields.min.value;
      const currentMax = intervalFields.max.value;

      const checkMinInRange = currentMin >= defaultData.min && currentMin < defaultData.max;
      const validMin = checkMinInRange ? currentMin : defaultData.min;

      const checkMaxInRange = currentMax > defaultData.min && currentMax <= defaultData.max;
      const validMax = checkMaxInRange ? currentMax : defaultData.max;

      const validAmount = checkMinInRange && checkMaxInRange ? currentMax - currentMin : defaultData.max - defaultData.min;

      let inputError;

      if (inputKey === 'amount') {
        const amountTooLargeError = `Interval must be less than or equal to ${validAmount}.`;
        const amountTooSmallError = 'Interval must be at least 1.';
        inputError = inputValue < 1 ? amountTooSmallError : inputValue > validAmount ? amountTooLargeError : '';
      } else if (inputKey === 'max') {
        const maxTooSmallError = `Max must be greater than ${validMin}.`;
        const maxTooLargeError = `Max must be less than or equal to ${defaultData.max}.`;
        inputError = inputValue <= validMin ? maxTooSmallError : inputValue > defaultData.max ? maxTooLargeError : '';
      } else if (inputKey === 'min') {
        const minTooLargeError = `Min must be less than ${validMax}.`;
        const maxTooSmallError = `Min must be greater than or equal to ${defaultData.min}.`;
        inputError = inputValue >= validMax ? minTooLargeError : inputValue < defaultData.min ? maxTooSmallError : '';
      } else {
        inputError = '';
      }

      updateIntervalFields(target, inputError);
    };

    return (
      <Column style={{ padding: '20px' }}>
        <div>
          <h1 style={{ marginTop: 0 }}>
            {`Create Custom Bins: ${fieldName}`}
          </h1>
          <p>
            Available values from
            <strong>{` ${defaultData.min} `}</strong>
            to
            <strong>{` ${defaultData.max} `}</strong>
          </p>
          <p>
            Quartile bin interval:
            <strong>{` ${defaultData.quartile}`}</strong>
          </p>
          <p>
            Configure your bins then click
            <strong> Save Bins </strong>
            to update the analysis plots.
          </p>
        </div>
        <Row>
          <Column style={styles.formBg}>
            <h3>Define bins by:</h3>
            <CustomIntervalFields
              defaultData={defaultData}
              disabled={binningMethod !== 'interval'}
              handleChange={e => {
                updateIntervalFields(e.target);
              }}
              handleUpdateBinningMethod={() => {
                this.setState({ binningMethod: 'interval' });
              }}
              intervalErrors={intervalErrors}
              intervalFields={intervalFields}
              validateIntervalFields={e => {
                validateIntervalFields(e.target);
              }}
              />
          </Column>
        </Row>
      </Column>
    );
  }
}

export default ContinuousCustomBinsModal;
