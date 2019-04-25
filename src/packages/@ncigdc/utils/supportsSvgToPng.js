// @flow
const svg =
  '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" [<!ENTITY nbsp "&#160;">]><svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"><foreignObject><div xmlns="http://www.w3.org/1999/xhtml">test</div></foreignObject></svg>';

let var SecurityError: any;

let isSupported = true;

const src = `data:image/svg+xml;base64,${window.btoa(svg)}`;
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

const image = new Image();

image.onload = () => {
  // $FlowIgnore
  context.drawImage(image, 0, 0);

  try {
    canvas.toDataURL('image/png', 0.8);
  } catch (e) {
    if (
      (typeof SecurityError !== 'undefined' && e instanceof SecurityError) ||
      e.name === 'SecurityError'
    ) {
      isSupported = false;
    }
  }
};

image.src = src;

function supportsSvgToPng(): boolean {
  return isSupported;
}

export default supportsSvgToPng;
