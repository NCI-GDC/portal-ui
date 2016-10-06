/* @flow */

import React from 'react';
import Relay from 'react-relay';
import { compose } from 'recompose';
import { createContainer } from 'recompose-relay';
import Router from 'react-router/BrowserRouter';
import Match from 'react-router/Match';

import SearchRoute from '@ncigdc/routes/SearchRoute';
import FileRoute from '@ncigdc/routes/FileRoute';
import AnnotationsRoute from '@ncigdc/routes/AnnotationsRoute';
import HomeLink from '@ncigdc/components/Links/HomeLink';
import SearchLink from '@ncigdc/components/Links/SearchLink';
import FileLink from '@ncigdc/components/Links/FileLink';

const App = () => (
  <Router>
    <div>
      <ul>
        <li><HomeLink query={{ a: 1 }} /></li>
        <li><HomeLink merge query={{ b: 2 }} /></li>
        <li><SearchLink>the search link</SearchLink></li>
        <li><FileLink merge id="bloop" query={{ c: 3 }} /></li>
        <li><FileLink merge id="bloop">the file link</FileLink></li>
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

export default compose(
  createContainer(AppQuery)
)(App);
