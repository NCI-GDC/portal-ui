/* @flow */

import React from 'react';
import Relay from 'react-relay';

import FileTable from './FileTable';
import FilesAggregations from './FilesAggregations';

export type TProps = {
  viewer: {
    files: {
      aggregations: string,
      hits: string,
    },
  },
};

export const SearchPageComponent = (props: TProps) => (
  <div>
    <FilesAggregations aggregations={props.viewer.files.aggregations} />
    <FileTable hits={props.viewer.files.hits} />
  </div>
);

export const SearchPageQuery = {
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
            ${FilesAggregations.getFragment('aggregations')}
          }
          hits(first: $first offset: $offset, filters: $filters) {
            ${FileTable.getFragment('hits')}
          }
        }
      }
    `,
  },
};

const SearchPage = Relay.createContainer(
  SearchPageComponent,
  SearchPageQuery
);

export default SearchPage;
