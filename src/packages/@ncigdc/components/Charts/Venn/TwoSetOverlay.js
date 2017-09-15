import React from 'react';
import TL from './Translate';

const Alias = ({ i }) => <span><em>S</em><sub>{i}</sub></span>;

export default ({
  ops,
  CountComponent,
  width,
  xoffset = width - 500,
  friction = 2,
}) =>
  <div style={{ position: 'absolute', width, pointerEvents: 'none', top: 0 }}>
    <TL x={120 + xoffset / friction} y={80}>
      <Alias i={1} />
    </TL>
    <TL x={350 + xoffset / friction} y={80}>
      <Alias i={2} />
    </TL>
    <TL x={241 + xoffset / friction} y={160}>
      <CountComponent filters={ops[0].filters} />
    </TL>
    <TL x={165 + xoffset / friction} y={160}>
      <CountComponent filters={ops[1].filters} />
    </TL>
    <TL x={320 + xoffset / friction} y={160}>
      <CountComponent filters={ops[2].filters} />
    </TL>
  </div>;
