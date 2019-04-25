// @flow
import React from 'react';

import BaseModal from '@ncigdc/components/Modals/BaseModal';
import LoginButton from '../LoginButton';

const SessionExpired = () => (
  <BaseModal closeText="Cancel" title="Session Expired">
    Your session has expired.
    <p>
      Please
      {' '}
      <LoginButton />
    </p>
  </BaseModal>
);

export default SessionExpired;
