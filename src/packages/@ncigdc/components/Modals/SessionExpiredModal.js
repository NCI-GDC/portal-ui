// @flow
import React from 'react';

import BaseModal from '@ncigdc/components/Modals/BaseModal';
import LoginButton from '../LoginButton';

const SessionExpired = () => (
  <BaseModal title="Session Expired" closeText="Cancel">
    Your session has expired.
    <p>
      Please <LoginButton />
    </p>
  </BaseModal>
);

export default SessionExpired;
