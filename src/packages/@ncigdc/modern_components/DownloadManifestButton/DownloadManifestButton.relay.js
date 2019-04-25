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
    ({ projectId }) => !projectId,
    renderComponent(() => (
      <div>
        <pre>projectId</pre>
        {' '}
must be provided
      </div>
    )),
  ),
  withPropsOnChange(['projectId'], ({ projectId }) => {
    return {
      variables: {
        filters: makeFilter([
          {
            field: 'projects.project_id',
            value: [projectId],
          },
        ]),
      },
    };
  }),
)((props: Object) => {
  return (
    <Query
      Component={Component}
      minHeight={50}
      parentProps={props}
      query={graphql`
          query DownloadManifestButton_relayQuery($filters: FiltersArgument) {
            viewer {
              projects {
                hits(first: 1, filters: $filters) {
                  edges {
                    node {
                      summary {
                        file_count
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
