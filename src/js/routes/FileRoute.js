import { Route } from 'react-router';
import { h } from 'react-hyperscript-helpers';

import FilePage from 'containers/FilePage';
import { prepareNodeParams } from 'routes/utils';
import { nodeQuery } from 'routes/queries';

const FileRoute = h(Route, {
  path: '/files/:id',
  component: FilePage,
  prepareParams: prepareNodeParams('File'),
  queries: nodeQuery,
});

export default FileRoute;
