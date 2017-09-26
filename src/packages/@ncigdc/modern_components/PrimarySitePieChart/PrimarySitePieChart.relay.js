// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import { BaseQuery } from '@ncigdc/modern_components/Query';
import withBetterRouter from '../../utils/withRouter';
import { parseFilterParam } from '../../utils/uri/index';

function linkFieldMap(field: string) {
  if (field.indexOf('projects.summary') > -1) {
    return `files.${field.split('.').pop()}`;
  }

  if (
    field.indexOf('projects.primary_site') > -1 ||
    field.indexOf('projects.disease_type') > -1
  ) {
    return field.replace('projects', 'cases');
  }

  return field.replace(/^projects/, 'cases.project');
}

export default (Component: ReactClass<*>) =>
  compose(
    withBetterRouter,
    withPropsOnChange(['query'], ({ query }) => {
      const filters = parseFilterParam(query.filters, null);

      return {
        variables: {
          filters: filters && {
            op: 'AND',
            content: filters.content.map(
              ({ content: { field, value }, op }) => ({
                op,
                content: { field: linkFieldMap(field), value },
              }),
            ),
          },
        },
      };
    }),
  )((props: Object) => {
    return (
      <BaseQuery
        parentProps={props}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query PrimarySitePieChart_relayQuery($filters: FiltersArgument) {
            viewer {
              repository {
                cases {
                  aggregations(filters: $filters) {
                    primary_site {
                      buckets {
                        doc_count
                        key
                      }
                    }
                  }
                }
              }
            }
          }
        `}
      />
    );
  });
