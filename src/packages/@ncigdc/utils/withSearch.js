// @flow
import _ from 'lodash';
import { compose, withState, withHandlers, withProps } from 'recompose';

import withRouter from '@ncigdc/utils/withRouter';
import { fetchApi } from '@ncigdc/utils/ajax';
import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';
import { ISearchHit } from '@ncigdc/components/QuickSearch/types';
import fetchFileHistory from '@ncigdc/utils/fetchFileHistory';
import { isUUID } from '@ncigdc/utils/string';

const throttledInvoker = _.throttle(fn => fn(), 300, { leading: false });

export const withSearch = passedInState => {
  // prefix props to avoid collisions with existing props for component being enhanced
  const defaultState = {
    results: [],
    query: '',
    isLoading: false,
    isInSearchMode: false,
    fileHistoryResult: [],
  };

  // prevent results that come back out-of-order from being displayed
  let timeOfMostRecentRequest = 0;

  return compose(
    withState('state', 'setState', _.defaults(passedInState, defaultState)),
    withRouter,
    withProps(({ setState }) => ({
      handleResults: async (results, timeOfRequest, query) => {
        if (timeOfMostRecentRequest === timeOfRequest) {
          if (query && !results.length && isUUID(query)) {
            const history = await fetchFileHistory(query);
            if (history && history.length) {
              return setState(s => ({
                ...s,
                fileHistoryResult: history,
                results: [],
                isLoading: false,
              }));
            }
          }
          setState(s => ({
            ...s,
            results,
            fileHistoryResult: [],
            isLoading: false,
          }));
        }
      },
    })),
    withHandlers({
      setQuery: ({ setState }) => q => {
        setState(s => ({ ...s, query: q.trim() }));
      },
      reset: ({ setState }) => () => {
        setState(s => ({
          ...s,
          query: '',
          isInSearchMode: false,
          isLoading: false,
        }));
      },
      fetchResults: ({ handleResults }) => (query, timeOfRequest) => {
        return throttledInvoker(() =>
          fetchApi(
            `/quick_search?query=${window.encodeURIComponent(query)}&size=5`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          ).then(response => {
            let hits = [];
            if (response && response.data) {
              hits = response.data.query.hits;
            }
            return handleResults(hits, timeOfRequest, query);
          }),
        );
      },
    }),
    withHandlers({
      selectItem: ({ push, reset }) => (item: ISearchHit) => {
        item.uuid
          ? push(`/files/${item.uuid}`)
          : push(
              `/${atob(item.id)
                .split(':')[0]
                .toLocaleLowerCase()}s/${atob(item.id).split(':')[1]}`,
            );
        setTimeout(reset, 100);
      },
    }),
    withPropsOnChange(
      (props, nextProps) => props.state.query !== nextProps.state.query,
      ({
        state: { query, results, fileHistoryResult },
        setState,
        fetchResults,
      }) => {
        timeOfMostRecentRequest = new Date().getTime();
        if (query) {
          setState(s => ({ ...s, isLoading: true }));
          fetchResults(query, timeOfMostRecentRequest);
        } else if (
          (results && results.length) ||
          (fileHistoryResult && fileHistoryResult.length)
        ) {
          setState(s => ({ ...s, results: [], fileHistoryResult: [] }));
        } else {
          setState(s => ({ ...s, isLoading: false }));
        }
      },
    ),
  );
};

export default withSearch;
