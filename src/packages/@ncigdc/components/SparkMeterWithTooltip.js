import React from 'react';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import SparkMeter from '@ncigdc/uikit/SparkMeter';

export default ({ part, whole }) => (
  <Tooltip Component={`${(part / whole * 100).toFixed(2)}%`}>
    <SparkMeter
      aria-label={`${(part / whole * 100).toFixed(2)}%`}
      value={part / whole} />
  </Tooltip>
);
