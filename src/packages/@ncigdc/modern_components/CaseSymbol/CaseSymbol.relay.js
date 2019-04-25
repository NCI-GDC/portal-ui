// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { makeFilter } from '@ncigdc/utils/filters';
import {
  compose, withPropsOnChange, branch, renderComponent,
} from 'recompose';
import { BaseQuery } from '@ncigdc/modern_components/Query';

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
    <BaseQuery
      Component={Component}
      name="CaseSymbol"
      parentProps={props}
      query={graphql`
          query CaseSymbol_relayQuery($filters: FiltersArgument) {
            viewer {
              repository {
                cases {
                  hits(filters: $filters, first: 1) {
                    edges {
                      node {
                        submitter_id
                        project {
                          project_id
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
