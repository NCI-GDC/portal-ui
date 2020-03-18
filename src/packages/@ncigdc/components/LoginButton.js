// @flow
/* eslint no-restricted-globals: 0 */
import React from 'react';
import { connect } from 'react-redux';
import LoginIcon from 'react-icons/lib/fa/sign-in';
import LocationSubscriber from '@ncigdc/components/LocationSubscriber';
import styled from '@ncigdc/theme/styled';
import openAuthWindow from '@ncigdc/utils/openAuthWindow';
import { fetchUser } from '@ncigdc/dux/auth';
import { fetchNotifications } from '@ncigdc/dux/bannerNotification';
import { setModal } from '@ncigdc/dux/modal';


/*----------------------------------------------------------------------------*/

const Link = styled.a({
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'background-color 0.2s ease',
});

const LoginButton = ({ children, dispatch, user }) => (
  <LocationSubscriber>
    {({ pathname, push }) => (
      <Link
        className="test-login-button"
        onClick={async () => {
          await dispatch(setModal(null));
          await openAuthWindow({
            name: 'NIH',
          });
          await dispatch(fetchUser());
          await dispatch(fetchNotifications());
        }}
        >

        {children || (
          <span>
            <LoginIcon />
            <span className="header-hidden-sm header-hidden-md">
              Login
            </span>
          </span>
        )}
      </Link>
    )}
  </LocationSubscriber>
);

/*----------------------------------------------------------------------------*/

export default connect(state => state.auth)(LoginButton);
