// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { makeFilter } from '@ncigdc/utils/filters';
import { compose, withPropsOnChange, branch, renderComponent } from 'recompose';
import { BaseQuery } from '@ncigdc/modern_components/Query';

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
      <BaseQuery
        cacheConfig={{ requiresStudy: true }}
        Component={Component}
        parentProps={props}
        query={graphql`
          query GeneSymbol_relayQuery($filters: FiltersArgument) {
            viewer {
              explore {
                genes {
                  hits(filters: $filters, first: 1) {
                    edges {
                      node {
                        symbol
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
