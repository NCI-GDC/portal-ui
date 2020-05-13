import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import { parse } from 'query-string';
import { head } from 'lodash';

import Query from '@ncigdc/modern_components/Query';
import { parseFilterParam } from '@ncigdc/utils/uri';
import withRouter from '@ncigdc/utils/withRouter';
import testValidClinicalTypes from '@ncigdc/utils/clinicalBlacklist';

const ClinicalAggregationsQuery = (Component: ReactClass<*>) => compose(
  withRouter,
  withPropsOnChange(
    ['location'],
    ({
      data: { fields },
      defaultFilters = null,
      location: { search },
    }) => {
      const q = parse(search);

      const filters = parseFilterParam(q.filters, defaultFilters);
      const filteredFields = head(
        fields.filter(field => field.name === 'aggregations'),
      ).type.fields;

      const clinicalAnalysisFields = testValidClinicalTypes(filteredFields);

      return {
        clinicalAnalysisFields,
        variables: {
          facetFields: clinicalAnalysisFields.map(field => field.name.replace(/__/g, '.')).join(','),
          filters,
        },
      };
    },
  ),
)((props: Object) => (
  <Query
    cacheConfig={{ requiresStudy: true }}
    Component={Component}
    minHeight={578}
    parentProps={props}
    query={graphql`
        query ClinicalAggregations_relayQuery(
          $filters: FiltersArgument
          $facetFields: [String]!
        ) {
          viewer {
            explore {
              cases {
                customCaseFacets: facets(facets: $facetFields filters: $filters)
              }
            }
          }
        }
      `}
    variables={props.variables}
    />
));

export default ClinicalAggregationsQuery;
