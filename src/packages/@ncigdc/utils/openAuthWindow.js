import { AUTH, IS_DEV } from '@ncigdc/utils/constants';

export default ({
  name,
  pollInterval = 600,
  winUrl = `${AUTH}?next=${location.origin}`,
  winStyle = 'width=800, height=600',
}) =>
  new Promise((resolve, reject) => {
    if (IS_DEV) return resolve('localhost');
    if (navigator.cookieEnabled) {
      const win = open(winUrl, 'Auth', winStyle);
      const loginAttempt = () => {
        if (win.closed) {
          clearInterval(interval);
          reject('window closed manually');
        }
        if (
          win.document.URL.includes(location.origin) &&
          !win.document.URL.includes('auth')
        ) {
          // Window is not closed yet so close
          win.close();

          // Clear the interval calling this function
          clearInterval(interval);
          if (win.document.URL.includes('error=401')) {
            reject('login_error');
            return;
          }
          // Resolve that we have something good
          resolve('success');
        }
      };
      const interval = setInterval(loginAttempt, pollInterval);
    } else {
      reject('No cookies enabled');
    }
  });
