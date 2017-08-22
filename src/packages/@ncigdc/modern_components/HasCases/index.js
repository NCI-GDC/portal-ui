import React from 'react';
import withData from './HasCases.relay';
export default withData(
  p => (p.viewer.explore.cases.hits.total ? <div>{p.children}</div> : null),
);
