/* @flow */

import React from 'react';
import _ from 'lodash';
import LocationSubscriber from '@ncigdc/components/LocationSubscriber';
import { compose, withState, withPropsOnChange, pure } from 'recompose';

import CloseIcon from '@ncigdc/theme/icons/CloseIcon';
import type { TRawQuery } from '@ncigdc/utils/uri/types';
import { parseFilterParam } from '@ncigdc/utils/uri';
import { inCurrentFilters } from '@ncigdc/utils/filters';

import { Row, Column } from '@ncigdc/uikit/Flex';
import CountBubble from '@ncigdc/uikit/CountBubble';
import styled from '@ncigdc/theme/styled';
import Input from '@ncigdc/uikit/Form/Input';
import OverflowTooltippedLabel from '@ncigdc/uikit/OverflowTooltippedLabel';

import { Container, BucketLink } from './';

import type { TBucket } from './types';

type TProps = {
  buckets: [TBucket],
  field: string,
  filteredBuckets: Array<Object>,
  style: Object,
  title: string,
  showingValueSearch: boolean,
  collapsed: boolean,
  setShowingMore: Function,
  showingMore: boolean,
};

const ToggleMoreLink = styled.div({
  marginLeft: 'auto',
  color: ({ theme }) => theme.greyScale7,
  fontSize: '1.2rem',
  cursor: 'pointer',
  ':link': {
    color: ({ theme }) => theme.greyScale7,
  },
  ':visited': {
    color: ({ theme }) => theme.greyScale7,
  },
});

const BucketRow = styled(Row, {
  padding: '0.3rem 0',
});

const BottomRow = styled(Row, {
  padding: '0.5rem',
});

const red = '#a82828';
const green = 'rgb(37, 138, 35)';
const white = 'white';

const I = styled.i({
  fontSize: '0.8em',
  padding: '1px',
  borderRadius: '3px',
  border: '1px solid',
  cursor: 'pointer',
  color: ({ active, theme }) => (active ? white : theme.greyScale2),
  backgroundColor: ({ active, color }) => (active ? color : white),
  borderColor: ({ active, color }) => (active ? color + '!important' : white),
  ':hover': {
    borderColor: ({ theme }) => theme.greyScale2 + '!important',
    backgroundColor: ({ theme }) => theme.greyScale2,
    color: 'white',
  },
});

const IExclude = p => <I {...p} color={red} />;
const IIn = p => <I {...p} color={green} />;

let input;
const TermAggregation = compose(
  withState('showingMore', 'setShowingMore', false),
  withState('filter', 'setFilter', ''),
  withPropsOnChange(['buckets', 'filter'], ({ buckets, filter }) => ({
    filteredBuckets: buckets.filter(
      b =>
        b.key !== '_missing' &&
        b.key.toLowerCase().includes(filter.toLowerCase()),
    ),
  })),
  pure,
)((props: TProps) => {
  const dotField = props.field.replace(/__/g, '.');
  const { filteredBuckets } = props;

  return (
    <LocationSubscriber>
      {(ctx: {| pathname: string, query: TRawQuery |}) => {
        const currentFilters =
          (ctx.query &&
            parseFilterParam((ctx.query || {}).filters, {}).content) ||
          [];

        const excluded = currentFilters.filter(
          f => f.op === 'exclude' && f.content.field === dotField,
        );

        return (
          <Container style={props.style} className="test-term-aggregation">
            {!props.collapsed &&
              props.showingValueSearch &&
              <Row>
                <Input
                  getNode={node => {
                    input = node;
                  }}
                  style={{ borderRadius: '4px', marginBottom: '6px' }}
                  onChange={() => props.setFilter(input.value)}
                  placeholder={'Search...'}
                  aria-label="Search..."
                  autoFocus
                />
                {input &&
                  input.value &&
                  <CloseIcon
                    style={{
                      position: 'absolute',
                      right: 0,
                      padding: '10px',
                      transition: 'all 0.3s ease',
                      outline: 0,
                    }}
                    onClick={() => {
                      props.setFilter('');
                      input.value = '';
                    }}
                  />}
              </Row>}
            {!props.collapsed &&
              <Column>
                {excluded.length > 0 &&
                  <Column>
                    {excluded.map(f =>
                      <Column key={f.content.field}>
                        {f.content.value.map((v: string) =>
                          <BucketRow key={v} spacing="0.5rem">
                            <BucketLink
                              className="bucket-link"
                              merge="toggle"
                              query={{
                                offset: 0,
                                filters: {
                                  op: 'and',
                                  content: [
                                    {
                                      op: 'exclude',
                                      content: {
                                        field: dotField,
                                        value: [v],
                                      },
                                    },
                                  ],
                                },
                              }}
                            >
                              <IExclude className="fa fa-ban" active />
                            </BucketLink>
                            <BucketLink
                              className="bucket-link"
                              merge="flip"
                              query={{
                                offset: 0,
                                filters: {
                                  op: 'and',
                                  content: [
                                    {
                                      op: 'in',
                                      content: {
                                        field: dotField,
                                        value: [v],
                                      },
                                    },
                                  ],
                                },
                              }}
                            >
                              <IIn className="fa fa-check" />
                              <OverflowTooltippedLabel
                                htmlFor={`input-${props.title}-${v.replace(
                                  /\s/g,
                                  '-',
                                )}`}
                                style={{
                                  marginLeft: '0.3rem',
                                  verticalAlign: 'middle',
                                }}
                              >
                                {v}
                              </OverflowTooltippedLabel>
                            </BucketLink>
                          </BucketRow>,
                        )}
                      </Column>,
                    )}
                  </Column>}
                <Column>
                  {_.orderBy(filteredBuckets, 'doc_count', 'desc')
                    .filter(
                      b =>
                        !excluded.find(f =>
                          f.content.value.find(
                            v => v === (b.key_as_string || b.key),
                          ),
                        ),
                    )
                    .slice(0, props.showingMore ? Infinity : 5)
                    .map(b => ({ ...b, name: b.key_as_string || b.key }))
                    .map(bucket =>
                      <BucketRow key={bucket.name} spacing="0.5rem">
                        <BucketLink
                          className="bucket-link"
                          merge="toggle"
                          query={{
                            offset: 0,
                            filters: {
                              op: 'and',
                              content: [
                                {
                                  op: 'exclude',
                                  content: {
                                    field: dotField,
                                    value: [bucket.name],
                                  },
                                },
                              ],
                            },
                          }}
                        >
                          <IExclude className="fa fa-ban" />
                        </BucketLink>
                        <BucketLink
                          className="bucket-link"
                          merge="toggle"
                          query={{
                            offset: 0,
                            filters: {
                              op: 'and',
                              content: [
                                {
                                  op: 'in',
                                  content: {
                                    field: dotField,
                                    value: [bucket.name],
                                  },
                                },
                              ],
                            },
                          }}
                        >
                          <IIn
                            className="fa fa-check"
                            active={inCurrentFilters({
                              key: bucket.name,
                              dotField,
                              currentFilters,
                            })}
                          />
                          <OverflowTooltippedLabel
                            htmlFor={`input-${props.title}-${bucket.name.replace(
                              /\s/g,
                              '-',
                            )}`}
                            style={{
                              marginLeft: '0.3rem',
                              verticalAlign: 'middle',
                            }}
                          >
                            {bucket.name}
                          </OverflowTooltippedLabel>
                        </BucketLink>
                        <CountBubble
                          className="bucket-count"
                          style={{ marginLeft: 'auto' }}
                        >
                          {bucket.doc_count.toLocaleString()}
                        </CountBubble>
                      </BucketRow>,
                    )}
                  {filteredBuckets.length > 5 &&
                    <BottomRow>
                      <ToggleMoreLink
                        onClick={() => props.setShowingMore(!props.showingMore)}
                      >
                        {props.showingMore
                          ? 'Less...'
                          : filteredBuckets.length - 5 &&
                              `${filteredBuckets.length - 5} More...`}
                      </ToggleMoreLink>
                    </BottomRow>}

                  {filteredBuckets.length === 0 &&
                    <span>
                      {(input || { value: '' }).value
                        ? 'No matching values'
                        : 'No data for this field'}
                    </span>}
                </Column>
              </Column>}
          </Container>
        );
      }}
    </LocationSubscriber>
  );
});

export default TermAggregation;
