import { Route } from 'react-router';
import { h } from 'react-hyperscript-helpers';

import FilesPage from 'containers/FilesPage';
import { prepareViewerParams } from 'routes/utils';
import { viewerQuery } from 'routes/queries';

const FilesRoute = h(Route, {
  path: '/files',
  component: FilesPage,
  prepareParams: prepareViewerParams,
  queries: viewerQuery,
});

export default FilesRoute;
