// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { makeFilter } from '@ncigdc/utils/filters';
import {
  branch,
  compose,
  renderComponent,
  setDisplayName,
  withPropsOnChange,
} from 'recompose';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) => compose(
  setDisplayName('EnhancedGeneExternalReferences_Relay'),
  branch(
    ({ geneId }) => !geneId,
    renderComponent(() => (
      <div>
        <pre>geneId</pre>
        {' '}
must be provided
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
)((props: Object) => (
  <Query
    Component={Component}
    minHeight={278}
    parentProps={props}
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
            ssms{
              aggregations(filters: $filters) {
                clinical_annotations__civic__gene_id{
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
    variables={props.variables}
    />
));
