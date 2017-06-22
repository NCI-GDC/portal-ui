const startTimes = {};

const performanceTracker = {
  begin: label => {
    if (label in startTimes) {
      console.warn(`Start time for "${label}" already exists`);
    }
    startTimes[label] = Date.now();
    global.mixpanel.time_event(label.split(':')[0]);
    return startTimes[label];
  },
  end: (label, additionalProperties) => {
    if (!startTimes[label]) {
      console.warn(`No start time was found for "${label}"`);
      return;
    }
    const endTime = Date.now();
    const startTime = startTimes[label];
    delete startTimes[label];

    const duration = endTime - startTime;
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

    global.newrelic.addPageAction(label, {
      ...properties,
      name: label,
    });

    global.newrelic.addToTrace({
      ...properties,
      name: label,
      start: startTime,
      end: endTime,
    });

    return duration;
  },
};

export default performanceTracker;
