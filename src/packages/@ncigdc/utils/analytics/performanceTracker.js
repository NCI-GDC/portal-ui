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
    global.mixpanel.time_event(label.split(':')[0]);
  },
  end: (label, additionalProperties) => {
    const duration = timer.timeEnd(label);
    const eventFields = label.split(':');
    const category = eventFields[0];
    global.mixpanel.track(category, {
      duration,
      category,
      action: eventFields[1],
      label: eventFields[2],
      ...additionalProperties,
    });
  },
};

export default performanceTracker;
