import { fetchUser } from '@ncigdc/dux/auth';

import { AUTH } from '@ncigdc/utils/constants';

export default ({
  name,
  pollInterval = 600,
  winUrl = `${AUTH}?next=${location.origin}`,
  winStyle = 'width=800, height=600',
}) =>
  new Promise((resolve, reject) => {
    console.log('win.open URL: ', winUrl);
    if (navigator.cookieEnabled) {
      const win = open(winUrl, 'Auth', winStyle);

      const loginAttempt = () => {
        if (win.closed) {
          clearInterval(interval);
          reject('Window closed manually');
        }
        console.log('in loginAttempt: ', win.document.URL);
        if (
          win.document.URL.includes(location.origin) &&
          !win.document.URL.includes('auth')
        ) {
          console.log('return to origin: ', win.document.URL);
          if (win.document.URL.includes('login_error')) {
            console.log('there was an error');
            reject('login_error');
          }
          // Window is not closed yet so close
          win.close();

          // Clear the interval calling this function
          clearInterval(interval);

          // Resolve that we have something good
          resolve();
        }
      };
      const interval = setInterval(loginAttempt, pollInterval);
    } else {
      reject('No cookies enabled');
    }
  });
