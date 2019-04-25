/* @flow */
import React from 'react';
import { Route } from 'react-router-dom';
import LoadableWithLoading from '@ncigdc/components/LoadableWithLoading';

const ImageViewerRoute = (
  <Route
    component={LoadableWithLoading({
      loader: () => import('./ImageViewerRoute'),
    })}
    path="/image-viewer" />
);

export default ImageViewerRoute;
