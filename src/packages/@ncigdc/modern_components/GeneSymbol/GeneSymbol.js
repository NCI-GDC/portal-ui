// @flow

import React from 'react';
import { head } from 'lodash';

export default ({ viewer: { explore } }: Object) =>
  <span>
    {head(explore.genes.hits.edges).node.symbol}
  </span>;
