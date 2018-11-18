import { fetchUser } from '@ncigdc/dux/auth';

import { AUTH } from '@ncigdc/utils/constants';

export default ({
  name,
  pollInterval = 600,
  winUrl = `${AUTH}?next=${location.origin}`,
  winStyle = 'width=800, height=600',
}) =>
  new Promise((resolve, reject) => {
    // console.log('Starting: ', name);

    if (navigator.cookieEnabled) {
      // console.log('Open window for: ', name);
      const win = open(winUrl, 'Auth', winStyle);
      // console.log('Window open for: ', name);

      // console.log('location origin: ', location.origin);
      // console.log('win url: ', winUrl);
      const loginAttempt = () => {
        // console.log('interval function for: ', name);
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
          // console.log('Resolving: ', name);
          resolve();
        }
      };
      // console.log('Set interval for: ', name);
      const interval = setInterval(loginAttempt, pollInterval);
    } else {
      reject('No cookies enabled');
    }
  });
