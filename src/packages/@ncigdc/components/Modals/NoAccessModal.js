// @flow
import React from 'react';
import BaseModal from '@ncigdc/components/Modals/BaseModal';
import LoginButton from '@ncigdc/components/LoginButton';

const LoginModal = (
  {
    message = "You don't have access",
    primaryButton,
    closeText = 'Close',
  }: {
    message?: string,
    primaryButton?: any,
    closeText?: string,
  } = {},
) => (
  <BaseModal
    title="Access Error"
    extraButtons={primaryButton}
    closeText={closeText}
  >
    {message}
    <p>
      Please <LoginButton />
    </p>
  </BaseModal>
);

export default LoginModal;
