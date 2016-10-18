import saveSvgAsPng from 'save-svg-as-png';

const fontRegEx = /(font-size: ?)(([0-9]*(\.[0-9]+))?([^;]*))/;

function downloadUri(uri, fileName) {
  if (navigator.msSaveOrOpenBlob) {
    navigator.msSaveOrOpenBlob(uriToBlob(uri), fileName);
  } else {
    const a = document.createElement('a');
    a.download = fileName;
    a.href = uri;
    document.body.appendChild(a);
    a.click();
    a.parentNode.removeChild(a);
  }
}

const defaultConfig = {
  scale: 1,
  backgroundColor: '#fff',
  modifyStyle: (r) => {
    const size = r.match(fontRegEx);
    return r.replace(fontRegEx, () => `font-size: ${size[5] === 'rem' ? `${(parseFloat(size[3]) * 10)}px` : size[2]}`);
  },
};

function downloadSvg({ svg, stylePrefix, fileName = 'export.svg' }) {
  const selectorRemap = stylePrefix ? s => s.replace(stylePrefix, '').replace(/^ /, '') : undefined;

  if (fileName.match(/.png$/)) {
    saveSvgAsPng.saveSvgAsPng(svg, fileName, {
      ...defaultConfig,
      selectorRemap,
      scale: 2,
    });
  } else {
    saveSvgAsPng.svgAsDataUri(svg, {
      ...defaultConfig,
      selectorRemap,
    }, uri => downloadUri(uri, fileName));
  }
}

export default downloadSvg;
