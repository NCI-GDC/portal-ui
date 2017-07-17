// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { makeFilter } from '@ncigdc/utils/filters';
import { compose, withPropsOnChange, branch, renderComponent } from 'recompose';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    branch(
      ({ geneId }) => !geneId,
      renderComponent(() => <div><pre>geneId</pre> must be provided</div>),
    ),
    withPropsOnChange(['geneId'], ({ geneId }) => {
      return {
        variables: {
          filters: makeFilter([
            {
              field: 'genes.gene_id',
              value: [geneId],
            },
          ]),
        },
      };
    }),
  )((props: Object) => {
    return (
      <Query
        parentProps={props}
        name="GeneSummary"
        minHeight={278}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query GeneSummary_relayQuery(
            $filters: FiltersArgument
          ) {
            viewer {
              explore {
                genes {
                  hits(first: 1 filters: $filters) {
                    edges {
                      node {
                        description
                        gene_id
                        symbol
                        name
                        synonyms
                        biotype
                        gene_chromosome
                        gene_start
                        gene_end
                        gene_strand
                        is_cancer_gene_census
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
