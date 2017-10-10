import React from 'react';

import Alias from '@ncigdc/components/Alias';
import { absoluteCenter } from '@ncigdc/theme/mixins';

export default ({ ops, CountComponent, style }) => {
  return (
    <div
      style={{
        ...style,
        position: 'absolute',
        pointerEvents: 'none',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <Alias
        i={1}
        style={{
          position: 'absolute',
          top: '50%',
          right: '102%',
          transform: 'translateY(-50%)',
        }}
      />
      <Alias
        i={2}
        style={{
          position: 'absolute',
          top: '50%',
          left: '102%',
          transform: 'translateY(-50%)',
        }}
      />
      <CountComponent
        filters={ops[1].filters}
        style={{ ...absoluteCenter, left: '20%' }}
      />
      <CountComponent filters={ops[0].filters} style={absoluteCenter} />
      <CountComponent
        filters={ops[2].filters}
        style={{ ...absoluteCenter, left: '80%' }}
      />
    </div>
  );
};
