/* @flow */

import { makeListLink } from './utils';

export const RepositoryFilesLink = makeListLink({
  pathname: '/repository',
  children: 'repository',
  query: { searchTableTab: 'files' },
});

export default makeListLink({
  pathname: '/repository',
  children: 'repository',
});
