/* @flow */

import React from 'react';
import { Route } from 'react-router-dom';
import FullWidthLayout from '@ncigdc/components/Layouts/FullWidthLayout';
import FileName from '@ncigdc/modern_components/FileName';

export default (
  <Route
    path="/files/:id"
    component={({ match, fileId = match.params.id, location }) =>
      <FullWidthLayout
        title={<FileName fileId={fileId} />}
        entityType="FL"
        className="test-file-page"
      />}
  />
);
