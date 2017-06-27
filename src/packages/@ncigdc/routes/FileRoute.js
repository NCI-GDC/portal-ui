/* @flow */
import FilePage from '@ncigdc/containers/FilePage';

import { makeEntityPage } from './utils';
import { nodeQuery } from './queries';

export default makeEntityPage({
  entity: 'File',
  Page: FilePage,
  queries: nodeQuery,
});
