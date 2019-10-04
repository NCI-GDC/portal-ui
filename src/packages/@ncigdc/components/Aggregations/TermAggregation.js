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
  field: string,
  filteredBuckets: Array<Object>,
  style: Object,
  title: string,
  showingValueSearch: boolean,
  collapsed: boolean,
  setShowingMore: Function,
  showingMore: boolean,
  maxShowing: number,
  searchValue: string,
  isMatchingSearchValue: boolean,
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

const BucketRow = styled(Row, {
  padding: '0.3rem 0',
});

export const BottomRow = styled(Row, {
  padding: '0.5rem',
});

let input;
const TermAggregation = (props: TProps) => {
  const dotField = props.field.replace(/__/g, '.');
  const { filteredBuckets, maxShowing, filter } = props;

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
              value: filter.content.value.map(val => val.toLowerCase()),
            },
          }));
        return (
          <Container className="test-term-aggregation" style={{...props.style, paddingBottom: props.collapsed ? 0 : 10}}>
            {!props.collapsed && props.showingValueSearch && (
              <Row>
                <Input
                  aria-label="Search..."
                  autoFocus
                  getNode={node => {
                    input = node;
                  }}
                  onChange={() => props.setFilter(input.value)}
                  placeholder="Search..."
                  style={{
                    borderRadius: '4px',
                    marginBottom: '6px',
                  }}
                  />
                {input && input.value && (
                  <CloseIcon
                    onClick={() => {
                      props.setFilter('');
                      input.value = '';
                    }}
                    style={{
                      position: 'absolute',
                      right: 0,
                      padding: '10px',
                      transition: 'all 0.3s ease',
                      outline: 0,
                    }}
                    />
                )}
              </Row>
            )}
            {!props.collapsed && (
              <Column>
                {_.orderBy(filteredBuckets, 'doc_count', 'desc')
                  .slice(0, props.showingMore ? Infinity : maxShowing)
                  .map(b => ({
                    ...b,
                    name: b.key_as_string || b.key,
                  }))
                  .map(bucket => (
                    <BucketRow key={bucket.name}>
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
                            '-'
                          )}`}
                          name={`input-${props.title}-${bucket.name.replace(
                            /\s/g,
                            '-'
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
                            '-'
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
                    </BucketRow>
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
      buckets, filter, searchValue = '', isMatchingSearchValue,
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
