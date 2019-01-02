const startTimes = {};

const performanceTracker = {
  begin: label => {
    if (label in startTimes) {
      console.warn(`Start time for "${label}" already exists`);
    }
    startTimes[label] = Date.now();
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

    return duration;
  },
};

export default performanceTracker;
