import React from 'react';
import countComponents from '@ncigdc/modern_components/Counts';
import TwoSetOverlay from './TwoSetOverlay';
import ThreeSetOverlay from './ThreeSetOverlay';
import VennSvg from './VennSvg';
import buildOps from './buildOps';

export { VennSvg, buildOps };

export default ({ style, width, ops, type, data, ...props }) => {
  const OverlayComponent = data.length === 2 ? TwoSetOverlay : ThreeSetOverlay;

  return (
    <div style={{ ...style, position: 'relative' }}>
      <VennSvg {...props} width={width} ops={ops} data={data} />
      <OverlayComponent
        width={width}
        ops={ops}
        CountComponent={countComponents[type]}
      />
    </div>
  );
};
