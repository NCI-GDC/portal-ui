// @flow

import React from 'react';
import { map } from 'lodash';
import {
  compose,
  pure,
  setDisplayName,
} from 'recompose';
import styled from '@ncigdc/theme/styled';
import { withSearch } from '@ncigdc/utils/withSearch';
import namespace from '@ncigdc/utils/namespace';
import withSelectableList from '@ncigdc/utils/withSelectableList';
import QuickSearchResults from './QuickSearchResults';
import FileHistoryResults from './FileHistoryResults';

const styles = {
  container: {
    position: 'relative',
  },
  inputIcon: {
    transition: 'opacity 0.2s ease 0.1s',
  },
  inputIconWrapper: {
    marginRight: '5px',
    position: 'relative',
  },
  noResults: {
    backgroundColor: '#fff',
    boxShadow: 'rgba(0, 0, 0, 0.156863) 0px 2px 5px 0px, rgba(0, 0, 0, 0.117647) 0px 2px 10px 0px',
    padding: '4px 10px',
    position: 'absolute',
    right: 0,
    top: '100%',
    width: '100%',
    zIndex: 90,
  },
};

const SearchInput = styled.input({
  ':focus': {
    borderColor: 'rgb(18, 141, 219) !important',
    boxShadow: '0px 0px 22px 0px rgba(18, 147, 219, 0.75)',
  },
  border: ({ theme }) => `1px solid ${theme.greyScale5}`,
  borderRadius: '4px',
  fontSize: '14px',
  height: '3rem',
  marginBottom: -10,
  marginTop: -10,
  outline: 'none',
  padding: '0.7rem 1rem',
  transition: 'all 0.2s ease',
  width: '25.375rem',
});

const QuickSearch = ({
  isInSearchMode,
  search: { reset, setQuery, state },
  selectableList: {
    focusedItem, handleKeyDown, selectItem, setFocusedItem,
  },
  setIsInSearchMode,
  style,
  tabIndex,
}) => (
  <a
    className="quick-search-toggle"
    onBlur={event => {
      const { currentTarget } = event;
      const { relatedTarget } = event;
      // defer 1 frame to get correct value of document.activeElement, which is required for x-browser compat
      setImmediate(() => {
        const triggerElement = relatedTarget || document.activeElement;
        if (
          !(
            currentTarget.contains(triggerElement) ||
            currentTarget === triggerElement
          )
        ) {
          setTimeout(() => {
            setIsInSearchMode(false);
            reset();
          }, 300);
        }
      });
    }}
    onClick={() => !isInSearchMode && setIsInSearchMode(true)}
    style={{
      ...style,
      ...styles.container,
    }}
    tabIndex={tabIndex}
    >
    <span style={styles.inputIconWrapper}>
      <i
        className={`fa ${state.isLoading
          ? 'fa-spin fa-spinner'
          : 'fa-search'
        } stock-icon`}
        style={styles.inputIcon}
        />
    </span>

    {isInSearchMode
      ? (
        <SearchInput
          aria-label="Quick Search Input"
          autoFocus
          className="quick-search-input"
          onChange={event => setQuery(event.target.value)}
          onKeyDown={event => {
            handleKeyDown(event);
            if (
              state.query &&
              state.results &&
              focusedItem &&
              event.key === 'Enter'
            ) {
              reset();
              setIsInSearchMode(false);
            }
          }}
          placeholder="Quick Search"
          type="text"
          />
      )
      : (
        <span
          className="header-hidden-sm header-hidden-md"
          data-translate
          >
          Quick Search
        </span>
      )}

    <QuickSearchResults
      isLoading={state.isLoading}
      onActivateItem={item => {
        selectItem(item);
        reset();
        setIsInSearchMode(false);
      }}
      onSelectItem={setFocusedItem}
      query={state.query}
      results={map(
        state.results,
        item => (item === focusedItem
          ? Object.assign(
            {},
            item,
            { isSelected: true },
          )
          : item
        ),
      )}
      />

    {state.isLoading || (
      <FileHistoryResults
        isLoading={state.isLoading}
        onActivateItem={item => {
          selectItem(item);
          reset();
          setIsInSearchMode(false);
        }}
        onSelectItem={setFocusedItem}
        query={state.query}
        results={state.fileHistoryResult
          .filter(f => f.file_change === 'released')
          .map(item => (item === focusedItem
            ? Object.assign(
              {},
              item,
              { isSelected: true },
            )
            : item
          ))}
        />
    )}

    {!state.isLoading &&
      state.query &&
      (state.results || []).length === 0 &&
      (state.fileHistoryResult || []).length === 0 && (
        <div style={styles.noResults}>No results found</div>
    )}
  </a>
);

export default compose(
  setDisplayName('EnhancedQuickSearch'),
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
  pure,
)(QuickSearch);
