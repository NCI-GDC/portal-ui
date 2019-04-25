/* @flow */

import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import { makeFilter } from '@ncigdc/utils/filters';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) => compose(
  withPropsOnChange(['viewer'], ({ viewer: { explore: { cases } } }) => {
    return {
      variables: {
        numProjects: cases.filtered.project__project_id.buckets.length,
        projectsFilter: makeFilter([
          {
            field: 'project_id',
            value: cases.filtered.project__project_id.buckets.map(b => b.key),
          },
        ]),
      },
    };
  }),
)((props: Object) => {
  return (
    <Query
      Component={Component}
      minHeight={0}
      parentProps={props}
      query={graphql`
          query Projects_relayQuery(
            $projectsFilter: FiltersArgument
            $numProjects: Int
          ) {
            projectsViewer: viewer {
              projects {
                hits(first: $numProjects, filters: $projectsFilter) {
                  edges {
                    node {
                      primary_site
                      disease_type
                      project_id
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
