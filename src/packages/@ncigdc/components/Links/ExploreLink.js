import { makeListLink } from './utils';

export const ExploreMutationsLink = makeListLink({
  children: 'exploration',
  pathname: '/exploration',
  query: { searchTableTab: 'mutations' },
});

export default makeListLink({
  children: 'exploration',
  pathname: '/exploration',
});
