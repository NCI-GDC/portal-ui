// @flow

import React from 'react';
import _ from 'lodash';
import { compose } from 'recompose';
import styled from '@ncigdc/theme/styled';
import QuickSearchResults from './QuickSearchResults';
import { withSearch } from '@ncigdc/utils/withSearch';
import namespace from '@ncigdc/utils/namespace';
import withSelectableList from '@ncigdc/utils/withSelectableList';

const styles = {
  searchIconWrapper: {
    marginRight: '4px',
    position: 'relative',
  },
  searchIcon: {
    // add a bit of transition delay to avoid jank with really fast queries
    transition: 'opacity 0.2s ease 0.1s',
  },
  loadingIcon: {
    position: 'absolute',
    left: 0,
    top: 0,
    transition: 'opacity 0.2s ease 0.1s',
  },
  invisible: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  container: {
    position: 'relative',
  },
  noResults: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: '#fff',
    padding: '4px 10px',
    boxShadow:
      'rgba(0, 0, 0, 0.156863) 0px 2px 5px 0px, rgba(0, 0, 0, 0.117647) 0px 2px 10px 0px',
    zIndex: 90,
    width: '100%',
  },
};

const SearchInput = styled.input({
  fontSize: '14px',
  height: '3rem',
  padding: '0.7rem 1rem',
  border: ({ theme }) => `1px solid ${theme.greyScale5}`,
  width: '25.375rem',
  borderRadius: '4px',
  outline: 'none',
  transition: 'all 0.2s ease',
  marginTop: -10,
  marginBottom: -10,
  ':focus': {
    borderColor: 'rgb(18, 141, 219) !important',
    boxShadow: '0px 0px 22px 0px rgba(18, 147, 219, 0.75)',
  },
});

export default compose(
  namespace('search', withSearch()),
  namespace(
    'selectableList',
    withSelectableList(
      {
        keyHandlerName: 'handleKeyDown',
        listSourcePropPath: 'search.state.results',
      },
      {
        onSelectItem: (item, { search }) => item && search.selectItem(item),
      },
    ),
  ),
)(
  ({
    search: { state, setQuery, reset },
    selectableList: { handleKeyDown, focusedItem, setFocusedItem, selectItem },
    tabIndex,
    isInSearchMode,
    setIsInSearchMode,
    style,
  }) => (
    <a
      className="quick-search-toggle"
      tabIndex={tabIndex}
      onClick={() => !isInSearchMode && setIsInSearchMode(true)}
      onBlur={event => {
        const currentTarget = event.currentTarget;
        const relatedTarget = event.relatedTarget;
        // defer 1 frame to get correct value of document.activeElement, which is required for x-browser compat
        setImmediate(() => {
          const triggerElement = relatedTarget || document.activeElement;
          if (
            !(
              currentTarget.contains(triggerElement) ||
              currentTarget === triggerElement
            )
          ) {
            setTimeout(() => setIsInSearchMode(false), 500);
          }
        });
      }}
      style={{
        ...style,
        ...styles.container,
      }}
    >
      {console.log(state)}
      <span style={styles.searchIconWrapper}>
        <i
          className="fa fa-search stock-icon"
          style={Object.assign(
            {},
            styles.searchIcon,
            state.isLoading ? styles.invisible : styles.visible,
          )}
        />
        <i
          className="fa fa-spin fa-spinner stock-icon"
          style={Object.assign(
            {},
            styles.loadingIcon,
            state.isLoading ? styles.visible : styles.invisible,
          )}
        />
      </span>
      {!isInSearchMode && (
        <span className="header-hidden-sm header-hidden-md" data-translate>
          Quick Search
        </span>
      )}

      {isInSearchMode && (
        <SearchInput
          autoFocus
          className="quick-search-input"
          placeholder="Quick Search"
          type="text"
          onChange={event => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Quick Search Input"
        />
      )}
      {!!(state.results && state.results.length) && (
        <QuickSearchResults
          results={_.map(
            state.results,
            item =>
              item === focusedItem ? { ...item, isSelected: true } : item,
          )}
          query={state.query}
          onSelectItem={setFocusedItem}
          onActivateItem={selectItem}
          isLoading={state.isLoading}
        />
      )}
      {!state.isLoading &&
        state.query &&
        (state.results || []).length === 0 && (
          <div style={styles.noResults}>No results found</div>
        )}
    </a>
  ),
);
