// @flow
import React from 'react';
import { compose } from 'recompose';

import SearchIcon from 'react-icons/lib/fa/search';
import styled from '@ncigdc/theme/styled';
import { withSearch } from '@ncigdc/utils/withSearch';
import namespace from '@ncigdc/utils/namespace';
import withSelectableList from '@ncigdc/utils/withSelectableList';

import QuickSearchResults from './QuickSearch/QuickSearchResults';
import FileHistoryResults from './QuickSearch/FileHistoryResults';

const Container = styled.div({
  position: 'relative',
});

const Input = styled.input({
  transition: 'all 0.2s ease',
  outline: 'none',
  width: '100%',
  borderRadius: '3px',
  marginTop: '2rem',
  fontSize: '18px',
  padding: '6px 35px',
  border: '4px solid #6668c3',
  ':focus': {
    borderColor: 'rgb(219, 139, 18) !important',
    boxShadow: '0px 0px 22px 0px rgba(219, 139, 18, 0.75)',
  },
});

const styles = {
  container: {
    width: '100%',
    left: 0,
  },
};

const HomeSearch = compose(
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
    search: { state, setQuery, focusItem, reset },
    selectableList: { handleKeyDown, focusedItem, setFocusedItem, selectItem },
  }) => (
    <Container
      className="test-home-search"
      onBlur={event => {
        const currentTarget = event.currentTarget;
        const relatedTarget = event.relatedTarget;
        setImmediate(() => {
          const triggerElement = relatedTarget || document.activeElement;
          if (
            !(
              currentTarget.contains(triggerElement) ||
              currentTarget === triggerElement
            )
          ) {
            setTimeout(reset, 500);
          }
        });
      }}
    >
      <SearchIcon
        style={{
          position: 'absolute',
          top: '34px',
          left: '15px',
        }}
      />
      <Input
        className="test-search-input"
        type="text"
        placeholder="e.g. BRAF, Breast, TCGA-BLCA, TCGA-A5-A0G2"
        onChange={event => setQuery(event.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Quick search: e.g. BRAF, Breast, TCGA-BLCA, TCGA-A5-A0G2"
      />

      <QuickSearchResults
        results={state.results.map(
          item => (item === focusedItem ? { ...item, isSelected: true } : item),
        )}
        query={state.query}
        onSelectItem={setFocusedItem}
        onActivateItem={selectItem}
        isLoading={state.isLoading}
        style={styles}
      />

      <FileHistoryResults
        query={state.query}
        results={state.fileHistoryResult
          .filter(f => f.file_change === 'released')
          .map(
            item =>
              item === focusedItem ? { ...item, isSelected: true } : item,
          )}
        onSelectItem={setFocusedItem}
        onActivateItem={selectItem}
        isLoading={state.isLoading}
        styles={styles}
      />
    </Container>
  ),
);

export default HomeSearch;
