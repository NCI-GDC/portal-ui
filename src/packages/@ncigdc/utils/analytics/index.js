export { default as performanceTracker } from './performanceTracker';

export const track = (name, properties) => {
  if (global.mixpanel) {
    global.mixpanel.track(name, properties);
  }
};
