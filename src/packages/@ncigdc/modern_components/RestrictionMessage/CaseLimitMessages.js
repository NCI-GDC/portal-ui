import React from 'react';
import {
  DISPLAY_DAVE_CA,
} from '@ncigdc/utils/constants';
import RestrictionMessagesContainer from './RestrictionMessagesContainer';
import ControlledAccessMessage from './ControlledAccessMessage';
import Filter10kMessage from './Filter10kMessage';

const CaseLimitMessages = ({ isCaseLimitExceeded }) => (
  <RestrictionMessagesContainer>
    {DISPLAY_DAVE_CA && (
      <ControlledAccessMessage />
    )}
    {isCaseLimitExceeded && (
      <Filter10kMessage />
    )}
  </RestrictionMessagesContainer>
);

export default CaseLimitMessages;
