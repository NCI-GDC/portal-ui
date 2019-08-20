import React from 'react';
import {
  compose,
  lifecycle,
  mapProps,
  pure,
  withState,
} from 'recompose';
import { isEqual } from 'lodash';

import styled from '@ncigdc/theme/styled';
import withRouter from '@ncigdc/utils/withRouter';
import { parseFilterParam } from '@ncigdc/utils/uri';
import Input from '@ncigdc/uikit/Form/Input';
import { Row, Column } from '@ncigdc/uikit/Flex';
import ExclamationTriangle from '@ncigdc/theme/icons/ExclamationTriangle';
import {
  DAYS_IN_YEAR,
  getLowerAgeYears,
  getUpperAgeYears,
} from '@ncigdc/utils/ageDisplay';

import {
  Container,
  GoLink,
  InputLabel,
} from '.';

const getCurrentFromAndTo = ({ field, query }) => {
  const dotField = field.replace(/__/g, '.');
  const currentFilters =
    (query && parseFilterParam((query || {}).filters, {}).content) || [];

  return currentFilters.reduce(
    (acc, c) => (c.content.field === dotField
      ? {
        ...acc,
        [c.op]: c.content.value[0],
      }
      : acc),
    {
      '<=': undefined,
      '>=': undefined,
    },
  );
};

const warningDays = Math.floor(90 * DAYS_IN_YEAR);
const convertMaxMin = ({
  convertDays,
  max,
  min,
  selectedUnit,
  setState,
}) => {
  setState(state => Object.assign(
    {},
    state,
    convertDays && selectedUnit === 'years'
      ? {
        maxDisplayed: Math.ceil((max + 1 - DAYS_IN_YEAR) / DAYS_IN_YEAR),
        minDisplayed: Math.floor(min / DAYS_IN_YEAR),
      }
      : {
        maxDisplayed: max || 0,
        minDisplayed: min || 0,
      },
  ));
};

const inputChanged = ({
  convertDays,
  from,
  selectedUnit,
  setState,
  to,
}) => {
  setState(state => Object.assign(
    {},
    state,
    {
      fromDisplayed: from || '',
      toDisplayed: to || '',
    },
    !convertDays || selectedUnit === 'days'
      ? {
        from: from || undefined,
        to: to || undefined,
      }
      : {
        from: from ? Math.floor(from * DAYS_IN_YEAR) : undefined,
        to: to ? Math.floor(to * DAYS_IN_YEAR + DAYS_IN_YEAR - 1) : undefined,
      },
  ));
};

const convertInputs = ({
  from,
  to,
  selectedUnit,
  setState,
}) => {
  if (selectedUnit === 'days') {
    setState(s => ({
      ...s,
      from,
      fromDisplayed: from,
      to,
      toDisplayed: to,
    }));
  } else if (selectedUnit === 'years') {
    setState(s => ({
      ...s,
      from,
      fromDisplayed: getLowerAgeYears(parseInt(from, 10)),
      to,
      toDisplayed: getUpperAgeYears(parseInt(to, 10)),
    }));
  }
};

const WarningRow = styled(Row, {
  backgroundColor: '#fcf8e3',
  border: '1px solid transparent',
  borderColor: '#faebcc',
  borderRadius: '4px',
  color: '#8a6d3b',
  padding: '15px',
});

const enhance = compose(
  withState('state', 'setState', {
    from: undefined,
    fromDisplayed: '',
    maxDisplayed: 0,
    minDisplayed: 0,
    selectedUnit: 'years',
    to: undefined,
    toDisplayed: '',
  }),
  withRouter,
  lifecycle({
    componentDidMount(): void {
      const {
        field,
        query,
        max,
        min,
        convertDays,
        state: { selectedUnit },
        setState,
      } = this.props;
      const thisFieldCurrent = getCurrentFromAndTo({
        field,
        query,
      });
      const opToWord = {
        '<=': 'to',
        '>=': 'from',
      };
      const newState = Object.keys(thisFieldCurrent)
        .filter(k => thisFieldCurrent[k])
        .reduce(
          (acc, k) => ({
            ...acc,
            [opToWord[k]]: thisFieldCurrent[k],
          }),
          {},
        );
      if (convertDays) {
        convertInputs({
          from: newState.from,
          selectedUnit,
          setState,
          to: newState.to,
        });
      } else {
        setState(s => ({
          ...s,
          ...newState,
          fromDisplayed: newState.from,
          toDisplayed: newState.to,
        }));
      }
      convertMaxMin({
        convertDays,
        max,
        min,
        selectedUnit,
        setState,
      });
    },
    componentWillReceiveProps(nextProps: Object): void {
      if (
        [
          'field',
          'query',
          'max',
          'min',
        ].some(
          k => !isEqual(this.props[k], nextProps[k]),
        )
      ) {
        const {
          field, query, max, min,
        } = nextProps;
        const { state: { selectedUnit }, setState, convertDays } = this.props;
        const thisFieldCurrent = getCurrentFromAndTo({
          field,
          query,
        });
        const opToWord = {
          '<=': 'to',
          '>=': 'from',
        };
        const newState = Object.keys(thisFieldCurrent)
          .filter(k => thisFieldCurrent[k])
          .reduce(
            (acc, k) => ({
              ...acc,
              [opToWord[k]]: thisFieldCurrent[k],
            }),
            {},
          );
        if (convertDays) {
          convertInputs({
            from: newState.from,
            selectedUnit,
            setState,
            to: newState.to,
          });
        } else {
          setState(s => ({
            ...s,
            ...newState,
            fromDisplayed: newState.from,
            toDisplayed: newState.to,
          }));
        }

        convertMaxMin({
          convertDays,
          max,
          min,
          selectedUnit,
          setState,
        });
      }
    },
  }),
  mapProps(({
    setState, max, min, convertDays, ...rest
  }) => ({
    convertDays,
    handleFromChanged: e => {
      const v = e.target.value;
      const { state: { toDisplayed, selectedUnit } } = rest;
      inputChanged({
        convertDays,
        from: v,
        selectedUnit,
        setState,
        to: toDisplayed,
      });
    },
    handleToChanged: e => {
      const v = e.target.value;
      const { state: { fromDisplayed, selectedUnit } } = rest;
      inputChanged({
        convertDays,
        from: fromDisplayed,
        selectedUnit,
        setState,
        to: v,
      });
    },
    handleUnitChanged: e => {
      const v = e.target.value;
      const { state: { from, to } } = rest;
      setState(s => ({
        ...s,
        selectedUnit: v,
      }));
      convertMaxMin({
        convertDays,
        max,
        min,
        selectedUnit: v,
        setState,
      });
      convertInputs({
        from,
        selectedUnit: v,
        setState,
        to,
      });
    },
    max,
    min,
    setState,
    ...rest,
  })),
  pure,
);

type TProps = {
  theme: Object,
  field: string,
  query: Object,
  title: string,
  state: {
    to: number,
    from: number,
    selectedUnit: string,
    fromDisplayed: number,
    toDisplayed: number,
  },
  style: Object,
  toggleCollapsed: Function,
  handleToChanged: Function,
  handleFromChanged: Function,
  handleUnitChanged: Function,
  min: Number,
  max: Number,
  convertDays: boolean,
  collapsed: boolean,
};

const RangeFacet = ({
  collapsed,
  convertDays,
  field,
  handleFromChanged,
  handleToChanged,
  handleUnitChanged,
  state: {
    from,
    fromDisplayed,
    maxDisplayed,
    minDisplayed,
    selectedUnit,
    to,
    toDisplayed,
  },
  style,
  title,
}: TProps) => {
  const dotField = field.replace(/__/g, '.');
  const innerContent = [
    {
      op: '>=',
      value: from,
    },
    {
      op: '<=',
      value: to,
    },
  ]
    .filter(v => v.value)
    .map(v => ({
      content: {
        field: dotField,
        value: [v.value],
      },
      op: v.op,
    }));
  const query = {
    filters: {
      content: innerContent,
      op: 'and',
    },
    offset: 0,
  };

  return (
    <Container
      className="test-range-facet"
      style={{
        ...style,
        paddingBottom: collapsed ? 0 : 10
      }}
      >
      {collapsed || (
        <React.Fragment>
          {convertDays && (
            <Row style={{ marginBottom: '0.5rem' }}>
              <form name={`${dotField}-radio`}>
                <label
                  htmlFor={`${dotField}-years-radio`}
                  style={{ paddingRight: '10px' }}
                  >
                  <input
                    checked={selectedUnit === 'years'}
                    id={`${dotField}-years-radio`}
                    onChange={handleUnitChanged}
                    style={{ marginRight: '5px' }}
                    type="radio"
                    value="years"
                    />
                  Years
                </label>
                <label
                  htmlFor={`${dotField}-days-radio`}
                  style={{ paddingRight: '10px' }}
                  >
                  <input
                    checked={selectedUnit === 'days'}
                    id={`${dotField}-days-radio`}
                    onChange={handleUnitChanged}
                    style={{ marginRight: '5px' }}
                    type="radio"
                    value="days"
                    />
                  Days
                </label>
              </form>
            </Row>
          )}

          <Column>
            <Row>
              <InputLabel
                htmlFor={`from-${dotField}`}
                style={{
                  borderRadius: '4px 0 0 4px',
                  borderRight: 0,
                }}
                >
                From:
              </InputLabel>
              <Input
                id={`from-${dotField}`}
                key={`from-${dotField}`}
                max={maxDisplayed}
                min={minDisplayed}
                onChange={handleFromChanged}
                placeholder={`eg. ${minDisplayed}`}
                style={{
                  paddingLeft: '5px',
                  paddingRight: '5px',
                }}
                title={`Min value: ${minDisplayed}`}
                type="number"
                value={fromDisplayed || ''}
                />

              <InputLabel
                htmlFor={`to-${dotField}`}
                style={{
                  borderLeft: 0,
                  borderRight: 0,
                }}
                >
                To:
              </InputLabel>
              <Input
                id={`to-${dotField}`}
                key={`to-${dotField}`}
                max={maxDisplayed}
                min={minDisplayed}
                onChange={handleToChanged}
                placeholder={`eg. ${maxDisplayed}`}
                style={{
                  paddingLeft: '5px',
                  paddingRight: '5px',
                }}
                title={`Max value: ${maxDisplayed}`}
                type="number"
                value={toDisplayed || ''}
              />

              <GoLink
                dark={!!innerContent.length}
                merge="replace"
                query={innerContent.length ? query : null}
                style={innerContent.length ? null : { color: '#6F6F6F' }}
                >
                Go!
              </GoLink>
            </Row>

            {title === 'Age At Diagnosis' && (
              from >= warningDays ||
              to >= warningDays
              ) && (
                <WarningRow>
                  <span>
                    <ExclamationTriangle style={{ paddingRight: '5px' }} />
                    {`For health information privacy concerns, individuals over 89
                    will all appear as 90 years old. For more information, click `}
                    <a
                      href="https://gdc.cancer.gov/about-gdc/gdc-faqs#collapsible-item-618-question"
                      rel="noopener noreferrer"
                      target="_blank"
                      >
                      here
                    </a>
                    .
                  </span>
                </WarningRow>
              )}
          </Column>
        </React.Fragment>
      )}
    </Container>
  );
};

export default enhance(RangeFacet);
