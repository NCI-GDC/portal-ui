// @flow

// Vendor
import React from 'react';
import _ from 'lodash';
import {
  compose,
  pure,
  renameProp,
  setDisplayName,
  withHandlers,
  withState,
} from 'recompose';
import SearchIcon from 'react-icons/lib/fa/search';
import LocationSubscriber from '@ncigdc/components/LocationSubscriber';

// Custom
import { parseFilterParam } from '@ncigdc/utils/uri';
import { getFilterValue } from '@ncigdc/utils/filters';
import { Row, Column } from '@ncigdc/uikit/Flex';
import withDropdown from '@ncigdc/uikit/withDropdown';
import styled from '@ncigdc/theme/styled';
import { dropdown } from '@ncigdc/theme/mixins';
import Link from '@ncigdc/components/Links/Link';
import CheckCircleOIcon from '@ncigdc/theme/icons/CheckCircleOIcon';
import { IRawQuery } from '@ncigdc/utils/uri/types';
import withSelectableList from '@ncigdc/utils/withSelectableList';
import namespace from '@ncigdc/utils/namespace';
import GeneSymbol from '@ncigdc/modern_components/GeneSymbol';
import Input from '@ncigdc/uikit/Form/Input';
import SetId from '@ncigdc/components/SetId';
import Hidden from '@ncigdc/components/Hidden';

import { Container, CheckedRow, CheckedLink } from '.';

const MagnifyingGlass = styled(SearchIcon, {
  backgroundColor: ({ theme }) => theme.greyScale5,
  color: ({ theme }) => theme.greyScale2,
  padding: '0.8rem',
  width: '3.4rem',
  height: '3.4rem',
  borderRadius: '4px 0 0 4px',
  border: ({ theme }) => `1px solid ${theme.greyScale4}`,
  borderRight: 'none',
});

const StyledDropdownRow = styled(Row, {
  color: ({ theme }) => theme.greyScale4,
  padding: '1rem',
  textDecoration: 'none',
  fontStyle: 'italic',
});

const StyledDropdownLink = styled(Link, {
  padding: '1rem',
  color: ({ theme }) => theme.greyScale2,
  ':link': {
    textDecoration: 'none',
    color: ({ linkIsActive, theme }) => (linkIsActive ? 'white' : theme.primary),
  },
  ':visited': {
    textDecoration: 'none',
    color: ({ linkIsActive, theme }) => (linkIsActive ? 'white' : theme.primary),
  },
  backgroundColor: ({ linkIsActive }) => (linkIsActive ? 'rgb(31, 72, 108)' : 'inherit'),
  width: '100%',
  textDecoration: 'none',
});

const SuggestionFacet = compose(
  setDisplayName('EnhancedSuggestionFacet'),
  withDropdown,
  withState('inputValue', 'setInputValue', ''),
  withState('isLoading', 'setIsLoading', false),
  renameProp('hits', 'results'),
  withHandlers({
    // TODO: use router push
    handleSelectItem: () => item => document.querySelector(`[data-link-id="${item.id}"]`).click(),
  }),
  namespace(
    'selectableList',
    withSelectableList(
      {
        keyHandlerName: 'handleKeyEvent',
        listSourcePropPath: 'results',
      },
      {
        onSelectItem: (item, { handleSelectItem }) => handleSelectItem(item),
      },
    ),
  ),
  pure,
)(
  ({
    active,
    collapsed,
    doctype,
    dropdownItem,
    fieldNoDoctype,
    inputValue,
    isLoading,
    mouseDownHandler,
    mouseUpHandler,
    placeholder,
    results,
    selectableList,
    setActive,
    setAutocomplete,
    setInputValue,
    setIsLoading,
    style,
    title,
  }) => {
    const query = v => ({
      offset: 0,
      filters: {
        op: 'and',
        content: [
          {
            op: 'in',
            content: {
              field: `${doctype}.${fieldNoDoctype}`,
              value: [v],
            },
          },
        ],
      },
    });

    const getCheckedValue = v => {
      if (v.includes('set_id:')) {
        return <SetId set={v} />;
      }
      if (fieldNoDoctype === 'gene_id') {
        return <GeneSymbol geneId={v} />;
      }
      return v;
    };

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
            <Container className="test-suggestion-facet" style={style}>
              {!collapsed && (
                <Column>
                  {[].concat(currentValues.content.value || []).map(v => (
                    <CheckedRow key={v}>
                      <CheckedLink
                        merge="toggle"
                        query={{
                          offset: 0,
                          filters: {
                            op: 'and',
                            content: [
                              {
                                op: 'in',
                                content: {
                                  field: `${doctype}.${fieldNoDoctype}`,
                                  value: [v],
                                },
                              },
                            ],
                          },
                        }}
                        >
                        <CheckCircleOIcon style={{ paddingRight: '0.5rem' }} />
                        {getCheckedValue(v)}
                      </CheckedLink>
                    </CheckedRow>
                  ))}
                  <Row>
                    <label htmlFor={fieldNoDoctype}>
                      <MagnifyingGlass />
                      <Hidden>{title}</Hidden>
                    </label>
                    <Input
                      aria-activedescendant={
                        active
                          ? _.get(
                            selectableList,
                              `focusedItem.${fieldNoDoctype}`,
                          )
                          : null // false gets stringify, so value needs to be `null` or `undefined`
                      }
                      id={fieldNoDoctype}
                      name={fieldNoDoctype}
                      onChange={({ target: { value = '' }}) => {
                        setInputValue(value);
                        setActive(!!value);
                        if (value) {
                          setIsLoading(true);
                          setAutocomplete(
                            value,
                            readyState => _.some([
                              readyState.ready,
                              readyState.aborted,
                              readyState.error,
                            ]) && setIsLoading(false),
                          );
                        }
                      }}
                      onClick={({ target: { value = '' }}) => {
                        setInputValue(value);
                        setActive(!!value);
                        if (value) {
                          setIsLoading(true);
                          setAutocomplete(
                            value,
                            readyState => _.some([
                              readyState.ready,
                              readyState.aborted,
                              readyState.error,
                            ]) && setIsLoading(false),
                          );
                        }
                      }}
                      onKeyDown={selectableList.handleKeyEvent}
                      placeholder={placeholder}
                      style={{ borderRadius: '0 4px 4px 0' }}
                      value={inputValue}
                      {...active && {
                        'aria-owns': `${fieldNoDoctype}-options`,
                      }}
                      />
                    {active && (
                      <Column
                        id={`${fieldNoDoctype}-options`}
                        onClick={e => e.stopPropagation()}
                        style={{
                          ...dropdown,
                          marginTop: 0,
                          top: '35px',
                          width: '300px',
                          wordBreak: 'break-word',
                        }}
                        >
                        {(results || []).map(x => (
                          <Row
                            key={x.id}
                            onClick={() => {
                              setInputValue('');
                              setActive(false);
                            }}
                            onMouseOver={() => selectableList.setFocusedItem(x)}
                            style={{ alignItems: 'center' }}
                            >
                            <StyledDropdownLink
                              data-link-id={x.id}
                              id={x[fieldNoDoctype]}
                              linkIsActive={selectableList.focusedItem === x}
                              merge="add"
                              query={query(x[fieldNoDoctype])}
                              >
                              {dropdownItem(x, inputValue)}
                            </StyledDropdownLink>
                          </Row>
                        ))}
                        {(results || []).length === 0 && (
                          <StyledDropdownRow>
                            {isLoading ? 'Loading' : 'No matching items found'}
                          </StyledDropdownRow>
                        )}
                      </Column>
                    )}
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

export default SuggestionFacet;
