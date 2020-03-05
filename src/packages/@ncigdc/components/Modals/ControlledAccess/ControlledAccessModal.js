// @flow
import React from 'react';
import { connect } from 'react-redux';
import {
  compose, withState,
} from 'recompose';

import BaseModal from '@ncigdc/components/Modals/BaseModal';
import LoginButton from '@ncigdc/components/LoginButton';
import Button from '@ncigdc/uikit/Button';

import CAMessage from './CAMessage';
import CADevControls from './CADevControls';

const enhance = compose(
  connect(state => ({
    user: state.auth.user,
  })),
  withState('isLoggedIn', 'setIsLoggedIn', false),
  withState('hasAccess', 'setHasAccess', false),
  withState('showDevControls', 'setShowDevControls', false),
);

const ControlledAccessModal = ({
  closeText = 'Close',
  hasAccess,
  isLoggedIn,
  setHasAccess,
  setIsLoggedIn,
  setShowDevControls,
  showDevControls,
  user,
}) => {
  const isAuth = user || isLoggedIn;

  return (
    <BaseModal
      closeText={closeText}
      extraButtons={isAuth
        ? <Button>Explore</Button>
        : (
          <LoginButton keepModalOpen>
            <Button>Login</Button>
          </LoginButton>
      )}
      title="Explore Controlled & Open Data"
      >
      <CADevControls
        hasAccess={hasAccess}
        isLoggedIn={isLoggedIn}
        setHasAccess={setHasAccess}
        setIsLoggedIn={setIsLoggedIn}
        setShowDevControls={setShowDevControls}
        showDevControls={showDevControls}
        />
      <CAMessage hasAccess={hasAccess} isAuth={isAuth} />
    </BaseModal>
  );
};

export default enhance(ControlledAccessModal);
