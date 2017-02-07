/* @flow */

import { makeListLink } from './utils';

export const RepositoryFilesLink = makeListLink({
  pathname: '/repository',
  children: 'repository',
  query: { searchTableTab: 'files' },
});

export const RepositoryCasesLink = makeListLink({
  pathname: '/repository',
  children: 'repository',
  query: { searchTableTab: 'cases' },
});

export default makeListLink({ pathname: '/repository', children: 'repository' });
