import React from 'react';
import withData from './HasSsms.relay';
export default withData(
  p => (p.viewer.explore.ssms.hits.total ? <div>{p.children}</div> : null),
);
