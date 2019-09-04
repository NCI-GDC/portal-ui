import React from 'react';
import { graphql } from 'react-relay';
import { compose, withProps, withPropsOnChange } from 'recompose';
import { parse } from 'query-string';
import { head } from 'lodash';

import Query from '@ncigdc/modern_components/Query';
import { parseFilterParam } from '@ncigdc/utils/uri';
import withRouter from '@ncigdc/utils/withRouter';
import { CLINICAL_BLACKLIST } from '@ncigdc/utils/constants';

const validClinicalTypesRegex = /(demographic)|(diagnoses)|(exposures)|(treatments)|(follow_ups)/;
const blacklistRegex = new RegExp(
  CLINICAL_BLACKLIST.map(item => `(${item})`).join('|')
);

const ClinicalAggregationsQuery = (Component: ReactClass<*>) => compose(
  withRouter,
  // withProps(({ __type: { fields } }) => {
  //   const filteredFields = head(
  //     fields.filter(field => field.name === 'aggregations')
  //   ).type.fields;
  //   return {
  //     clinicalAnalysisFields: filteredFields
  //       .filter(field => validClinicalTypesRegex.test(field.name))
  //       .filter(field => !blacklistRegex.test(field.name)),
  //   };
  // }),
  withPropsOnChange(
    ['location'],
    ({
      // clinicalAnalysisFields,
      __type: { fields },
      defaultFilters = null,
      location: { search },
    }) => {
      const q = parse(search);

      const filters = parseFilterParam(q.filters, defaultFilters);
      const filteredFields = head(
        fields.filter(field => field.name === 'aggregations')
      ).type.fields;

      const clinicalAnalysisFields = filteredFields
        .filter(field => validClinicalTypesRegex.test(field.name))
        .filter(field => !blacklistRegex.test(field.name));

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
