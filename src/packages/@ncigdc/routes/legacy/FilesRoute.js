/* @flow */
/* eslint fp/no-class:0 */

import React from 'react';
import Relay from 'react-relay/classic';

import FilesPage from '@ncigdc/containers/legacy/FilesPage';
import {
  parseIntParam,
  parseFilterParam,
  parseJSURLParam,
} from '@ncigdc/utils/uri';

import { viewerQuery } from '../queries';

class FilesRoute extends Relay.Route {
  static routeName = 'LegacyFilesPage';
  static queries = viewerQuery;

  static prepareParams = ({ location: { query } }) => {
    const q = query || {};

    return {
      files_offset: parseIntParam(q.files_offset, 0),
      files_size: parseIntParam(q.files_size, 20),
      files_sort: parseJSURLParam(q.files_sort, null),
      filters: parseFilterParam(q.filters, null),
    };
  };
}

export default (props: mixed) => (
  <Relay.Renderer
    Container={FilesPage}
    queryConfig={new FilesRoute(props)}
    environment={Relay.Store}
  />
);
