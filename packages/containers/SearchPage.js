/* @flow */

import React from 'react';
import Relay from 'react-relay';
import { compose } from 'recompose';
import { createContainer } from 'recompose-relay';

import FileTable from './FileTable';
import FilesAggregations from './FilesAggregations';

type PropsType = {
  viewer: {
    files: {
      aggregations: string,
      hits: string,
    },
  },
};

const FilesPage = (props: PropsType) => (
  <div>
    <FilesAggregations aggregations={props.viewer.files.aggregations} />
    <FileTable hits={props.viewer.files.hits} />
  </div>
);

const FilesPageQuery = {
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

export default compose(
  createContainer(FilesPageQuery)
)(FilesPage);
