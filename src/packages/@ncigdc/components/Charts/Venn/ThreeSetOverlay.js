import React from 'react';
import Alias from '@ncigdc/components/Alias';
import { floatingNumber } from './style';

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
        style={{ position: 'absolute', bottom: '91%', right: '91%' }}
      />
      <Alias
        i={2}
        style={{ position: 'absolute', bottom: '91%', left: '91%' }}
      />
      <Alias
        i={3}
        style={{
          position: 'absolute',
          top: '101%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />
      <CountComponent
        filters={ops[4].filters}
        style={{ ...floatingNumber, left: '18.5%', top: '28%' }}
      />
      <CountComponent
        filters={ops[3].filters}
        style={{ ...floatingNumber, left: '30%', top: '57%' }}
      />
      <CountComponent
        filters={ops[1].filters}
        style={{ ...floatingNumber, top: '23%' }}
      />
      <CountComponent
        filters={ops[0].filters}
        style={{ ...floatingNumber, top: '45%' }}
      />
      <CountComponent
        filters={ops[6].filters}
        style={{ ...floatingNumber, top: '82%' }}
      />
      <CountComponent
        filters={ops[2].filters}
        style={{ ...floatingNumber, left: '70%', top: '57%' }}
      />
      <CountComponent
        filters={ops[5].filters}
        style={{ ...floatingNumber, left: '81.5%', top: '28%' }}
      />
    </div>
  );
};
