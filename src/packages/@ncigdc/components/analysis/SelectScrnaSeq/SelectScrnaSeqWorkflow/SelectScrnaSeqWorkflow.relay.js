/* eslint-disable camelcase */
import React from 'react';
import { graphql } from 'react-relay';
import {
  compose, pure, setDisplayName, withPropsOnChange,
} from 'recompose';

import Query from '@ncigdc/modern_components/Query';

import { scrnaSeqFilters } from '../SelectScrnaSeq.relay';

const variables = {
  files_offset: 0,
  files_size: 99,
  files_sort: [],
};

export default (Component) =>
  compose(
    setDisplayName('SelectScrnaSeqWorkflowQuery'),
    withPropsOnChange(['case_id'], ({ case_id }) => ({
      filters: {
        ...scrnaSeqFilters,
        content: [
          ...scrnaSeqFilters.content,
          {
            op: 'in',
            content: {
              field: 'cases.case_id',
              value: [case_id],
            },
          },
        ],
      },
    })),
    pure,
  )((props) => {
    const { filters } = props;
    return (
      <Query
        Component={Component}
        minHeight={0}
        name="SelectScrnaSeqWorkflow"
        parentProps={props}
        query={graphql`
          query SelectScrnaSeqWorkflow_relayQuery(
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
                        analysis {
                          workflow_type
                        }
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
