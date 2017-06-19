import _ from 'lodash';

const startTimes = {};
export const timer = {
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
    global.mixpanel.track(label, {
      duration,
      ...additionalProperties,
    });
  },
};

export default performanceTracker;
