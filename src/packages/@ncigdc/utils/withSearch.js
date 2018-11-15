// @flow
import _ from 'lodash';
import { compose, withState, withHandlers, withProps } from 'recompose';
import { connect } from 'react-redux';

import withRouter from '@ncigdc/utils/withRouter';
import { fetchApi } from '@ncigdc/utils/ajax';
import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';
import { TSearchHit } from '@ncigdc/components/QuickSearch/types';
import { IS_AUTH_PORTAL } from '@ncigdc/utils/constants';

const throttledInvoker = _.throttle(fn => fn(), 300, { leading: false });

export const withSearch = passedInState => {
  // prefix props to avoid collisions with existing props for component being enhanced
  const defaultState = {
    results: [],
    query: '',
    isLoading: false,
    isInSearchMode: false,
  };

  // prevent results that come back out-of-order from being displayed
  let timeOfMostRecentRequest = 0;

  return compose(
    connect(state => ({ user: state.auth.user })),
    withState('state', 'setState', _.defaults(passedInState, defaultState)),
    withRouter,
    withProps(({ setState }) => ({
      handleResults: (results, timeOfRequest) => {
        if (timeOfMostRecentRequest === timeOfRequest) {
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
      fetchResults: ({ handleResults, user }) => (query, timeOfRequest) => {
        return throttledInvoker(() =>
          fetchApi(
            `/quick_search?query=${window.encodeURIComponent(query)}&size=5`,
            {
              ...(IS_AUTH_PORTAL ? { credentials: 'include' } : {}),
              headers: {
                'Content-Type': 'application/json',
              },
              body: { user },
            },
          ).then(response =>
            handleResults(response.data.query.hits, timeOfRequest),
          ),
        );
      },
    }),
    withHandlers({
      selectItem: ({ push, reset }) => (item: TSearchHit) => {
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
