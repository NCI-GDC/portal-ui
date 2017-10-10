// @flow

// Vendor
import React from 'react';
import { compose, withState, pure } from 'recompose';
import LocationSubscriber from '@ncigdc/components/LocationSubscriber';

// Custom
import { parseFilterParam } from '@ncigdc/utils/uri';
import { getFilterValue, makeFilter } from '@ncigdc/utils/filters';
import { Row, Column } from '@ncigdc/uikit/Flex';
import CheckCircleOIcon from '@ncigdc/theme/icons/CheckCircleOIcon';
import type { TRawQuery } from '@ncigdc/utils/uri/types';
import Hidden from '../Hidden';
import { Container, GoLink, CheckedRow, CheckedLink } from './';
import Input from '@ncigdc/uikit/Form/Input';
import { Tooltip } from '@ncigdc/uikit/Tooltip';

const ExactMatchFacet = compose(
  withState('inputValue', 'setInputValue', ''),
  pure,
)(
  ({
    title,
    doctype,
    fieldNoDoctype,
    placeholder,
    collapsed,
    inputValue,
    setInputValue,
    style,
  }) => {
    return (
      <LocationSubscriber>
        {(ctx: {| pathname: string, query: TRawQuery |}) => {
          const { filters } = ctx.query || {};
          const currentFilters = parseFilterParam(filters, { content: [] })
            .content;
          const currentValues = getFilterValue({
            currentFilters,
            dotField: `${doctype}.${fieldNoDoctype}`,
          }) || { content: { value: [] } };
          return (
            <Container style={style} className="test-exact-match-facet">
              {!collapsed && (
                <Column>
                  {currentValues.content.value.map(v => (
                    <CheckedRow key={v}>
                      <Tooltip Component="Click to remove">
                        <CheckedLink
                          merge="toggle"
                          query={{
                            filters: makeFilter([
                              {
                                field: `${doctype}.${fieldNoDoctype}`,
                                value: [v],
                              },
                            ]),
                          }}
                        >
                          <CheckCircleOIcon
                            style={{ paddingRight: '0.5rem' }}
                          />
                          {v}
                        </CheckedLink>
                      </Tooltip>
                    </CheckedRow>
                  ))}
                  <Row>
                    <label htmlFor={fieldNoDoctype}>
                      <Hidden>{title}</Hidden>
                    </label>
                    <Input
                      style={{
                        borderRadius: '4px 0 0 4px',
                      }}
                      id={fieldNoDoctype}
                      name={fieldNoDoctype}
                      onChange={e => {
                        setInputValue(e.target.value);
                      }}
                      placeholder={placeholder}
                      value={inputValue}
                    />
                    <GoLink
                      merge="toggle"
                      query={{
                        filters: makeFilter([
                          {
                            field: `${doctype}.${fieldNoDoctype}`,
                            value: [inputValue],
                          },
                        ]),
                      }}
                      dark={!!inputValue}
                      onClick={() => setInputValue('')}
                    >
                      Go!
                    </GoLink>
                  </Row>
                </Column>
              )}
            </Container>
          );
        }}
      </LocationSubscriber>
    );
  },
);

export default ExactMatchFacet;
