/* @flow */
import { makeListLink } from './utils';

export const ExploreMutationsLink = makeListLink({
  pathname: '/exploration',
  children: 'exploration',
  query: { searchTableTab: 'mutations' },
});

export default makeListLink({
  pathname: '/exploration',
  children: 'exploration',
});
