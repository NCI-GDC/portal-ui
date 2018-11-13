// @flow
/* eslint no-restricted-globals: 0 */
import React from 'react';
import { connect } from 'react-redux';
import LoginIcon from 'react-icons/lib/fa/sign-in';
import { fetchUser } from '@ncigdc/dux/auth';
import LocationSubscriber from '@ncigdc/components/LocationSubscriber';
import styled from '@ncigdc/theme/styled';
import { AUTH, FENCE } from '@ncigdc/utils/constants';

/*----------------------------------------------------------------------------*/

const openAuthWindow = ({
  name,
  pathname,
  dispatch,
  pollInterval = 600,
  winUrl = `${AUTH}?next=${location.origin}`,
  winStyle = 'width=800, height=600',
}) =>
  new Promise((resolve, reject) => {
    console.log('Starting: ', name);

    if (navigator.cookieEnabled) {
      console.log('Open window for: ', name);
      const win = open(winUrl, 'Auth', winStyle);
      console.log('Window open for: ', name);

      console.log('location origin: ', location.origin);
      console.log('win url: ', winUrl);
      const loginAttempt = () => {
        console.log('interval function for: ', name);
        if (win.closed) {
          clearInterval(interval);
          reject('Window closed manually');
        }

        if (
          win.document.URL.includes(location.origin) &&
          !win.document.URL.includes('auth')
        ) {
          // Window is not closed yet so close
          win.close();

          // Clear the interval calling this function
          clearInterval(interval);

          // Resolve that we have something good
          console.log('Resolving: ', name);
          resolve();
        }
      };
      console.log('Set interval for: ', name);
      const interval = setInterval(loginAttempt, pollInterval);
    } else {
      reject('No cookies enabled');
    }
  });

const fenceLogin = ({ pathname, dispatch, location, name }) => {
  dispatch(fetchUser());
  return openAuthWindow({
    name,
    pathname,
    dispatch,
    pollInterval: 500,
    winUrl: `${FENCE}/login/fence?redirect=${location.origin}`,
    winStyle:
      'toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,left=50000, top=50000, width=1, height=1, visible=none',
  });
};

const Link = styled.button({
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
          try {
            await openAuthWindow({
              name: 'NIH Login',
              pathname,
              dispatch,
              pollInterval: 200,
            });
            await fenceLogin({
              name: 'Fence Login',
              pathname,
              dispatch,
              location,
            });
            console.log('redirecting to repository page');
            push({ pathname: '/repository' });
          } catch (err) {
            console.log('Login flow error: ', err);
          }
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
