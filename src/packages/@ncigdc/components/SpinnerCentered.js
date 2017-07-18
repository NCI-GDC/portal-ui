// @flow
import React from 'react';

import Particle from '@ncigdc/uikit/Loaders/Particle';
import { Column } from '@ncigdc/uikit/Flex';

type TProps = {
  style: Object,
};

const SpinnerCentered = ({ style, ...props }: TProps) =>
  <Column
    data-test="spinner"
    style={{
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: 20,
      ...style,
    }}
    {...props}
  >
    <Particle />
  </Column>;

export default SpinnerCentered;
