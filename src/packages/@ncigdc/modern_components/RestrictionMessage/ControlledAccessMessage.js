import React from 'react';
import controlledAccessImg from '@ncigdc/theme/images/icon-controlled-data.svg';
import RestrictionMessage from './RestrictionMessage';

const ControlledAccessMessage = () => (
  <RestrictionMessage
    icon={controlledAccessImg}
    title="This controlled dataset requires dbGaP access"
    >
    <span>
      If you don&lsquo;t have access, follow the instructions for
      {' '}
      <a href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data" target="_blank">obtaining access to controlled data</a>
      .
    </span>
    <span>
      If you have access
      {' '}
      <a href="https://docs.gdc.cancer.gov/Data_Portal/Users_Guide/Getting_Started/#facet-filters">log in to view controlled data</a>
      .
    </span>
  </RestrictionMessage>
);

export default ControlledAccessMessage;
