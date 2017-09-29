import React from 'react';
import countComponents from '@ncigdc/modern_components/Counts';
import TwoSetOverlay from './TwoSetOverlay';
import ThreeSetOverlay from './ThreeSetOverlay';
import VennSvg from './VennSvg';
import buildOps from './buildOps';

export { VennSvg, buildOps };

export default ({ style, ops, type, ...props }) => {
  const numCircles = ops.length === 3 ? 2 : 3;
  const OverlayComponent = numCircles === 2 ? TwoSetOverlay : ThreeSetOverlay;
  return (
    <div style={{ padding: '0 20px', ...style }}>
      <div
        style={{ display: 'inline-block', position: 'relative', width: '100%' }}
      >
        <VennSvg {...props} ops={ops} numCircles={numCircles} />
        <OverlayComponent ops={ops} CountComponent={countComponents[type]} />
      </div>
    </div>
  );
};
