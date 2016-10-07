/* @flow */

import React from 'react';
import Relay from 'react-relay';
import Router from 'react-router/BrowserRouter';
import Match from 'react-router/Match';
import { stringify } from 'query-string';

import SearchRoute from '@ncigdc/routes/SearchRoute';
import AnnotationsRoute from '@ncigdc/routes/AnnotationsRoute';
import FileRoute from '@ncigdc/routes/FileRoute';
import CaseRoute from '@ncigdc/routes/CaseRoute';
import AnnotationRoute from '@ncigdc/routes/AnnotationRoute';


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
        <li><SearchLink>the search link</SearchLink></li>
        <li><SearchLink>the search link</SearchLink></li>
        <li><FileLink merge id="fba0b6ac-7bbc-4caa-a195-785b50e1829a" query={{ offset: 3 }} /></li>
        <li><FileLink id="fba0b6ac-7bbc-4caa-a195-785b50e1829a" query={{ offset: 0 }}>the file link</FileLink></li>
      </ul>

      <hr />

      <Match exactly pattern="/search" component={SearchRoute} />
      <Match exactly pattern="/annotations" component={AnnotationsRoute} />
      <Match pattern="/files/:id" component={FileRoute} />
      <Match pattern="/cases/:id" component={CaseRoute} />
      <Match pattern="/annotations/:id" component={AnnotationRoute} />
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
