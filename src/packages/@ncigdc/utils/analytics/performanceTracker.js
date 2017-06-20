const startTimes = {};
export const timer = {
  time: label => {
    if (label in startTimes) {
      console.warn(`Start time for "${label}" already exists`);
    }
    startTimes[label] = performance.now();
  },
  timeEnd: label => {
    if (!startTimes[label]) {
      console.warn(`No start time was found for "${label}"`);
      return;
    }
    const duration = performance.now() - startTimes[label];
    delete startTimes[label];
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
    const properties = {
      duration,
      category,
      action: eventFields[1],
      label: eventFields[2],
      ...additionalProperties,
    };
    global.mixpanel.track(category, properties);
  },
};

export default performanceTracker;
