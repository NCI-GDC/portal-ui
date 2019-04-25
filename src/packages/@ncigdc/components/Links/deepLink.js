// @flow
const HEADER_HEIGHT = 160;
const getOffset = elem => {
  const box = elem.getBoundingClientRect();

  const body = document.body;
  const docEl = document.documentElement;

  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const clientTop = docEl.clientTop || body.clientTop || 0;

  const top = box.top + scrollTop - clientTop;

  return Math.round(top);
};

let observer = undefined;
let stopObservingTimeoutId = undefined;
const reset = () => {
  if (observer) {
    observer.disconnect();
  }
  if (stopObservingTimeoutId) {
    window.clearTimeout(stopObservingTimeoutId);
  }
};

const checkAndScroll = id => {
  const el = document.getElementById(id);
  if (el) {
    window.scrollTo(0, getOffset(el) - HEADER_HEIGHT);
    reset();
  }
};

export const scrollToId = id => {
  window.setTimeout(() => {
    observer = new MutationObserver(checkAndScroll.bind(this, id));
    observer.observe(document, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    stopObservingTimeoutId = window.setTimeout(() => {
      reset();
    }, 10000);
  }, 0);
};
