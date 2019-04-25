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
import { IRawQuery } from '@ncigdc/utils/uri/types';
import Input from '@ncigdc/uikit/Form/Input';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import Hidden from '../Hidden';
import {
  Container, GoLink, CheckedRow, CheckedLink,
} from '.';

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
        {(ctx: { pathname: string, query: IRawQuery }) => {
          const { filters } = ctx.query || {};
          const currentFilters = parseFilterParam(filters, { content: [] })
            .content;
          const currentValues = getFilterValue({
            currentFilters,
            dotField: `${doctype}.${fieldNoDoctype}`,
          }) || { content: { value: [] } };
          return (
            <Container className="test-exact-match-facet" style={style}>
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
                          }}>
                          <CheckCircleOIcon
                            style={{ paddingRight: '0.5rem' }} />
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
                      id={fieldNoDoctype}
                      name={fieldNoDoctype}
                      onChange={e => {
                        setInputValue(e.target.value);
                      }}
                      placeholder={placeholder}
                      style={{
                        borderRadius: '4px 0 0 4px',
                      }}
                      value={inputValue} />
                    <GoLink
                      dark={!!inputValue}
                      merge="toggle"
                      onClick={inputValue ? () => setInputValue('') : null}
                      query={
                        inputValue && {
                          filters: makeFilter([
                            {
                              field: `${doctype}.${fieldNoDoctype}`,
                              value: [inputValue],
                            },
                          ]),
                        }
                      }
                      style={
                        inputValue
                          ? null
                          : {
                            color: '#6F6F6F',
                            cursor: 'not-allowed',
                          }
                      }>
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
