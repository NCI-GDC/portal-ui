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
      <BaseQuery
        parentProps={props}
        name="GeneSymbol"
        variables={props.variables}
        Component={Component}
        query={graphql`
        query GeneSymbol_relayQuery(
          $filters: FiltersArgument
        ) {
          viewer {
            explore {
              genes {
                hits(filters: $filters first: 1) {
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
      />
    );
  });
