import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import { parse } from 'query-string';

import Query from '@ncigdc/modern_components/Query';
import { parseFilterParam } from '@ncigdc/utils/uri';
import withRouter from '@ncigdc/utils/withRouter';
import { replaceFilters } from '@ncigdc/utils/filters';

export default (Component: ReactClass<*>) => compose(
  withRouter,
  withPropsOnChange(
    ['location'],
    ({
      // defaultFilters = null,
      filters,
      // location: { search },
      primarySites = [],
    }) => {
      // const q = parse(search);
      // const filters = parseFilterParam(q.filters, defaultFilters);
      return {
        variables: {
          filters: replaceFilters({
            op: 'and',
            content: [
              {
                op: 'in',
                content: {
                  field: 'cases.primary_site',
                  value: primarySites,
                },
              },
            ],
          }, filters),
        },
      };
    },
  ),
)((props: Object) => {
  return (
    <Query
      Component={Component}
      minHeight={578}
      parentProps={props}
      query={graphql`
        query DiseaseTypeByPrimarySite_relayQuery(
          $filters: FiltersArgument
        ) {
          viewer {
            explore {
              cases {
                aggregations(filters: $filters) {
                  disease_type {
                    buckets {
                      key
                      doc_count
                    }
                  }
                }
              }
            }
          }
        }
      `}
      variables={props.variables}
      />
  );
});
