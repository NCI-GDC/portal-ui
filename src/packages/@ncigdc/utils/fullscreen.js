// @flow

document.exitFullscreen =
  document.exitFullscreen ||
  document.mozCancelFullScreen ||
  document.webkitExitFullscreen;

export const isFullScreen = el => {
  const fullScreenElement =
    document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement;

  return el && fullScreenElement ? fullScreenElement === el : fullScreenElement;
};

export const exitFullScreen = () => document.exitFullscreen && document.exitFullscreen();

export const enterFullScreen = element => {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
  }
};
