import { graphql } from 'react-relay';
import {
  compose, pure, setDisplayName, withProps,
} from 'recompose';

import Query from '@ncigdc/modern_components/Query';
import { MOCK_SCRNA_DATA } from '@ncigdc/utils/constants';

const variables = {
  files_size: 99,
  files_offset: 0,
  files_sort: [],
};

export default (Component) =>
  compose(
    setDisplayName('AnalysisDownloadsButtonQuery'),
    withProps(({ case_id }) => ({
      filters: {
        content: [
          {
            op: 'in',
            content: {
              field: 'cases.case_id',
              value: [case_id],
            },
          },
          {
            op: 'in',
            content: {
              field: 'files.data_type',
              value: MOCK_SCRNA_DATA
              ? ['Isoform Expression Quantification', 'miRNA Expression Quantification']
              : ['Differential Gene Expression', 'Single Cell Analysis'],
            },
          },
          {
            op: 'in',
            content: {
              field: 'files.data_format',
              value: MOCK_SCRNA_DATA
                ? ['txt']
                : ['tsv'],
            },
          },
        ],
        op: 'and',
      },
    })),
    pure,
  )((props) => {
    const { filters } = props;
    return (
      <Query
        Component={Component}
        minHeight={0}
        name="AnalysisDownloadsButtonQuery"
        parentProps={props}
        query={graphql`
          query AnalysisDownloadsButton_relayQuery(
            $files_size: Int
            $files_offset: Int
            $files_sort: [Sort]
            $filters: FiltersArgument
          ) {
            viewer {
              repository {
                files {
                  hits(first: $files_size, offset: $files_offset, sort: $files_sort, filters: $filters) {
                    edges {
                      node {
                        file_id
                        data_type
                        file_name
                        file_size
                      }
                    }
                  }
                }
              }
            }
          }
        `}
        variables={{
          ...variables,
          filters,
        }}
        />
    );
  });
