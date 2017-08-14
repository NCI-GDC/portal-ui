// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { get } from 'lodash';
import { compose, withPropsOnChange, branch, renderComponent } from 'recompose';

import { makeFilter } from '@ncigdc/utils/filters';
import { BaseQuery } from '@ncigdc/modern_components/Query';
import { geneMap } from '@ncigdc/utils/validateIds';

export default (Component: ReactClass<*>) =>
  compose(
    branch(
      ({ geneId }) => !geneId,
      renderComponent(() => <div><pre>geneId</pre> must be provided</div>),
    ),
    withPropsOnChange(['geneId'], ({ geneId }) => {
      return {
        symbol: get(geneMap, `${geneId}.symbol`),
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
    return props.symbol
      ? <span>{props.symbol}</span>
      : <BaseQuery
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
            }`}
        />;
  });
