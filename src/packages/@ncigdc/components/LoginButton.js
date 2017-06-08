// @flow
/* eslint no-restricted-globals: 0 */

// Vendor
import React from 'react';
import { connect } from 'react-redux';
import LoginIcon from 'react-icons/lib/fa/sign-in';
import urlJoin from 'url-join';

// Custom
import { fetchUser } from '@ncigdc/dux/auth';
import LocationSubscriber from '@ncigdc/components/LocationSubscriber';
import styled from '@ncigdc/theme/styled';

/*----------------------------------------------------------------------------*/

const openAuthWindow = ({ pathname, dispatch }) => {
  if (navigator.cookieEnabled) {
    const returningPath = `${pathname}?${+new Date()}`;
    const redirectUrl = urlJoin(
      process.env.REACT_APP_GDC_AUTH,
      `?next=${returningPath}`,
    );

    const closeLogin = url =>
      url === redirectUrl ? false : url.includes(returningPath);

    const win = open(redirectUrl, 'Auth', 'width=800, height=600');

    const interval = setInterval(() => {
      try {
        // Because the login window redirects to a different domain, checking
        // win.document in IE11 throws exceptions right away, which prevents
        // #clearInterval from ever getting called in this block.
        // Must check this block (if the login window has been closed) first!
        if (win.closed) {
          clearInterval(interval);
        } else if (closeLogin(win.document.URL)) {
          win.close();

          setTimeout(() => {
            clearInterval(interval);
            setTimeout(() => {
              dispatch(fetchUser());
            }, 1000);
          }, 1000);
        }
      } catch (err) {
        console.log('Error while monitoring the Login window: ', err);
      }
    }, 500);
  } else {
    // show cookie needs to be enabled message
  }
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

type TLoginButtonProps = {
  children: mixed,
  dispatch: Function,
};
const LoginButton = ({ children, dispatch }: TLoginButtonProps) =>
  <LocationSubscriber>
    {({ pathname }) =>
      <Link onClick={() => openAuthWindow({ pathname, dispatch })}>
        {children ||
          <span>
            <LoginIcon />
            <span style={styles.marginLeft}>Login</span>
          </span>}
      </Link>}
  </LocationSubscriber>;

/*----------------------------------------------------------------------------*/

export default connect()(LoginButton);
