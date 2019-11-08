// @flow

// Vendor
import React from 'react';
import { get, trim } from 'lodash';
import {
  compose,
  pure,
  renameProp,
  setDisplayName,
  withHandlers,
  withPropsOnChange,
  withState,
} from 'recompose';

import SearchIcon from 'react-icons/lib/fa/search';
import LocationSubscriber from '@ncigdc/components/LocationSubscriber';
import fetchFileHistory from '@ncigdc/utils/fetchFileHistory';
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
import FileIcon from '@ncigdc/theme/icons/File';
import { isUUID } from '@ncigdc/utils/string';
import {
  Container,
  CheckedRow,
  CheckedLink,
} from '@ncigdc/components/Aggregations/';

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
    color: ({ linkIsActive, theme }) =>
      (linkIsActive ? 'white' : theme.primary),
  },
  ':visited': {
    textDecoration: 'none',
    color: ({ linkIsActive, theme }) =>
      (linkIsActive ? 'white' : theme.primary),
  },
  backgroundColor: ({ linkIsActive }) =>
    (linkIsActive ? 'rgb(31, 72, 108)' : 'inherit'),
  width: '100%',
  textDecoration: 'none',
});

const SuggestionFacet = ({
  active,
  collapsed,
  doctype,
  dropdownItem,
  facetSearch,
  fieldNoDoctype,
  historyResults,
  inputValue,
  loading,
  placeholder,
  results,
  selectableList,
  setActive,
  setFacetSearch,
  setInputValue,
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
          <Container
            className="test-suggestion-facet"
            data-test="suggestion-facet"
            style={style}
            >
            {collapsed || (
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
                        ? get(
                          selectableList,
                            `focusedItem.${fieldNoDoctype}`,
                        )
                        : null // false gets stringify, so value needs to be `null` or `undefined`
                    }
                    handleClear={() => {
                      setInputValue('');
                      setActive(false);
                    }}
                    id={fieldNoDoctype}
                    name={fieldNoDoctype}
                    onChange={({ target: { value = '' } }) => {
                      setInputValue(value);
                      setActive(!!value);
                      value && setFacetSearch(value);
                    }}
                    onClick={({ target: { value = '' } }) => {
                      setInputValue(value);
                      setActive(!!value);
                      value && setFacetSearch(value);
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
                        left: 1,
                        width: '100%',
                        wordBreak: 'break-word',
                      }}
                      >
                      {((results && results[doctype]) || []).map(x => (
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
                            {dropdownItem(x)}
                          </StyledDropdownLink>
                        </Row>
                      ))}
                      {!(results[doctype] || []).length &&
                        !!(historyResults || []).length &&
                        historyResults
                          .filter(result => result.file_change === 'released')
                          .map((result, i) => (
                            <Row
                              key={result.uuid}
                              onClick={() => {
                                setInputValue('');
                                setActive(false);
                              }}
                              onMouseOver={() =>
                                selectableList.setFocusedItem(result)}
                              style={{ alignItems: 'center' }}
                              >
                              <StyledDropdownLink
                                data-link-id={result.uuid}
                                id={result.uuid}
                                linkIsActive={
                                  selectableList.focusedItem === result
                                }
                                merge="add"
                                query={query(result.uuid)}
                                >
                                <FileIcon
                                  style={{
                                    paddingRight: '1rem',
                                    paddingTop: '1rem',
                                  }}
                                  />
                                {result.uuid}
                                <br />
                                File version
                                {' '}
                                {' '}
                                <span style={{ fontWeight: 'bold' }}>
                                  {facetSearch}
                                </span>
                                {' '}
                                was updated
                              </StyledDropdownLink>
                            </Row>
                          ))}
                      {(!!results && get(results, doctype, [])).length === 0 &&
                        historyResults.length === 0 && (
                          <StyledDropdownRow>
                            {loading ? 'Loading' : 'No matching items found'}
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
};

export default compose(
  setDisplayName('EnhancedSuggestionFacet_Modern'),
  withDropdown,
  withState('inputValue', 'setInputValue', ''),
  withState('historyResults', 'setHistoryResults', []),
  withPropsOnChange(
    ['facetSearchHits'],
    async ({
      facetSearch, facetSearchHits, queryType, setHistoryResults,
    }) => {
      if (
        facetSearch &&
        queryType === 'file' &&
        !facetSearchHits.files.length &&
        isUUID(facetSearch)
      ) {
        const history = await fetchFileHistory(trim(facetSearch));
        await setHistoryResults(history);
      } else {
        return facetSearchHits;
      }
    },
  ),
  renameProp('facetSearchHits', 'results'),
  withHandlers({
    // TODO: use router push
    handleSelectItem: () => item =>
      document.querySelector(`[data-link-id="${item.id}"]`).click(),
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
)(SuggestionFacet);
