// @flow

import React from 'react';

export default () => (
  <div
    className="spinParticleContainer"
    style={{ top: 'auto', left: 'auto', position: 'inherit' }}
  >
    <div className="particle red" />
    <div className="particle grey other-particle" />
    <div className="particle blue other-other-particle" />
  </div>
);
