import React from 'react';
import { branch, compose, renderComponent } from 'recompose';

import NotFound from '@ncigdc/components/NotFound';
import { OverlayLoader } from '@ncigdc/uikit/Loaders/Loader';
import Exists from './Exists';
import exists from './exists.relay';

export const withExists = compose(
  exists,
  branch(
    ({ node }) => !node,
    renderComponent(
      ({ loading }) => (loading ? <OverlayLoader loading /> : <NotFound />),
    ),
  ),
);

export default withExists(Exists);
