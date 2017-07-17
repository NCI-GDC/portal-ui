export { default as performanceTracker } from './performanceTracker';

export const track = (name, properties) => {
  if (global.mixpanel) {
    global.mixpanel.track(name, properties);
  }
  if (global.newrelic) {
    global.newrelic.addPageAction(name, {
      ...properties,
      name,
    });
  }
};
