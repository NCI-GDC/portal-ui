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
    ({ annotationId }) => !annotationId,
    renderComponent(() => (
      <div>
        <pre>annotationId</pre>
        {' '}
must be provided
      </div>
    )),
  ),
  withPropsOnChange(['annotationId'], ({ annotationId }) => {
    return {
      variables: {
        filters: makeFilter([
          {
            field: 'annotations.annotation_id',
            value: [annotationId],
          },
        ]),
      },
    };
  }),
)((props: Object) => {
  return (
    <Query
      Component={Component}
      minHeight={249}
      name="AnnotationSummary"
      parentProps={props}
      query={graphql`
          query AnnotationSummary_relayQuery($filters: FiltersArgument) {
            viewer {
              annotations {
                hits(first: 1, filters: $filters) {
                  edges {
                    node {
                      annotation_id
                      entity_id
                      entity_submitter_id
                      case_submitter_id
                      entity_type
                      case_id
                      project {
                        project_id
                      }
                      classification
                      category
                      created_datetime
                      status
                      notes
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
