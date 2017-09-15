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
      renderComponent(() => (
        <div>
          <pre>geneId</pre> must be provided
        </div>
      )),
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
        name="GeneExternalReferences"
        minHeight={278}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query GeneExternalReferences_relayQuery($filters: FiltersArgument) {
            viewer {
              explore {
                genes {
                  hits(first: 1, filters: $filters) {
                    edges {
                      node {
                        gene_id
                        external_db_ids {
                          entrez_gene
                          uniprotkb_swissprot
                          hgnc
                          omim_gene
                        }
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
