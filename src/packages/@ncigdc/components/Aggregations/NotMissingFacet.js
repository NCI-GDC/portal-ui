/* @flow */

import React from 'react';
import LocationSubscriber from '@ncigdc/components/LocationSubscriber';

import type { TRawQuery } from '@ncigdc/utils/uri/types';
import { parseFilterParam } from '@ncigdc/utils/uri';

import { Row, Column } from '@ncigdc/uikit/Flex';
import CountBubble from '@ncigdc/uikit/CountBubble';
import styled from '@ncigdc/theme/styled';

import { Container, BucketLink } from './';

type TProps = {
  field: string,
  notMissingDocCount: number,
  style: Object,
  title: string,
  collapsed: boolean,
};

const BucketRow = styled(Row, {
  padding: '0.3rem 0',
});

const NotMissingFacet = (props: TProps) => {
  const dotField = props.field.replace(/__/g, '.');
  return (
    <LocationSubscriber>
      {(ctx: {| pathname: string, query: TRawQuery |}) => {
        const currentFilters =
          (ctx.query &&
            parseFilterParam((ctx.query || {}).filters, {}).content) ||
          [];
        return (
          <Container style={props.style} data-test="not-mission-facet">
            {!props.collapsed &&
              <Column>
                <BucketRow>
                  <BucketLink
                    merge="toggle"
                    query={{
                      offset: 0,
                      filters: {
                        op: 'and',
                        content: [
                          {
                            op: 'not',
                            content: { field: dotField, value: ['missing'] },
                          },
                        ],
                      },
                    }}
                  >
                    <input
                      readOnly
                      type="checkbox"
                      style={{
                        pointerEvents: 'none',
                        marginRight: '5px',
                        verticalAlign: 'middle',
                      }}
                      checked={currentFilters.some(
                        ({ op, content: { field, value } }) =>
                          op === 'not' &&
                          field === dotField &&
                          value.includes('missing'),
                      )}
                      id={`input-${props.title}-not-missing`}
                      name={`input-${props.title}-not-missing`}
                    />
                    <label
                      htmlFor={`input-${props.title}-not-missing`}
                      style={{ verticalAlign: 'middle' }}
                    >
                      Not Missing
                    </label>
                  </BucketLink>
                  <CountBubble>
                    {props.notMissingDocCount.toLocaleString()}
                  </CountBubble>
                </BucketRow>
              </Column>}
          </Container>
        );
      }}
    </LocationSubscriber>
  );
};

export default NotMissingFacet;
