// @flow
import _ from 'lodash';
import { compose, withState, withHandlers, withProps } from 'recompose';

import withRouter from '@ncigdc/utils/withRouter';
import { fetchApi } from '@ncigdc/utils/ajax';
import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';
import { ISearchHit } from '@ncigdc/components/QuickSearch/types';

const throttledInvoker = _.throttle(fn => fn(), 300, { leading: false });

// is the latest version of the file always file_change: "released"?
// of do we need to check for the highest version number?
// is this just for QuickSearch? not facet search?
// is my uuid check reliable? (do other entities match this)

const fetchFileHistory = query => {
  return fetchApi(`/history/${window.encodeURIComponent(query)}`, {
    method: 'GET',
  })
    .then(response => {
      if (!response) {
        throw new Error('error');
      }
      return response;
    })
    .catch(err => {
      return [];
    });
};

const isUUID = query =>
  query.match(
    /^[a-zA-Z0-9]{8}\-[a-zA-Z0-9]{4}\-[a-zA-Z0-9]{4}\-[a-zA-Z0-9]{4}\-[a-zA-Z0-9]{12}$/,
  );
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
        let resultsToDisplay = results;
        if (timeOfMostRecentRequest === timeOfRequest) {
          if (!results.length && isUUID(query)) {
            console.log('fetching file history');
            const history = await fetchFileHistory(query);
            if (history) {
              setState(s => ({
                ...s,
                results,
                fileHistoryResult: history,
                isLoading: false,
              }));
            }
          }
          setState(s => ({ ...s, results, isLoading: false }));
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
          ).then(response =>
            handleResults(response.data.query.hits, timeOfRequest, query),
          ),
        );
      },
    }),
    withHandlers({
      selectItem: ({ push, reset }) => (item: ISearchHit) => {
        push(
          `/${atob(item.id)
            .split(':')[0]
            .toLocaleLowerCase()}s/${atob(item.id).split(':')[1]}`,
        );
        setTimeout(reset, 100);
      },
    }),
    withPropsOnChange(
      (props, nextProps) => props.state.query !== nextProps.state.query,
      ({ state: { query, results }, setState, fetchResults }) => {
        timeOfMostRecentRequest = new Date().getTime();
        if (query) {
          setState(s => ({ ...s, isLoading: true }));
          fetchResults(query, timeOfMostRecentRequest);
        } else if (results && results.length) {
          setState(s => ({ ...s, results: [] }));
        } else {
          setState(s => ({ ...s, isLoading: false }));
        }
      },
    ),
  );
};

export default withSearch;
