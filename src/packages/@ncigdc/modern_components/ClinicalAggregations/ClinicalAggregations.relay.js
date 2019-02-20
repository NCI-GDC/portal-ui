import React from 'react';
import { graphql } from 'react-relay';
import { makeFilter } from '@ncigdc/utils/filters';
import { compose, withPropsOnChange, branch, renderComponent } from 'recompose';
// import { connect } from 'react-redux';
import { parse } from 'query-string';

import { parseFilterParam } from '@ncigdc/utils/uri';
import withRouter from '@ncigdc/utils/withRouter';
import Query from '@ncigdc/modern_components/Query';

const entityType = 'Cases';

export default (Component: ReactClass<*>) =>
  compose(
    withRouter,
    withPropsOnChange(
      ['location'],
      ({ location: { search }, defaultFilters = null }) => {
        const q = parse(search);
        const filters = parseFilterParam(q.filters, defaultFilters);
        return {
          filters,
        };
      }
    ),
    // connect((state, props) => ({
    //   userSelectedFacets: state.customFacets[entityType],
    // })),
    withPropsOnChange(['facets', 'filters'], ({ facets, filters }) => {
      return {
        variables: {
          filters,
          exploreCaseCustomFacetFields: facets,
        },
      };
    })
  )((props: Object) => {
    return (
      <Query
        parentProps={props}
        minHeight={249}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query ClinicalAggregations_relayQuery(
            $exploreCaseCustomFacetFields: [String]!
          ) {
            viewer {
              explore {
                cases {
                  facets(facets: $exploreCaseCustomFacetFields)
                }
              }

            }
          }
        `}
      />
    );
  });
