// @flow

import React from 'react';
import { head, get } from 'lodash';
import { compose, branch, renderComponent } from 'recompose';

export default compose(
  branch(
    ({ viewer }) => !get(viewer, 'explore.genes.hits.edges[0]'),
    renderComponent(() => <div>No gene found.</div>),
  ),
)(({ viewer: { explore } }: Object) => (
  <span>{head(explore.genes.hits.edges).node.symbol}</span>
));
