import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import { parse } from 'query-string';

import Query from '@ncigdc/modern_components/Query';
import { parseFilterParam } from '@ncigdc/utils/uri';
import withRouter from '@ncigdc/utils/withRouter';

export default (Component: ReactClass<*>) => compose(
  withRouter,
  withPropsOnChange(
    ['location'],
    ({
      defaultFilters = null,
      location: { search },
    }) => {
      const q = parse(search);
      const filters = parseFilterParam(q.filters, defaultFilters);
      return {
        variables: {
          filters,
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
        query PrimarySiteAndDiseaseType_relayQuery(
          $filters: FiltersArgument
        ) {
          viewer {
            explore {
              cases {
                aggregations(filters: $filters) {
                  primary_site {
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
