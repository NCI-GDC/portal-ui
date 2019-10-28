/* @flow */

import React from 'react';
import {
  every, filter, includes, map, noop, omitBy, some, toLower, values,
} from 'lodash';
import { css } from 'glamor';
import {
  compose,
  defaultProps,
  renameProps,
  setDisplayName,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import entityShortnameMapping from '@ncigdc/utils/entityShortnameMapping';
import CloseIcon from '@ncigdc/theme/icons/CloseIcon';
import Highlight from '@ncigdc/uikit/Highlight';
import withSelectableList from '@ncigdc/utils/withSelectableList';
import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';
import tryParseJSON from '@ncigdc/utils/tryParseJSON';

const facetMatchesQuery = ({ facet, query }) => some(
  [facet.field, facet.description].map(toLower),
  searchTarget => includes(searchTarget, query)
);

const styles = {
  header: {
    paddingBottom: 15,
  },
  facetList: {
    borderTop: '1px solid #efefef',
    maxHeight: '70vh',
    overflow: 'auto',
    padding: 0,
    marginLeft: -15,
    marginRight: -15,
    marginBottom: -15,
    listStyleType: 'none',
    backgroundColor: '#505556',
  },
  resultsCount: {
    color: '#bb0e3d',
    display: 'inline',
  },
  facetItem: {
    display: 'flex',
    flexDirection: 'row',
    cursor: 'pointer',
  },
  focusedItem: {
    text: {
      color: '#fff',
    },
    container: {
      backgroundColor: '#1f486c',
    },
  },
  itemIconWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: 32,
    backgroundColor: '#505556',
    flexShrink: 0,
  },
  itemIcon: {
    width: '100%',
    height: '3.2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    backgroundColor: '#453D3D',
  },
  facetTexts: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: '0 0.8em',
  },
  facetTitle: {
    height: '3.2rem',
    display: 'flex',
    alignItems: 'center',
  },
  facetType: {
    color: '#fff',
    backgroundColor: '#525252',
    marginLeft: '0.3rem',
    fontStyle: 'italic',
    borderRadius: '3px',
    padding: '0 5px',
    fontSize: '1rem',
  },
  facetDescription: {
    fontStyle: 'italic',
    color: '#525252',
  },
  uselessFacetVisibilityCheckbox: {
    marginRight: '0.5em',
  },

  highlights: {
    fontSize: '1.14rem',
    fontStyle: 'italic',
    color: '#525252',
  },
};

// Highlighting is frustratingly slow with > 100 items
const ConditionalHighlight = ({ children, condition, search }) => (condition ? (
  <Highlight search={search}>{children}</Highlight>
  ) : (
    <span>{children}</span>
  ));

const FacetSelection = ({
  docType,
  filteredFacets,
  focusedFacet,
  handleClose,
  handleKeyDown,
  handleQueryInputChange,
  handleQueryInputClear,
  handleSelectFacet,
  isCaseInsensitive,
  isLoading,
  query,
  setFocusedFacet,
  setUselessFacetVisibility,
  shouldHideUselessFacets,
  title,
}) => {
  const parsedQuery = isCaseInsensitive ? query.toLowerCase() : query;

  return (
    <div className="test-facet-selection">
      <div {...css(styles.header)}>
        <h2
          data-translate
          style={{
            margin: 0,
            lineHeight: 1.42857143,
          }}
          >
          <span>{title}</span>
          <a
            className="pull-right"
            onClick={handleClose}
            style={{ fontSize: '1.5rem' }}
            >
          Cancel
          </a>
        </h2>

        <div
          style={{
            marginBottom: 15,
          }}
          >
          <label
            htmlFor="quick-search-input"
            style={{
              position: 'relative',
              width: '100%',
            }}
            >
            Search for a field:
            <input
              autoComplete="off"
              autoFocus
              className="form-control"
              defaultValue={query}
              id="quick-search-input"
              onChange={handleQueryInputChange}
              onKeyDown={handleKeyDown}
              placeholder="search"
              type="text"
              value={query}
              />

            {query && (
              <CloseIcon
                onClick={handleQueryInputClear}
                style={{
                  cursor: 'pointer',
                  fontSize: '14px',
                  outline: 0,
                  padding: '10px',
                  position: 'absolute',
                  right: 0,
                  top: '20px',
                  transition: 'all 0.3s ease',
                }}
                />
            )}
          </label>
        </div>

        <h3 {...css(styles.resultsCount)}>
          {`${filteredFacets.length} ${docType} fields`}
        </h3>

        <label className="pull-right" htmlFor="useful-facet-input" role="button" tabIndex={0}>
          <input
            checked={shouldHideUselessFacets}
            className="test-filter-useful-facet"
            id="useful-facet-input"
            onChange={event => setUselessFacetVisibility(event.target.checked)}
            style={styles.uselessFacetVisibilityCheckbox}
            type="checkbox"
            />
        Only show fields with values
        </label>
      </div>

      {isLoading || (
        <ul {...css(styles.facetList)} className="test-search-result-list">
          {map(filteredFacets, facet => {
            const isFocused =
              focusedFacet && facet.full === focusedFacet.full;

            return (
              <li
                className="test-search-result-item"
                key={facet.full}
                onClick={() => handleSelectFacet(facet)}
                onMouseEnter={() => setFocusedFacet(facet)}
                {...css(styles.facetItem)}
                >
                <div {...css(styles.itemIconWrapper)}>
                  <span {...css(styles.itemIcon)}>
                    {
                      entityShortnameMapping[
                        {
                          cases: 'case',
                          files: 'file',
                        }[facet.doc_type]
                      ]
                    }
                  </span>
                </div>
                <div
                  {...css(
                    styles.facetTexts,
                    isFocused && styles.focusedItem.container,
                  )}
                  >
                  <span
                    {...css(
                      styles.facetTitle,
                      isFocused && styles.focusedItem.text,
                    )}
                    >
                    <ConditionalHighlight
                      condition={query.length >= 2}
                      search={parsedQuery}
                      >
                      {facet.field}
                    </ConditionalHighlight>
                    <span {...css(styles.facetType)}>{facet.type}</span>
                  </span>
                  {facet.description && (
                    <p
                      {...css(
                        styles.facetDescription,
                        isFocused && styles.focusedItem.text,
                      )}
                      >
                      <ConditionalHighlight
                        condition={query.length >= 2}
                        search={parsedQuery}
                        >
                        {facet.description}
                      </ConditionalHighlight>
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default compose(
  setDisplayName('EnhancedFacetSelection'),
  withState('query', 'setQuery', ''),
  withState('focusedFacet', 'setFocusedFacet', null),
  defaultProps({
    excludeFacetsBy: noop,
    onRequestClose: noop,
    onSelect: noop,
  }),
  withPropsOnChange(['viewer'], ({ docType, viewer }) => ({
    parsedFacets:
      viewer && viewer.repository[docType].facets
        ? tryParseJSON(viewer.repository[docType].facets, {})
        : {},
  })),
  withPropsOnChange(['parsedFacets'], ({ parsedFacets }) => ({
    usefulFacets: omitBy(
      parsedFacets,
      aggregation => !aggregation ||
        some([
          aggregation.buckets &&
            aggregation.buckets.filter(bucket => bucket.key !== '_missing')
              .length === 0,
          aggregation.count === 0,
          aggregation.count === null,
          aggregation.stats && aggregation.stats.count === 0,
        ]),
    ),
  })),
  withProps(
    ({
      excludeFacetsBy,
      facetMapping,
      isCaseInsensitive,
      query,
      shouldHideUselessFacets,
      usefulFacets,
    }) => ({
      filteredFacets: filter(values(facetMapping), facet => every([
        facetMatchesQuery({
          facet,
          query: isCaseInsensitive ? query.toLowerCase() : query,
        }),
        !excludeFacetsBy(facet),
        !shouldHideUselessFacets ||
            Object.keys(usefulFacets).includes(facet.field),
      ]),),
    }),
  ),
  renameProps({
    onSelect: 'handleSelectFacet',
  }),
  withHandlers({
    handleClose: ({
      onRequestClose,
      setFocusedFacet,
      setQuery,
    }) => () => {
      setQuery('');
      setFocusedFacet(null);
      onRequestClose();
    },
    handleQueryInputChange: ({ setQuery }) => event => setQuery(event.target.value),
    handleQueryInputClear: ({
      setQuery,
    }) => () => setQuery(''),
  }),
  withSelectableList(
    {
      keyHandlerName: 'handleKeyDown',
      listSourcePropPath: 'filteredFacets',
    },
    {
      // TODO: if focused item is off view, scroll into view
      onCancel: ({
        handleClose,
        handleQueryInputClear,
        query,
      }) => (query.length
        ? handleQueryInputClear()
        : handleClose()),
      onFocusItem: (item, { setFocusedFacet }) => setFocusedFacet(item),
      onSelectItem: (item, { handleSelectFacet }) => handleSelectFacet(item),
    },
  ),
)(FacetSelection);
