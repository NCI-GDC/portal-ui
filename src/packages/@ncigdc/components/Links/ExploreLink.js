/* @flow */
import { makeFilter } from '@ncigdc/utils/filters';
import { makeListLink } from './utils';

export const defaultExploreQuery = {
  filters: makeFilter([
    {
      field: 'genes.is_cancer_gene_census',
      value: ['true'],
    },
  ]),
};

export const ExploreMutationsLink = makeListLink({
  pathname: '/exploration',
  children: 'exploration',
  query: { searchTableTab: 'mutations' },
});

export default makeListLink({
  pathname: '/exploration',
  children: 'exploration',
});
