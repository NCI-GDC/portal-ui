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
  pathname,
  dispatch,
  user,
  pollInterval = 600,
  winUrl = `${AUTH}?next=${location.origin}`,
  winStyle = 'width=800, height=600',
}) =>
  new Promise((resolve, reject) => {
    if (navigator.cookieEnabled) {
      const win = open(winUrl, 'Auth', winStyle);
      // window.loginPopup = win;
      console.log('location origin: ', location.origin);
      console.log('is first window open? ', first);
      console.log('win url: ', winUrl);
      console.log('user? ', user);

      const interval = setInterval(loginAttempt, pollInterval);

      const loginAttempt = () => {
        try {
          // Because the login window redirects to a different domain, checking
          // win.document in IE11 throws exceptions right away, which prevents
          // #clearInterval from ever getting called in this block.
          // Must check this block (if the login window has been closed) first!
          if (win.closed) {
            console.log('window closed? ', win.closed);
            clearInterval(interval);
          } else if (
            win.document.URL.includes(location.origin) &&
            !win.document.URL.includes('auth')
          ) {
            // Window is not closed yet so close
            if (!win.closed) {
              win.close();
            }

            // Clear the interval calling this function
            clearInterval(interval);

            // Resolve that we have something good
            resolve();
          }
        } catch (err) {
          clearInterval(interval);
          reject('Error while monitoring the Login window: ', err);
        }
      };
    } else {
      reject('Error while monitoring the Login window: ', err);
    }
  });

const fenceLogin = ({ pathname, dispatch, user, location }) => {
  dispatch(fetchUser());
  // login with fence
  console.log('log in with fence');
  return openAuthWindow({
    pathname,
    dispatch,
    user,
    pollInterval: 500,
    winUrl: `${FENCE}/login/fence?redirect=${location.origin}`,
    winStyle:
      'toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,left=50000, top=50000, width=1, height=1, visible=none',
  });
};

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
          await openAuthWindow({ pathname, dispatch, user, pollInterval: 200 });
          await fenceLogin({ pathname, dispatch, user, location });
          console.log('redirecting to repository page');
          push('/repository');
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
