import React from 'react';
import Relay from 'react-relay';

import CasesAggregations from 'containers/CasesAggregations';
import FilesAggregations from 'containers/FilesAggregations';
import FileTable from 'containers/FileTable';

export const FilesPage = props => (
  <div>
    <CasesAggregations aggregations={ props.viewer.cases.aggregations } />
    <FilesAggregations aggregations={ props.viewer.files.aggregations } />
    <FileTable hits={ props.viewer.files.hits } />
  </div>
);

export default Relay.createContainer(FilesPage, {
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
            ${CasesAggregations.getFragment('aggregations')}
          }
        }
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
});
