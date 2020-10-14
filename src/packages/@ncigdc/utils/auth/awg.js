import { throttle } from 'lodash';
import urlJoin from 'url-join';
import moment from 'moment';

import consoleDebug from '@ncigdc/utils/consoleDebug';
import {
  AWG,
  AWG_TOKEN_EXPIRY, // defaults to 5 minutes
  AWG_TOKEN_RENEWAL_INTERVAL, // defaults to 0, disabled
  FENCE,
} from '@ncigdc/utils/constants';

const createSessionRenewalTimestamp = now => {
  consoleDebug(`Creating session timestamp at ${now}`);
  localStorage.setItem('awg_sessionLastRenewed', now);
  return !!localStorage.awg_sessionLastRenewed;
};

const removeSessionRenewalTimestamp = () => {
  localStorage.removeItem('awg_sessionLastRenewed');
  return !localStorage.awg_sessionLastRenewed;
};

const resetSessionRenewalTimestamp = now => (
  removeSessionRenewalTimestamp() &&
  createSessionRenewalTimestamp(now)
);

/* this is meant to avoid duplicate queries, because having multiple Relay Environments
 * means renewal race conditions not worth dealing with at this point. ¯\_(ツ)_/¯
 */
let queryCache = null;
const handleQueryCache = value => {
  // hold and use the latest response for 5 seconds;
  queryCache = value;

  setTimeout(() => {
    queryCache = null;
  }, 5000);

  return queryCache;
};

const renewAWGToken = throttle(({
  now,
  origin,
  timeSinceLastRenewal,
}) => {
  consoleDebug(`Querying AWG fence at ${now}, by ${origin}`);

  return queryCache || fetch(urlJoin(FENCE, 'user'), {
    credentials: 'include',
  })
    .then(response => {
      const responseTimestamp = moment.utc().format();
      consoleDebug(`response on AWG token renewal at ${responseTimestamp}, triggered by ${origin}`);
      consoleDebug(response);

      response.ok
        ? resetSessionRenewalTimestamp(responseTimestamp)
        : removeSessionRenewalTimestamp();

      return handleQueryCache(response.ok);
    })
    .catch(err => {
      console.error(`Error ${
        timeSinceLastRenewal ? 'renewing' : 'creating'
      } the AWG token`, err);
      timeSinceLastRenewal && console.error(`Time since last renewal: ${
        timeSinceLastRenewal / 1000
      } seconds`);
      removeSessionRenewalTimestamp();

      throw handleQueryCache(err);
    });
}, 1000);

export const checkAWGSession = (renewalType = 'manual', origin = 'unknown origin') => {
  if (localStorage.awg_sessionLastRenewed) {
    const nowMoment = moment.utc();
    const now = nowMoment.format();
    const timeSinceLastRenewal = nowMoment.diff(moment(
      localStorage.awg_sessionLastRenewed.replace('-pending', ''), // '-pending' throttles queries
    ));

    consoleDebug(`Checking AWG token at ${now}, ${renewalType}. Time since last renewal is ${timeSinceLastRenewal}`);
    consoleDebug(`Origin: ${origin}`);

    return timeSinceLastRenewal < AWG_TOKEN_EXPIRY
        ? (
          consoleDebug(`Token set less than ${
            AWG_TOKEN_EXPIRY / 60 / 1000
          } minutes ago, ${timeSinceLastRenewal / 1000} seconds`),
          'Token shouldn\'t need renewal yet'
        )
        : (
          consoleDebug(`Attempting token renewal at ${now}, by ${origin}`),
          renewAWGToken({
            now,
            origin,
            timeSinceLastRenewal,
          })
        );
  }
  return !AWG; // do not interfere if not on AWG
};

export const clearAWGSession = timerId => {
  if (localStorage.awg_sessionLastRenewed) {
    consoleDebug('Clearing AWG session timestamps');
    timerId && clearInterval(timerId);
    return removeSessionRenewalTimestamp();
  }
};

export const createAWGSession = () => {
  const now = moment.utc().format();
  consoleDebug('Starting AWG session');
  removeSessionRenewalTimestamp();
  return renewAWGToken(response => {
    consoleDebug('response on AWG token initial creation');
    consoleDebug(response);
    createSessionRenewalTimestamp(now);
    return response;
  }, {
    now,
    origin: 'Login',
  });
};

export const keepAliveAWGSession = () =>
  AWG_TOKEN_RENEWAL_INTERVAL && setInterval(() => {
    consoleDebug(`${
      localStorage.awg_sessionLastRenewed ? 'Renewing' : 'Attempting to Renew'
      } session every ${AWG_TOKEN_RENEWAL_INTERVAL / 1000} seconds`);
    checkAWGSession('timed');
  }, AWG_TOKEN_RENEWAL_INTERVAL);
