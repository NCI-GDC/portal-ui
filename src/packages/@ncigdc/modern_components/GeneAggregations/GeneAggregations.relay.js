import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import { parse } from 'query-string';
// import { merge } from 'lodash';

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
      cacheConfig={{ requiresStudy: true }}
      Component={Component}
      /* Attempt at splitting queries... Leaving commented as CNVs are not being used **
      // Component={parentProps => {
      //   const nestedViewersMerge = (nestedViewer, ...parentViewers) => merge(
      //     nestedViewer,
      //     ...parentViewers,
      //   );
      //   return (
      //     <Query
      //       Component={Component}
      //       minHeight={578}
      //       parentProps={{
      //         nestedViewersMerge,
      //         ...parentProps,
      //       }}
      //       query={graphql`
      //       query GeneAggregationsCNVS_relayQuery(
      //         $filters: FiltersArgument
      //       ) {
      //         viewer {
      //           explore {
      //             cnvs {
      //               aggregations(
      //                 filters: $filters
      //                 aggregations_filter_themselves: false
      //               )
      //               {
      //                 cnv_change {
      //                   buckets {
      //                     doc_count
      //                     key
      //                     key_as_string
      //                   }
      //                 }
      //               }
      //             }
      //           }
      //         }
      //       }
      //     `}
      //       variables={parentProps.variables}
      //       />
      //   );
      // }}
      */
      minHeight={578}
      parentProps={props}
      query={graphql`
        query GeneAggregationsGenes_relayQuery(
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
            }
          }
        }
      `}
      variables={props.variables}
      />
  );
});
