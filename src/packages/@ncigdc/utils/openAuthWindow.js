import { fetchUser } from '@ncigdc/dux/auth';

import { AUTH } from '@ncigdc/utils/constants';

export default ({
  name,
  pollInterval = 600,
  winUrl = `${AUTH}?next=${location.origin}`,
  winStyle = 'width=800, height=600',
}) =>
  new Promise((resolve, reject) => {
    if (navigator.cookieEnabled) {
      const win = open(winUrl, 'Auth', winStyle);
      console.log('url: ', winUrl);
      const loginAttempt = () => {
        if (win.closed) {
          clearInterval(interval);
          reject('window closed manually');
        }
        console.log('win.document.url in loginAttempt: ', win.document.URL);
        if (
          win.document.URL.includes(location.origin) &&
          !win.document.URL.includes('auth')
        ) {
          console.log('redirected: ', win.document.URL);

          // Window is not closed yet so close
          win.close();

          // Clear the interval calling this function
          clearInterval(interval);
          if (win.document.URL.includes('login_error')) {
            reject('login_error');
          }
          console.log('login success');
          // Resolve that we have something good
          resolve('success');
        }
      };
      const interval = setInterval(loginAttempt, pollInterval);
    } else {
      reject('No cookies enabled');
    }
  });
