/* @flow */

import React from 'react';
import Relay from 'react-relay';

import FileTable from './FileTable';
import FileAggregations from './FileAggregations';

export type TProps = {
  viewer: {
    files: {
      aggregations: string,
      hits: string,
    },
  },
};

export const FilesPageComponent = (props: TProps) => (
  <div>
    <FileAggregations aggregations={props.viewer.files.aggregations} />
    <FileTable hits={props.viewer.files.hits} />
  </div>
);

export const FilesPageQuery = {
  initialVariables: {
    first: 0,
    offset: 0,
    filters: null,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Root {
        files {
          aggregations(filters: $filters) {
            ${FileAggregations.getFragment('aggregations')}
          }
          hits(first: $first offset: $offset, filters: $filters) {
            ${FileTable.getFragment('hits')}
          }
        }
      }
    `,
  },
};

const FilesPage = Relay.createContainer(
  FilesPageComponent,
  FilesPageQuery
);

export default FilesPage;
