/* @flow */

import React from 'react';
import Relay from 'react-relay';

import CaseTable from './CaseTable';
import CaseAggregations from './CaseAggregations';
import FileTable from './FileTable';
import FileAggregations from './FileAggregations';

export type TProps = {
  viewer: {
    cases: {
      aggregations: string,
      hits: string,
    },
    files: {
      aggregations: string,
      hits: string,
    },
  },
};

export const SearchPageComponent = (props: TProps) => (
  <div>
    <FileAggregations aggregations={props.viewer.files.aggregations} />
    <FileTable hits={props.viewer.files.hits} />
    <CaseAggregations aggregations={props.viewer.cases.aggregations} />
    <CaseTable hits={props.viewer.cases.hits} />
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
        cases {
          aggregations(filters: $filters) {
            ${CaseAggregations.getFragment('aggregations')}
          }
          hits(first: $first offset: $offset, filters: $filters) {
            ${CaseTable.getFragment('hits')}
          }
        }
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

const SearchPage = Relay.createContainer(
  SearchPageComponent,
  SearchPageQuery
);

export default SearchPage;
