import React from 'react';

import { theme } from '@ncigdc/theme/index';

const Counter = ({
  metric = 0,
  name = '',
}) => (
  <div
    style={{
      padding: 10,
      textAlign: 'center ',
    }}
    >
    <div
      style={{
        color: theme.success,
        fontSize: '3rem',
      }}
      >
      {metric}
    </div>
    <div>
      {name}
    </div>
  </div>
);

export default Counter;
