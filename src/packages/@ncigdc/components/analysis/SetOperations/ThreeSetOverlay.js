import React from 'react';
import TL from './Translate';

const Alias = ({ i }) => <span><em>S</em><sub>{i}</sub></span>;

export default ({
  ops,
  CountComponent,
  width,
  offset = width - 500,
  friction = 2,
}) =>
  <div
    style={{
      position: 'absolute',
      width,
      pointerEvents: 'none',
    }}
  >
    <TL x={100 + offset / friction} y={100}>
      <Alias i={1} />
    </TL>
    <TL x={380 + offset / friction} y={100}>
      <Alias i={2} />
    </TL>
    <TL x={240 + offset / friction} y={340}>
      <Alias i={3} />
    </TL>
    <TL x={241 + offset / friction} y={185}>
      <CountComponent filters={ops[0].filters} />
    </TL>
    <TL x={241 + offset / friction} y={125}>
      <CountComponent filters={ops[1].filters} />
    </TL>
    <TL x={295 + offset / friction} y={209}>
      <CountComponent filters={ops[2].filters} />
    </TL>
    <TL x={185 + offset / friction} y={209}>
      <CountComponent filters={ops[3].filters} />
    </TL>
    <TL x={165 + offset / friction} y={130}>
      <CountComponent filters={ops[4].filters} />
    </TL>
    <TL x={320 + offset / friction} y={130}>
      <CountComponent filters={ops[5].filters} />
    </TL>
    <TL x={241 + offset / friction} y={285}>
      <CountComponent filters={ops[6].filters} />
    </TL>
  </div>;
