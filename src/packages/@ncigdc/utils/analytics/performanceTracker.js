import _ from 'lodash';

const startTimes = {};
const timer = {
  time: label => (startTimes[label] = performance.now()),
  timeEnd: label => {
    if (!startTimes[label]) {
      console.warn(`No start time was found for "${label}"`);
      return;
    }
    const duration = performance.now() - startTimes[label];
    return duration;
  },
};

const performanceTracker = {
  begin: label => {
    timer.time(label);
    global.mixpanel.time_event(label);
  },
  end: (label, additionalProperties) => {
    const duration = timer.timeEnd(label);
    const properties = _.isNil(duration)
      ? {
          duration,
          ...additionalProperties,
        }
      : {
          errorCode: 404,
        };

    global.mixpanel.track(label, properties);
  },
};

export default performanceTracker;
