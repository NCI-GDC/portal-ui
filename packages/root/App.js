/* @flow */

import React from 'react';
import Relay from 'react-relay';
import Router from 'react-router/BrowserRouter';
import Match from 'react-router/Match';
import { stringify } from 'query-string';

import SearchRoute from '@ncigdc/routes/SearchRoute';
import ProjectsRoute from '@ncigdc/routes/ProjectsRoute';
import AnnotationsRoute from '@ncigdc/routes/AnnotationsRoute';
import ProjectRoute from '@ncigdc/routes/ProjectRoute';
import FileRoute from '@ncigdc/routes/FileRoute';
import CaseRoute from '@ncigdc/routes/CaseRoute';
import AnnotationRoute from '@ncigdc/routes/AnnotationRoute';


import HomeLink from '@ncigdc/components/Links/HomeLink';
import SearchLink from '@ncigdc/components/Links/SearchLink';
import ProjectsLink from '@ncigdc/components/Links/ProjectsLink';
import AnnotationsLink from '@ncigdc/components/Links/AnnotationsLink';

const stringifyQuery = (query) => (
  stringify(query, { strict: false })
);

const AppComponent = () => (
  <Router stringifyQuery={stringifyQuery}>
    <div>
      <ul>
        <li><HomeLink /></li>
        <li><ProjectsLink /></li>
        <li><SearchLink /></li>
        <li><AnnotationsLink /></li>
      </ul>

      <hr />

      <Match exactly pattern="/search" component={SearchRoute} />
      <Match exactly pattern="/projects" component={ProjectsRoute} />
      <Match exactly pattern="/annotations" component={AnnotationsRoute} />
      <Match pattern="/projects/:id" component={ProjectRoute} />
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
