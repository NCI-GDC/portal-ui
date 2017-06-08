/* eslint-disable */
const timeoutError = new Error("fetch timeout");

function isFunction(value) {
  return !!(value && value.constructor && value.call && value.apply);
}

function promiseTimeoutDelay(
  promise,
  timeoutMS,
  delayMS = 0,
  forceRetryWhenDelay,
  retry
) {
  return new Promise((resolve, reject) => {
    const timeoutPromise = () => {
      const timeoutId = setTimeout(() => {
        retry(timeoutError);
      }, timeoutMS);

      promise.then(
        res => {
          clearTimeout(timeoutId);
          resolve(res);
        },
        err => {
          clearTimeout(timeoutId);
          reject(err);
        }
      );
    };

    if (delayMS > 0) {
      let delayInProgress = true;
      const delayId = setTimeout(() => {
        delayInProgress = false;
        timeoutPromise();
      }, delayMS);

      if (forceRetryWhenDelay) {
        forceRetryWhenDelay(() => {
          if (delayInProgress) {
            clearTimeout(delayId);
            timeoutPromise();
          }
        }, delayMS);
      }
    } else {
      timeoutPromise();
    }
  });
}

export default function retryMiddleware(opts = {}) {
  const fetchTimeout = opts.fetchTimeout || 15000;
  const retryDelays = opts.retryDelays || [1000, 3000];
  const statusCodes = opts.statusCodes || false;
  const logger = opts.logger || console.log.bind(console, "[RELAY-NETWORK]");
  const allowMutations = opts.allowMutations || false;
  const forceRetry = opts.forceRetry || false;

  let retryAfterMs = () => false;
  if (retryDelays) {
    if (Array.isArray(retryDelays)) {
      retryAfterMs = attempt => {
        if (retryDelays.length >= attempt) {
          return retryDelays[attempt - 1];
        }
        return false;
      };
    } else if (isFunction(retryDelays)) {
      retryAfterMs = retryDelays;
    }
  }

  return next => req => {
    return new Promise(function(resolve, reject) {
      if (req.relayReqType === "mutation" && !allowMutations) {
        resolve(next(req));
      }

      let attempt = 0;
      let attempts = [];
      const sendTimedRequest = (timeout, delay = 0) => {
        attempt++;
        attempts.push(next(req));
        const retry = err => {
          if (err === timeoutError) {
            const retryDelayMS = retryAfterMs(attempt);
            if (retryDelayMS) {
              logger(`response timeout, retrying after ${retryDelayMS} ms`);
              return sendTimedRequest(timeout, retryDelayMS);
            }
          }

          return new Promise((resolve, reject) => reject(err));
        };

        return promiseTimeoutDelay(
          Promise.race(attempts),
          timeout,
          delay,
          forceRetry,
          retry
        )
          .then(res => {
            let statusError = false;
            if (statusCodes) {
              statusError = statusCodes.indexOf(res.status) !== -1;
            } else {
              statusError = res.status < 200 || res.status > 300;
            }

            if (statusError) {
              const retryDelayMS = retryAfterMs(attempt);
              if (retryDelayMS) {
                logger(
                  `response status ${res.status}, retrying after ${retryDelayMS} ms`
                );
                return sendTimedRequest(timeout, retryDelayMS);
              }
            }

            return res;
          })
          .catch(retry)
          .then(resolve, reject);
      };

      sendTimedRequest(fetchTimeout, 0);
    });
  };
}
