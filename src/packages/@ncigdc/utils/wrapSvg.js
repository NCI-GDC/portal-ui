// @flow
import { sum } from 'lodash';
import { insertRule } from 'glamor';
import 'innersvg-polyfill';

const EXPORT_CLASS = 'exported-svg-class';
insertRule(`
  .${EXPORT_CLASS} select {
    display: none;
  }
`);

insertRule(`
  .${EXPORT_CLASS} * {
    cursor: default !important;
  }
`);

insertRule(`
  .${EXPORT_CLASS} sub {
    display: inline-block;
    position: static;
  }
`);

type TMargin = {
  top?: number,
  right?: number,
  bottom?: number,
  left?: number,
};

type TEmbed = {
  elements?: Array<?Element>,
  styles?: string,
  margins?: TMargin,
  width?: number,
};

export type TWrapSvg = {
  title: string,
  selector: string,
  legends: string,
  className?: string,
  margins?: TMargin,
  embed?: {
    top?: TEmbed,
    right?: TEmbed,
    bottom?: TEmbed,
  },
};

const titleHeight = 20;

function buildForeignObject({
  elements = [],
  margins,
  width = 0,
  topOffset,
  styles = '',
}: {
  elements?: Array<?Element>,
  margins: TMargin,
  width?: number,
  topOffset: number,
  styles?: string,
}): { html: string, height: number } {
  const foreignObjects = elements.filter(Boolean);
  // $FlowIgnore
  const elementsHeight = sum(foreignObjects.map(e => (e.className === 'p-value' ? 25 : e.offsetHeight || 17)));

  return {
    height: elementsHeight,
    html: !foreignObjects.length
      ? ''
      : `
      <foreignObject
        x="${margins.left || 0}"
        y="${topOffset}"
        width="${width}"
        height="${elementsHeight}"
      >
        <div xmlns="http://www.w3.org/1999/xhtml">
          <div style="${styles}">
            ${foreignObjects
        .map(e => e.innerHTML)
        .join(`</div><div style="${styles}">`)}
          </div>
        </div>
      </foreignObject>
    `,
  };
}

const wrapSvg = ({
  selector,
  title,
  legends,
  margins = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  },
  className = '',
  embed = {},
  bottomBuffer = 0,
  rightBuffer = 0,
}: TWrapSvg): Element => {
  const svg = document.querySelector(selector);
  if (!svg) return svg;
  const viewBox = (svg.getAttribute('viewBox') || '').split(/\s+|,/);
  const {
    top: embedTop = {},
    right: embedRight = {},
    bottom: embedBottom = {},
  } = embed;
  const width = sum([
    parseInt(viewBox[2] || svg.getAttribute('width') || 0, 10),
    margins.left,
    margins.right,
    embedRight.width,
    (embedRight.margins || {}).left,
    (embedRight.margins || {}).right,
    rightBuffer,
  ]);

  const rightObject = buildForeignObject({
    ...embedRight,
    margins: {
      ...embedRight.margins,
      left: width - sum([embedRight.width, (embedRight.margins || {}).right]),
    },
    topOffset: titleHeight + margins.top,
  });

  const beforeObject = buildForeignObject({
    ...embedTop,
    margins,
    width: width - sum([margins.left, margins.right]),
    topOffset: titleHeight + margins.top,
  });

  const height = sum([
    parseInt(viewBox[3] || svg.getAttribute('height') || 0, 10),
    margins.top,
    margins.bottom,
    titleHeight,
    beforeObject.height,
    bottomBuffer,
  ]);

  const afterObject = buildForeignObject({
    ...embedBottom,
    margins,
    width: width - sum([margins.left, margins.right]),
    topOffset: height,
  });
  const svgClass = svg.getAttribute('class');

  const wrapper = document.createElement('div');
  const simpleForeign = (element, x, y, width, height) => `<foreignobject
      class="node"
      x=${x}
      y=${y}
      width=${width}
      height=${height}
    >
      ${element}
    </foreignobject>`;
  wrapper.innerHTML = `
    <svg
      width="${width}"
      height="${sum([

    height,
    afterObject.height,
    22,
  ])}"
      viewBox="0 0 ${width} ${sum([
    height,
    afterObject.height,
    22,
  ])}"
      style="font-size: 10px"
      class="${EXPORT_CLASS} ${svgClass || ''} ${className}"
    >
      <g transform="translate(0, ${margins.top || 0})">
        <text x="${width /
    2}" y="0" text-anchor="middle" dominant-baseline="hanging">
          <tspan style="font-size: 1.4rem; font-weight: 400; color: rgb(61,61,61);">${title}</tspan>
        </text>
      </g>
      ${beforeObject.html}
      ${rightObject.html}
      <g transform="translate(${margins.left || 0},${sum([
      titleHeight,
      margins.top,
      beforeObject.height,
    ])})">
        ${svg.innerHTML.replace(
      /url\(['"]?https?:\/\/[^#]+(#.+)['"]?\)/g,
      'url($1)',
    )}
      </g>
      ${afterObject.html}
      ${legends
      ? simpleForeign(
        legends,
        0,
        sum([height, afterObject.height]),
        '650',
        '22',
      )
      : ''}
    </svg>
  `;
  return wrapper.querySelector('svg');
};

export default wrapSvg;
