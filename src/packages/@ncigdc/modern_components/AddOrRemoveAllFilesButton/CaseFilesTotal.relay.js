// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { makeFilter } from '@ncigdc/utils/filters';
import {
  compose, withPropsOnChange, branch, renderComponent,
} from 'recompose';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) => compose(
  branch(
    ({ caseId }) => !caseId,
    renderComponent(() => (
      <div>
        <pre>caseId</pre>
        {' '}
must be provided
      </div>
    )),
  ),
  withPropsOnChange(['caseId'], ({ caseId }) => {
    return {
      variables: {
        filters: makeFilter([
          {
            field: 'cases.case_id',
            value: [caseId],
          },
        ]),
      },
    };
  }),
)((props: Object) => {
  return (
    <Query
      Component={Component}
      Loader={() => null}
      minHeight={34}
      parentProps={props}
      query={graphql`
          query CaseFilesTotal_relayQuery($filters: FiltersArgument) {
            viewer {
              repository {
                cases {
                  hits(first: 1, filters: $filters) {
                    edges {
                      node {
                        case_id
                        files {
                          hits(first: 0) {
                            total
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `}
      variables={props.variables} />
  );
});
