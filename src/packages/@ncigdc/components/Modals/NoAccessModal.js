// @flow
import React from 'react';
import { connect } from 'react-redux';

import BaseModal from '@ncigdc/components/Modals/BaseModal';
import LoginButton from '@ncigdc/components/LoginButton';
import { setModal } from '@ncigdc/dux/modal';

class LoginModal extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.user && !this.props.user) {
      nextProps.dispatch(setModal(null));
    }
  }
  render() {
    const {
      message = "You don't have access",
      primaryButton,
      closeText = 'Close',
    } = this.props;

    return (
      <BaseModal
        title="Access Alert"
        extraButtons={primaryButton}
        closeText={closeText}
      >
        {message}
        <p>
          Please <LoginButton />
        </p>
      </BaseModal>
    );
  }
}

export default connect(state => ({
  user: state.auth.user,
}))(LoginModal);