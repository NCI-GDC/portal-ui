/* @flow */

import React from 'react';
import { compose, withState, mapProps, pure, lifecycle } from 'recompose';
import { isEqual } from 'lodash';

import styled from '@ncigdc/theme/styled';
import withRouter from '@ncigdc/utils/withRouter';
import { parseFilterParam } from '@ncigdc/utils/uri';
import Input from '@ncigdc/uikit/Form/Input';
import { Row, Column } from '@ncigdc/uikit/Flex';
import ExclamationTriangle from '@ncigdc/theme/icons/ExclamationTriangle';

import { Container, InputLabel, GoLink } from './';

const getCurrentFromAndTo = ({ field, query }) => {
  const dotField = field.replace(/__/g, '.');
  const currentFilters =
    (query && parseFilterParam((query || {}).filters, {}).content) || [];
  return currentFilters.reduce(
    (acc, c) =>
      c.content.field === dotField
        ? { ...acc, [c.op]: c.content.value[0] }
        : acc,
    { '>=': undefined, '<=': undefined },
  );
};

const conversionFactor = 365.25;
const warningDays = Math.floor(90 * conversionFactor);
const convertMaxMin = ({ max, min, convertDays, selectedUnit, setState }) => {
  if (convertDays && selectedUnit === 'years') {
    setState(s => ({
      ...s,
      minDisplayed: Math.floor(min / conversionFactor),
      maxDisplayed: Math.ceil((max + 1 - conversionFactor) / conversionFactor),
    }));
  } else {
    setState(s => ({ ...s, maxDisplayed: max || 0, minDisplayed: min || 0 }));
  }
};

const inputChanged = ({ from, to, convertDays, selectedUnit, setState }) => {
  if (!convertDays || selectedUnit === 'days') {
    setState(s => ({
      ...s,
      from: from ? from : undefined,
      to: to ? to : undefined,
      fromDisplayed: from ? from : '',
      toDisplayed: to ? to : '',
    }));
  } else if (selectedUnit === 'years') {
    setState(s => ({
      ...s,
      from: from ? Math.floor(from * conversionFactor) : undefined,
      to: to
        ? Math.floor(to * conversionFactor + conversionFactor - 1)
        : undefined,
      fromDisplayed: from ? from : '',
      toDisplayed: to ? to : '',
    }));
  }
};

const convertInputs = ({ from, to, selectedUnit, setState }) => {
  if (selectedUnit === 'days') {
    setState(s => ({
      ...s,
      from,
      to,
      fromDisplayed: from,
      toDisplayed: to,
    }));
  } else if (selectedUnit === 'years') {
    setState(s => ({
      ...s,
      from,
      to,
      fromDisplayed: Math.ceil(from / conversionFactor),
      toDisplayed: Math.ceil((to + 1 - conversionFactor) / conversionFactor),
    }));
  }
};

const WarningRow = styled(Row, {
  backgroundColor: '#fcf8e3',
  borderColor: '#faebcc',
  color: '#8a6d3b',
  padding: '15px',
  border: '1px solid transparent',
  borderRadius: '4px',
});

const enhance = compose(
  withState('state', 'setState', {
    from: undefined,
    to: undefined,
    fromDisplayed: '',
    toDisplayed: '',
    maxDisplayed: 0,
    minDisplayed: 0,
    selectedUnit: 'years',
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
      const thisFieldCurrent = getCurrentFromAndTo({ field, query });
      const opToWord = { '>=': 'from', '<=': 'to' };
      const newState = Object.keys(thisFieldCurrent)
        .filter(k => thisFieldCurrent[k])
        .reduce(
          (acc, k) => ({ ...acc, [opToWord[k]]: thisFieldCurrent[k] }),
          {},
        );
      if (convertDays) {
        convertInputs({
          from: newState.from,
          to: newState.to,
          selectedUnit,
          setState,
        });
      } else {
        setState(s => ({
          ...s,
          ...newState,
          fromDisplayed: newState.from,
          toDisplayed: newState.to,
        }));
      }
      convertMaxMin({ max, min, convertDays, selectedUnit, setState });
    },
    componentWillReceiveProps(nextProps: Object): void {
      if (
        ['field', 'query', 'max', 'min'].some(
          k => !isEqual(this.props[k], nextProps[k]),
        )
      ) {
        const { field, query, max, min } = nextProps;
        const { state: { selectedUnit }, setState, convertDays } = this.props;
        const thisFieldCurrent = getCurrentFromAndTo({ field, query });
        const opToWord = { '>=': 'from', '<=': 'to' };
        const newState = Object.keys(thisFieldCurrent)
          .filter(k => thisFieldCurrent[k])
          .reduce(
            (acc, k) => ({ ...acc, [opToWord[k]]: thisFieldCurrent[k] }),
            {},
          );
        if (convertDays) {
          convertInputs({
            from: newState.from,
            to: newState.to,
            selectedUnit,
            setState,
          });
        } else {
          setState(s => ({
            ...s,
            ...newState,
            fromDisplayed: newState.from,
            toDisplayed: newState.to,
          }));
        }

        convertMaxMin({ max, min, convertDays, selectedUnit, setState });
      }
    },
  }),
  mapProps(({ setState, max, min, convertDays, ...rest }) => ({
    handleFromChanged: e => {
      const v = e.target.value;
      const { state: { toDisplayed, selectedUnit } } = rest;
      inputChanged({
        from: v,
        to: toDisplayed,
        convertDays,
        selectedUnit,
        setState,
      });
    },
    handleToChanged: e => {
      const v = e.target.value;
      const { state: { fromDisplayed, selectedUnit } } = rest;
      inputChanged({
        from: fromDisplayed,
        to: v,
        convertDays,
        selectedUnit,
        setState,
      });
    },
    handleUnitChanged: e => {
      const v = e.target.value;
      const { state: { from, to } } = rest;
      setState(s => ({ ...s, selectedUnit: v }));
      convertMaxMin({ max, min, convertDays, selectedUnit: v, setState });
      convertInputs({ from, to, selectedUnit: v, setState });
    },
    setState,
    max,
    min,
    convertDays,
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

const RangeFacet = (props: TProps) => {
  const dotField = props.field.replace(/__/g, '.');
  const innerContent = [
    { op: '>=', value: props.state.from },
    { op: '<=', value: props.state.to },
  ]
    .filter(v => v.value)
    .map(v => ({
      op: v.op,
      content: {
        field: dotField,
        value: [v.value],
      },
    }));
  const query = {
    offset: 0,
    filters: {
      op: 'and',
      content: innerContent,
    },
  };
  const { maxDisplayed, minDisplayed } = props.state;

  return (
    <Container style={{ ...props.style }} className="test-range-facet">
      {!props.collapsed &&
        props.convertDays &&
        <Row style={{ marginBottom: '0.5rem' }}>
          <form name={`${dotField}-radio`}>
            <label
              htmlFor={`${dotField}-years-radio`}
              style={{ paddingRight: '10px' }}
            >
              <input
                type="radio"
                value="years"
                onChange={props.handleUnitChanged}
                checked={props.state.selectedUnit === 'years'}
                id={`${dotField}-years-radio`}
                style={{ marginRight: '5px' }}
              />
              Years
            </label>
            <label
              htmlFor={`${dotField}-days-radio`}
              style={{ paddingRight: '10px' }}
            >
              <input
                type="radio"
                value="days"
                onChange={props.handleUnitChanged}
                checked={props.state.selectedUnit === 'days'}
                id={`${dotField}-days-radio`}
                style={{ marginRight: '5px' }}
              />
              Days
            </label>
          </form>
        </Row>}
      {!props.collapsed &&
        <Column>
          <Row>
            <InputLabel
              style={{
                borderRight: 0,
                borderRadius: '4px 0 0 4px',
              }}
              htmlFor={`from-${dotField}`}
            >
              From:
            </InputLabel>
            <Input
              value={props.state.fromDisplayed || ''}
              onChange={props.handleFromChanged}
              id={`from-${dotField}`}
              key={`from-${dotField}`}
              type="number"
              placeholder={`eg. ${minDisplayed}`}
              max={maxDisplayed}
              min={minDisplayed}
              title="todo"
            />
            <InputLabel
              style={{
                borderLeft: 0,
                borderRight: 0,
              }}
              htmlFor={`to-${dotField}`}
            >
              To:
            </InputLabel>
            <Input
              value={props.state.toDisplayed || ''}
              onChange={props.handleToChanged}
              id={`to-${dotField}`}
              key={`to-${dotField}`}
              type="number"
              placeholder={`eg. ${maxDisplayed}`}
              max={maxDisplayed}
              min={minDisplayed}
              title="todo"
            />
            <GoLink
              dark={!!innerContent.length}
              merge="replace"
              query={innerContent.length && query}
            >
              Go!
            </GoLink>
          </Row>
          {props.title === 'Age at Diagnosis' &&
            (props.state.from >= warningDays ||
              props.state.to >= warningDays) &&
            <WarningRow>
              <span>
                <ExclamationTriangle style={{ paddingRight: '5px' }} />
                For health information privacy concerns, individuals over 89
                will all appear as 90 years old. For more information,
                click
                {' '}
                <a
                  href="https://gdc.cancer.gov/about-gdc/gdc-faqs#collapsible-item-618-question"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  here
                </a>
                .
              </span>
            </WarningRow>}
        </Column>}
    </Container>
  );
};

export default enhance(RangeFacet);
