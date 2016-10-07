document.exitFullscreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen;

export const isFullScreen = function() {
  return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
}

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

