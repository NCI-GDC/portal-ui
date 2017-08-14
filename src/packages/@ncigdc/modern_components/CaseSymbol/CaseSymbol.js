// @flow

import React from 'react';
import { head } from 'lodash';
import { compose, branch, renderComponent, mapProps } from 'recompose';

export default compose(
  branch(
    ({ viewer }) => !viewer.repository.cases.hits.edges[0],
    renderComponent(() => <div>No case found.</div>),
  ),
  mapProps(p => ({
    ...p,
    node: head(p.viewer.repository.cases.hits.edges).node,
  })),
)(({ node }) =>
  <span>
    {node.project.project_id} / {node.submitter_id}
  </span>,
);
