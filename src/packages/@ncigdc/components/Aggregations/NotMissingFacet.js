/* @flow */

import React from 'react';
import LocationSubscriber from '@ncigdc/components/LocationSubscriber';

import { IRawQuery } from '@ncigdc/utils/uri/types';
import { parseFilterParam } from '@ncigdc/utils/uri';

import { Row, Column } from '@ncigdc/uikit/Flex';
import CountBubble from '@ncigdc/uikit/CountBubble';
import styled from '@ncigdc/theme/styled';

import { Container, BucketLink } from '.';

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

const NotMissingFacet = ({
  field,
  notMissingDocCount,
  style,
  title,
}: TProps) => {
  const dotField = field.replace(/__/g, '.');
  return (
    <LocationSubscriber>
      {(ctx: { pathname: string, query: IRawQuery }) => {
        const currentFilters =
          (ctx.query &&
            parseFilterParam((ctx.query || {}).filters, {}).content) ||
          [];
        return (
          <Container className="test-not-missing-facet" style={style}>
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
                          content: {
                            field: dotField,
                            value: ['missing'],
                          },
                        },
                      ],
                    },
                  }}
                  >
                  <input
                    checked={currentFilters.some(
                      ({ content: { field, value }, op }) =>
                        op === 'not' &&
                        field === dotField &&
                        value.includes('missing'),
                    )}
                    id={`input-${title}-not-missing`}
                    name={`input-${title}-not-missing`}
                    readOnly
                    style={{
                      pointerEvents: 'none',
                      marginRight: '5px',
                      verticalAlign: 'middle',
                    }}
                    type="checkbox"
                    />
                  <label
                    htmlFor={`input-${title}-not-missing`}
                    style={{ verticalAlign: 'middle' }}
                    >
                    Not Missing
                  </label>
                </BucketLink>
                <CountBubble>
                  {notMissingDocCount.toLocaleString()}
                </CountBubble>
              </BucketRow>
            </Column>
          </Container>
        );
      }}
    </LocationSubscriber>
  );
};

export default NotMissingFacet;
