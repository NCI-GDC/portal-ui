document.exitFullscreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen;

export const isFullScreen = function(el) {
  const fullScreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
  return el && fullScreenElement ? fullScreenElement === el : fullScreenElement;
};

export const exitFullScreen = function() {
  document.exitFullscreen && document.exitFullscreen();
};

export const enterFullScreen = function(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
  }
};

