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
  children: 'exploration',
  pathname: '/exploration',
  query: { searchTableTab: 'mutations' },
});

export default makeListLink({
  children: 'exploration',
  dropDownElements: [
    {
      description: 'Explore Open Data',
    },
    {
      description: 'Explore Controlled & Open Data',
      onClick: (event, dispatch, { showControlledAccessModal }) => {
        event.preventDefault();
        showControlledAccessModal();
      },
    },
  ],
  pathname: '/exploration',
});
