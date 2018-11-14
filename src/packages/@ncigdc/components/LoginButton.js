// @flow
/* eslint no-restricted-globals: 0 */
import React from 'react';
import { connect } from 'react-redux';
import LoginIcon from 'react-icons/lib/fa/sign-in';
import LocationSubscriber from '@ncigdc/components/LocationSubscriber';
import styled from '@ncigdc/theme/styled';
import openAuthWindow from '@ncigdc/utils/openAuthWindow';

/*----------------------------------------------------------------------------*/

const Link = styled.a({
  textDecoration: 'none',
  transition: 'background-color 0.2s ease',
  cursor: 'pointer',
});

const styles = {
  marginLeft: {
    marginLeft: '0.7rem',
  },
};

const LoginButton = ({ children, dispatch, user }) => (
  <LocationSubscriber>
    {({ pathname, push }) => (
      <Link
        className="test-login-button"
        onClick={async () => {
          await openAuthWindow({
            name: 'NIH',
          });
          await dispatch(fetchUser());
        }}
      >
        {children || (
          <span>
            <LoginIcon />
            <span
              className="header-hidden-sm header-hidden-md"
              style={styles.marginLeft}
            >
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
