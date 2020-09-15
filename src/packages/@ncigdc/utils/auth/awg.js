import { debounce } from 'lodash';
import urlJoin from 'url-join';
import moment from 'moment';

import consoleDebug from '@ncigdc/utils/consoleDebug';
import {
  AWG,
  AWG_TOKEN_EXPIRY, // defaults to 5 minutes
  AWG_TOKEN_RENEWAL_INTERVAL, // defaults to 0, disabled
  FENCE,
} from '@ncigdc/utils/constants';

const createSessionRenewalTimestamp = logIt => {
  const timestamp = moment.utc().format();
  logIt && consoleDebug(`creating session timestamp at ${timestamp}`);
  localStorage.setItem('awg_sessionLastRenewed', timestamp);
};

const removeSessionRenewalTimestamp = () => {
  localStorage.removeItem('awg_sessionLastRenewed');
};

const resetSessionRenewalTimestamp = () => {
  removeSessionRenewalTimestamp();
  createSessionRenewalTimestamp();
};

const renewAWGToken = debounce((cb = r => r) => (
  fetch(urlJoin(FENCE, 'user'), {
    credentials: 'include',
  }).then(response => cb(response))
    .catch(err => {
      console.error('Error renewing AWG token', err);
      removeSessionRenewalTimestamp();
      throw err;
    })
));

export const checkAWGSession = (renewalType = 'manual') => {
  if (localStorage.awg_sessionLastRenewed) {
    const lastRenewal = moment(localStorage.awg_sessionLastRenewed);
    const difference = moment.utc().diff(lastRenewal);

    // This renews the token manually, in case a timer hasn't been set
    return difference < AWG_TOKEN_EXPIRY ||
      renewAWGToken(response => {
        consoleDebug(`response on AWG token ${renewalType} renewal`);
        consoleDebug(response);
        resetSessionRenewalTimestamp();
        return response;
      });
  }
  return !AWG; // do not interfere if not on AWG
};

export const clearAWGSession = timerId => {
  consoleDebug('Clearing AWG session timestamps');
  timerId && clearInterval(timerId);
  removeSessionRenewalTimestamp();
};

export const createAWGSession = () => {
  consoleDebug('Starting AWG session');
  removeSessionRenewalTimestamp();
  renewAWGToken(response => {
    consoleDebug('response on AWG token initial creation');
    consoleDebug(response);
    createSessionRenewalTimestamp('log it!');
    return response;
  });
};

export const keepAliveAWGSession = () =>
  AWG_TOKEN_RENEWAL_INTERVAL && setInterval(() => {
    consoleDebug(`${
      localStorage.awg_sessionLastRenewed ? 'Renewing' : 'Attempting to Renew'
      } session every ${AWG_TOKEN_RENEWAL_INTERVAL / 1000} seconds`);
    checkAWGSession('timed');
  }, AWG_TOKEN_RENEWAL_INTERVAL);
