import React from 'react';
import controlledAccessImg from '@ncigdc/theme/images/icon-controlled-data.svg';
import LoginButton from '@ncigdc/components/LoginButton';
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
      <LoginButton><span style={{ textDecoration: 'underline' }}>log in to view controlled data</span></LoginButton>
      .
    </span>
  </RestrictionMessage>
);

export default ControlledAccessMessage;
