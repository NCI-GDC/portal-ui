import { Route } from 'react-router';
import { h } from 'react-hyperscript-helpers';

import AnnotationPage from 'containers/AnnotationPage';
import { prepareNodeParams } from 'routes/utils';
import { nodeQuery } from 'routes/queries';

const AnnotationRoute = h(Route, {
  path: '/annotations/:id',
  component: AnnotationPage,
  prepareParams: prepareNodeParams('Annotation'),
  queries: nodeQuery,
});

export default AnnotationRoute;
