// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import { parse } from 'query-string';

import Query from '@ncigdc/modern_components/Query';
import { parseFilterParam } from '@ncigdc/utils/uri';
import withRouter from '@ncigdc/utils/withRouter';
import { makeFilter } from '@ncigdc/utils/filters';

// const entityType = 'Genes';

export default (Component: ReactClass<*>) => compose(
  withRouter,
  withPropsOnChange(
    ['location'],
    ({
      defaultFilters = null,
      // defaultFilters = makeFilter([
      //   {
      //     field: 'genes.is_cancer_gene_census',
      //     value: ['true'],
      //   },
      // ]),
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
    // connect((state, props) => ({
    //   userSelectedFacets: state.customFacets[entityType],
    // })),
    // withPropsOnChange(
    //   ['userSelectedFacets', 'filters'],
    //   ({ userSelectedFacets, filters }) => {
    //     return {
    //       variables: {
    //         filters,
    //         repoFileCustomFacetFields: userSelectedFacets
    //           .map(({ field }) => field)
    //           .join(','),
    //       },
    //     };
    //   },
    // ),
)((props: Object) => {
  return (
    <Query
        Component={Component}
        minHeight={578}
        parentProps={props}
        query={graphql`
          query GeneAggregations_relayQuery(
            $filters: FiltersArgument
          ) {
            viewer {
              explore {
                genes {
                  aggregations(
                    filters: $filters
                    aggregations_filter_themselves: false
                  ) {
                    biotype {
                      buckets {
                        doc_count
                        key
                      }
                    }
                    case__cnv__cnv_change {
                      buckets {
                        doc_count
                        key
                        key_as_string
                      }
                    }
                    is_cancer_gene_census {
                      buckets {
                        doc_count
                        key
                        key_as_string
                      }
                    }
                  }
                }
                cnvs {
                  aggregations(
                    filters: $filters
                    aggregations_filter_themselves: false
                  )
                  {
                    cnv_change {
                      buckets {
                        doc_count
                        key
                        key_as_string
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

// aggregations(filters: $geneFilters aggregations_filter_themselves: false) {
//   ${GeneAggregations.getFragment('aggregations')}
// }
//
// aggregations(filters: $filters aggregations_filter_themselves: false) {
//   ${GeneAggregations.getFragment('cnvAggregations')}
// }
