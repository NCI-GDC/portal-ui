// @flow
/* eslint fp/no-mutating-methods: 0 */

import React from 'react';
import Relay from 'react-relay/classic';
import { lifecycle, compose, withProps } from 'recompose';
import { isEqual, head } from 'lodash';
import { makeFilter } from '@ncigdc/utils/filters';

const GeneSymbolComponent = compose(
  withProps(({ relay }) => ({
    setRelayFilters: ({ geneId }) => {
      const variables = {
        geneIdFilters: makeFilter([
          {
            field: 'genes.gene_id',
            value: [geneId],
          },
        ]),
        fetchGeneSymbols: !!geneId,
      };
      relay.setVariables(variables);
    },
  })),
  lifecycle({
    componentDidMount(): void {
      this.props.setRelayFilters(this.props);
    },
    componentWillReceiveProps(nextProps: any): void {
      if (!isEqual(this.props.filters, nextProps.filters)) {
        nextProps.setRelayFilters(nextProps);
      }
    },
  }),
)(
  ({ explore, geneId }) =>
    explore.genes.hits
      ? <span data-test="gene-symbol">
          {
            (head(explore.genes.hits.edges) || { node: { symbol: geneId } })
              .node.symbol
          }
        </span>
      : <span data-test="gene-symbol" style={{ width: '45px' }}>&nbsp;</span>,
);

export const GeneSymbolQuery = {
  initialVariables: {
    geneIdFilters: null,
    fetchGeneSymbols: false,
  },
  fragments: {
    explore: () => Relay.QL`
      fragment on Explore {
        genes {
          blah: hits(first: 0) { total }
          hits(filters: $geneIdFilters first: 1) @include(if: $fetchGeneSymbols) {
            edges {
              node {
                symbol
              }
            }
          }
        }
      }
    `,
  },
};

const GeneSymbol = Relay.createContainer(GeneSymbolComponent, GeneSymbolQuery);

export default GeneSymbol;
