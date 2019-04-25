import React from 'react';
import { get } from 'lodash';

import withData from './HasCases.relay';

export default withData(
  p => (get(p, 'viewer.explore.cases.hits.total', 0) ? (
    <div>{p.children}</div>
    ) : null),
);
