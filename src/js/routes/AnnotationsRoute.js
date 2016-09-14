import { Route } from 'react-router';
import { h } from 'react-hyperscript-helpers';

import AnnotationsPage from 'containers/AnnotationsPage';
import { prepareViewerParams } from 'routes/utils';
import { viewerQuery } from 'routes/queries';

const AnnotationsRoute = h(Route, {
  path: '/annotations',
  component: AnnotationsPage,
  prepareParams: prepareViewerParams,
  queries: viewerQuery,
});

export default AnnotationsRoute;
