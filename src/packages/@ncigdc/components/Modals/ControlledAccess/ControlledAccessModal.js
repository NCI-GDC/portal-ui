// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import BaseModal from '@ncigdc/components/Modals/BaseModal';
import LoginButton from '@ncigdc/components/LoginButton';
import { setModal } from '@ncigdc/dux/modal';
import Button from '@ncigdc/uikit/Button';

class ControlledAccessModal extends Component {
  componentWillReceiveProps(nextProps) {
    // TODO: can I do something with this?
    // keep the modal open after the login process?
    const { user } = this.props;
    if (nextProps.user && !user) {
      console.log('logged in via modal');
      // nextProps.dispatch(setModal(null));
    }
  }

  render() {
    const {
      closeText = 'Close',
      message = 'You don\'t have access.',
      // TODO: remove devauth
      query: { devauth = false },
      user,
    } = this.props;

    const isLoggedIn = user || devauth;

    return (
      <BaseModal
        closeText={closeText}
        extraButtons={isLoggedIn
          ? <Button>Explore</Button>
          : (
            <LoginButton keepModalOpen>
              <Button>Login</Button>
            </LoginButton>
        )}
        title="Controlled Access"
        >
        {isLoggedIn
          ? (<p>You're logged in</p>)
          : (
            <p>
              {message}
              {' '}
              Please
              {' '}
              <LoginButton keepModalOpen>login</LoginButton>
            </p>
          )}
      </BaseModal>
    );
  }
}

export default connect(state => ({
  user: state.auth.user,
}))(ControlledAccessModal);
