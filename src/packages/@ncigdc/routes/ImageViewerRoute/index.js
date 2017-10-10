/* @flow */
import React from 'react';
import { Route } from 'react-router-dom';
import LoadableWithLoading from '@ncigdc/components/LoadableWithLoading';

const ImageViewerRoute = (
  <Route
    path="/image-viewer"
    component={LoadableWithLoading({
      loader: () => import('./ImageViewerRoute'),
    })}
  />
);

export default ImageViewerRoute;
