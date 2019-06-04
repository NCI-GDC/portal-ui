/* @flow */

import React from 'react';
import _ from 'lodash';
import { css } from 'glamor';
import {
  compose,
  defaultProps,
  lifecycle,
  renameProps,
  setDisplayName,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import { fetchApi } from '@ncigdc/utils/ajax';
import entityShortnameMapping from '@ncigdc/utils/entityShortnameMapping';
import Highlight from '@ncigdc/uikit/Highlight';
import withSelectableList from '@ncigdc/utils/withSelectableList';
import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';

const facetMatchesQuery = (facet, query) => _.some(
  [facet.field, facet.description].map(_.toLower),
  searchTarget => _.includes(searchTarget, query),
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

export default compose(
  setDisplayName('EnhancedFacetSelection'),
  withState('facetMapping', 'setFacetMapping', {}),
  withState('query', 'setQuery', ''),
  withState('focusedFacet', 'setFocusedFacet', null),
  withState('isLoadingFacetMapping', 'setIsLoadingFacetMapping', false),
  withState(
    'isLoadingAdditionalFacetData',
    'setIsLoadingAdditionalFacetData',
    false,
  ),
  withPropsOnChange(
    ['isLoadingFacetMapping', 'isLoadingAdditionalFacetData'],
    ({ isLoadingAdditionalFacetData, isLoadingFacetMapping }) => ({
      isLoading: _.some([isLoadingFacetMapping, isLoadingAdditionalFacetData]),
    }),
  ),
  withState('shouldHideUselessFacets', 'setShouldHideUselessFacets', false),
  withProps(
    ({
      docType,
      facetMapping,
      relay,
      relayVarName,
      setIsLoadingAdditionalFacetData,
      setShouldHideUselessFacets,
    }) => ({
      setUselessFacetVisibility: shouldHideUselessFacets => {
        setShouldHideUselessFacets(shouldHideUselessFacets);
        localStorage.setItem(
          'shouldHideUselessFacets',
          JSON.stringify(shouldHideUselessFacets),
        );
        const byDocType = _.groupBy(facetMapping, o => o.doc_type);
        if (shouldHideUselessFacets && byDocType[docType]) {
          setIsLoadingAdditionalFacetData(shouldHideUselessFacets);
          relay.setVariables(
            {
              [relayVarName]: byDocType[docType]
                .map(({ field }) => field)
                .join(','),
            },
            readyState => {
              if (
                _.some([
                  readyState.ready,
                  readyState.aborted,
                  readyState.error,
                ])
              ) {
                setIsLoadingAdditionalFacetData(false);
              }
            },
          );
        }
      },
    }),
  ),
  withPropsOnChange(
    ['isLoadingFacetMapping'],
    ({ isLoadingFacetMapping, setUselessFacetVisibility }) => !isLoadingFacetMapping &&
      JSON.parse(localStorage.getItem('shouldHideUselessFacets') || 'null') &&
      setUselessFacetVisibility(true),
  ),
  withHandlers({
    fetchData: ({ setFacetMapping, setIsLoadingFacetMapping }) => async () => {
      setIsLoadingFacetMapping(true);
      const mapping = await fetchApi('gql/_mapping', {
        headers: { 'Content-Type': 'application/json' },
      });
      setFacetMapping(mapping);
      setIsLoadingFacetMapping(false);
    },
    handleQueryInputChange: ({ setQuery }) => event => setQuery(event.target.value),
  }),
  defaultProps({
    excludeFacetsBy: _.noop,
    onSelect: _.noop,
    onRequestClose: _.noop,
  }),
  withPropsOnChange(['additionalFacetData'], ({ additionalFacetData }) => ({
    usefulFacets: _.omitBy(
      additionalFacetData,
      aggregation => !aggregation ||
        _.some([
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
      query,
      shouldHideUselessFacets,
      usefulFacets,
    }) => ({
      filteredFacets: _.filter(_.values(facetMapping), facet => _.every([
        facetMatchesQuery(facet, query),
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
      relay,
      setFocusedFacet,
      setQuery,
    }) => () => {
      setQuery('');
      setFocusedFacet(null);
      onRequestClose();
    },
  }),
  withSelectableList(
    {
      keyHandlerName: 'handleKeyDown',
      listSourcePropPath: 'filteredFacets',
    },
    {
      onSelectItem: (item, { handleSelectFacet }) => handleSelectFacet(item),
      // TODO: if focused item is off view, scroll into view
      onFocusItem: (item, { setFocusedFacet }) => setFocusedFacet(item),
      onCancel: ({ handleClose }) => handleClose(),
    },
  ),
  lifecycle({
    componentDidMount(): void {
      this.props.fetchData();
    },
  }),
)(props => (
  <div className="test-facet-selection">
    <div {...css(styles.header)}>
      <h2
        data-translate
        style={{
          margin: 0,
          lineHeight: 1.42857143,
        }}
        >
        <span>{props.title}</span>
        <a
          className="pull-right"
          onClick={props.handleClose}
          style={{ fontSize: '1.5rem' }}
          >
          Cancel
        </a>
      </h2>
      <div style={{ marginBottom: 15 }}>
        <label htmlFor="quick-search-input">Search for a field:</label>
        <input
          autoComplete="off"
          autoFocus
          className="form-control"
          defaultValue={props.query}
          id="quick-search-input"
          onChange={props.handleQueryInputChange}
          onKeyDown={props.handleKeyDown}
          placeholder="search"
          type="text"
          />
      </div>
      <h3 {...css(styles.resultsCount)}>
        {props.isLoading
          ? 'Loading...'
          : `${props.filteredFacets.length} ${props.docType} fields`}
      </h3>

      <label className="pull-right" role="button" tabIndex={0}>
        <input
          checked={props.shouldHideUselessFacets}
          className="test-filter-useful-facet"
          onChange={event => props.setUselessFacetVisibility(event.target.checked)}
          style={styles.uselessFacetVisibilityCheckbox}
          type="checkbox"
          />
        Only show fields with values
      </label>
    </div>
    <ul {...css(styles.facetList)} className="test-search-result-list">
      {!props.isLoading &&
        _.map(props.filteredFacets, facet => {
          const isFocused =
            props.focusedFacet && facet.full === props.focusedFacet.full;
          return (
            <li
              className="test-search-result-item"
              key={facet.full}
              onClick={() => props.handleSelectFacet(facet)}
              onMouseEnter={() => props.setFocusedFacet(facet)}
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
                    condition={props.query.length >= 2}
                    search={props.query}
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
                      condition={props.query.length >= 2}
                      search={props.query}
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
  </div>
));
