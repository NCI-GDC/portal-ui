// @flow

import React from 'react';
import { head } from 'lodash';
import { compose, branch, renderComponent, mapProps } from 'recompose';

export default compose(
  branch(
    ({ viewer }) => !viewer.repository.files.hits.edges[0],
    renderComponent(() => <div>No file found.</div>),
  ),
  mapProps(p => ({
    ...p,
    node: head(p.viewer.repository.files.hits.edges).node,
  })),
)(({ node }) =>
  <span>
    {node.file_id}
  </span>,
);
