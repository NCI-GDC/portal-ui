/* @flow */

import React from 'react';
import Relay from 'react-relay';
import Router from 'react-router/BrowserRouter';
import Match from 'react-router/Match';
import { stringify } from 'query-string';

import SearchRoute from '@ncigdc/routes/SearchRoute';
import FileRoute from '@ncigdc/routes/FileRoute';
import AnnotationsRoute from '@ncigdc/routes/AnnotationsRoute';

import HomeLink from '@ncigdc/components/Links/HomeLink';
import SearchLink from '@ncigdc/components/Links/SearchLink';
import FileLink from '@ncigdc/components/Links/FileLink';

const stringifyQuery = (query) => (
  stringify(query, { strict: false })
);

const AppComponent = () => (
  <Router stringifyQuery={stringifyQuery}>
    <div>
      <ul>
        <li><HomeLink /></li>
        <li><HomeLink /></li>
        <li><SearchLink id="blah">the search link</SearchLink></li>
        <li><FileLink merge id="fba0b6ac-7bbc-4caa-a195-785b50e1829a" query={{ offset: 3 }} /></li>
        <li><FileLink id="fba0b6ac-7bbc-4caa-a195-785b50e1829a" query={{ offset: 0 }}>the file link</FileLink></li>
      </ul>

      <hr />

      <Match pattern="/search" component={SearchRoute} />
      <Match pattern="/files/:id" component={FileRoute} />
      <Match exactly pattern="/annotations" component={AnnotationsRoute} />
    </div>
  </Router>
);

const AppQuery = {
  initialVariables: {
    first: 0,
    offset: 0,
    filters: null,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Root {
        summary {
          aggregations {
            access {
              buckets {
                doc_count
              }
            }
          }
        }
      }
    `,
  },
};

const App = Relay.createContainer(
  AppComponent,
  AppQuery
);

export default App;
