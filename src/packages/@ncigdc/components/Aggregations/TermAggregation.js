/* @flow */

import React from 'react';
import _ from 'lodash';
import LocationSubscriber from '@ncigdc/components/LocationSubscriber';
import {
  compose, withState, withPropsOnChange, pure,
} from 'recompose';

import CloseIcon from '@ncigdc/theme/icons/CloseIcon';
import { IRawQuery } from '@ncigdc/utils/uri/types';
import { parseFilterParam } from '@ncigdc/utils/uri';
import { inCurrentFilters } from '@ncigdc/utils/filters';

import { Row, Column } from '@ncigdc/uikit/Flex';
import CountBubble from '@ncigdc/uikit/CountBubble';
import styled from '@ncigdc/theme/styled';
import Input from '@ncigdc/uikit/Form/Input';
import OverflowTooltippedLabel from '@ncigdc/uikit/OverflowTooltippedLabel';

import { internalHighlight } from '@ncigdc/uikit/Highlight';
import { Container, BucketLink } from '.';

import { IBucket } from './types';

type TProps = {
  buckets: [IBucket],
  collapsed: boolean,
  countLabel: string,
  field: string,
  filteredBuckets: Array<Object>,
  isMatchingSearchValue: boolean,
  maxShowing: number,
  searchValue: string,
  setShowingMore: Function,
  showingMore: boolean,
  showingValueSearch: boolean,
  style: Object,
  title: string,
};

export const ToggleMoreLink = styled.div({
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

const CountLabel = styled.div({
  color: ({ theme }) => theme.greyScale7,
  fontSize: '1.2rem',
  fontWeight: 500,
  marginLeft: 'auto',
});

const BucketRow = styled(Row, {
  padding: '0.3rem 0',
});

export const BottomRow = styled(Row, {
  padding: '0 0.5rem',
});

let input;
const TermAggregation = (props: TProps) => {
  const {
    countLabel, field, filteredBuckets, maxShowing,
  } = props;
  const dotField = field.replace(/__/g, '.');

  return (
    <LocationSubscriber>
      {(ctx: { pathname: string, query: IRawQuery }) => {
        const currentFilters =
          ((ctx.query &&
            parseFilterParam((ctx.query || {}).filters, {}).content) ||
          [])
            .map(filter => ({
              ...filter,
              content: {
                ...filter.content,
                value: typeof filter.content.value === 'string'
                  ? filter.content.value.toLowerCase()
                  : Array.isArray(filter.content.value)
                    ? filter.content.value.map(val => val && `${val}`.toLowerCase())
                    : [],
              },
            }
            ));
        return (
          <Container
            className="test-term-aggregation"
            style={{
              ...props.style,
              paddingBottom: props.collapsed ? 0 : 5,
            }}
            >
            {props.collapsed || (
              <React.Fragment>
                {props.showingValueSearch && (
                  <Row>
                    <Input
                      aria-label="Search..."
                      autoFocus
                      getNode={node => {
                        input = node;
                      }}
                      handleClear={() => {
                        props.setFilter('');
                        input.value = '';
                      }}
                      onChange={() => props.setFilter(input.value)}
                      placeholder="Search..."
                      style={{
                        borderRadius: '4px',
                        marginBottom: '6px',
                      }}
                      value={input ? input.value : ''}
                      />
                  </Row>
                )}

                <Column>
                  {countLabel && (
                    <CountLabel>
                      {`# ${countLabel}`}
                    </CountLabel>
                  )}
                  {_.orderBy(filteredBuckets, 'doc_count', 'desc')
                    .slice(0, props.showingMore ? Infinity : maxShowing)
                    .map(b => ({
                      ...b,
                      name: b.key_as_string || b.key,
                    }))
                    .map(bucket => (
                      <Row key={bucket.name}>
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
                          <input
                            checked={inCurrentFilters({
                              key: bucket.name.toLowerCase(),
                              dotField,
                              currentFilters,
                            })}
                            id={`input-${props.title}-${bucket.name.replace(
                              /\s/g,
                              '-',
                            )}`}
                            name={`input-${props.title}-${bucket.name.replace(
                              /\s/g,
                              '-',
                            )}`}
                            readOnly
                            style={{
                              pointerEvents: 'none',
                              marginRight: '5px',
                              flexShrink: 0,
                              verticalAlign: 'middle',
                            }}
                            type="checkbox"
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
                            {props.searchValue
                              ? internalHighlight(
                                props.searchValue,
                                bucket.name,
                                {
                                  backgroundColor: '#FFFF00',
                                },
                              )
                              : bucket.name}
                          </OverflowTooltippedLabel>
                        </BucketLink>
                        <CountBubble className="bucket-count">
                          {bucket.doc_count.toLocaleString()}
                        </CountBubble>
                      </Row>
                    ))}
                  {filteredBuckets.length > maxShowing && (
                    <BottomRow>
                      <ToggleMoreLink
                        onClick={() => props.setShowingMore(!props.showingMore)}
                        >
                        {props.showingMore
                          ? 'Less...'
                          : filteredBuckets.length - 5 &&
                          `${filteredBuckets.length - 5} More...`}
                      </ToggleMoreLink>
                    </BottomRow>
                  )}

                  {filteredBuckets.length === 0 && (
                    <span>
                      {(input || { value: '' }).value
                        ? 'No matching values'
                        : 'No data for this field'}
                    </span>
                  )}
                </Column>
              </React.Fragment>
            )}
          </Container>
        );
      }}
    </LocationSubscriber>
  );
};

const enhance = compose(
  withState('showingMore', 'setShowingMore', false),
  withState('filter', 'setFilter', ''),
  withPropsOnChange(
    [
      'buckets',
      'filter',
      'searchValue',
    ],
    ({
      buckets, filter, isMatchingSearchValue, searchValue = '',
    }) => ({
      filteredBuckets: buckets.filter(
        b => b.key !== '_missing' &&
          (b.key || '').length &&
          b.key.toLowerCase().includes(filter.toLowerCase()) &&
          (b.key.toLowerCase().includes(searchValue.toLowerCase()) ||
            isMatchingSearchValue),
      ),
    }),
  ),
  pure,
);

export default enhance(TermAggregation);
