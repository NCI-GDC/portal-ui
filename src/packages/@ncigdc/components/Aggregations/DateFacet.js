/* @flow */

import React from 'react';
import { compose, withState, mapProps, pure } from 'recompose';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';

import styled from '@ncigdc/theme/styled';
import { Row } from '@ncigdc/uikit/Flex';

import { Container, GoLink } from './';
import './style.css';

const Label = styled.label({
  backgroundColor: ({ theme }) => theme.greyScale5,
  color: ({ theme }) => theme.greyScale2,
  padding: '0.8rem',
  height: '3.4rem',
  border: ({ theme }) => `1px solid ${theme.greyScale4}`,
});

const enhance = compose(
  withState('state', 'setState', {
    date: moment(),
    focused: false,
  }),
  mapProps(({ setState, ...rest }) => ({
    handleDatePicked: date => setState(s => ({ ...s, date })),
    setState,
    ...rest,
  })),
  pure,
);

type TProps = {
  field: string,
  query: Object,
  title: string,
  collapsed: boolean,
  state: {
    date: any,
    focused: boolean,
  },
  setState: Function,
  style: Object,
  handleToChanged: Function,
  handleFromChanged: Function,
};

const DateFacet = (props: TProps) => {
  const dotField = props.field.replace(/__/g, '.');
  const query = {
    offset: 0,
    filters: {
      op: 'and',
      content: [
        {
          op: '>=',
          content: {
            field: dotField,
            value: [(props.state.date || moment()).format('YYYY-MM-DD')],
          },
        },
      ],
    },
  };

  return (
    <Container style={{ ...props.style }} data-test="date-facet">
      {!props.collapsed &&
        <Row>
          <Label
            style={{
              borderRight: 0,
              borderRadius: '4px 0 0 4px',
            }}
            htmlFor={`since-${dotField}`}
          >
            since
          </Label>
          <SingleDatePicker
            id="date_input"
            date={props.state.date}
            displayFormat="YYYY-MM-DD"
            isOutsideRange={() => false}
            focused={props.state.focused}
            onDateChange={date => props.setState(s => ({ ...s, date }))}
            onFocusChange={({ focused }) => {
              props.setState(s => ({ ...s, focused }));
            }}
            enableOutsideDays
          />
          <GoLink merge="merge" query={query} dark={props.state.date}>
            Go!
          </GoLink>
        </Row>}
    </Container>
  );
};

export default enhance(DateFacet);
