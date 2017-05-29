// @flow
import { sum } from "lodash";
import { insertRule } from "glamor";
import "innersvg-polyfill";

const EXPORT_CLASS = "exported-svg-class";
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
  left?: number
};

type TEmbed = {
  elements?: Array<?Element>,
  styles?: string,
  margins?: TMargin,
  width?: number
};

export type TWrapSvg = ({
  title: string,
  selector: string,
  className?: string,
  margins?: TMargin,
  embed?: {
    top?: TEmbed,
    right?: TEmbed,
    bottom?: TEmbed
  }
}) => ?Element;

const titleHeight = 20;

function buildForeignObject({
  elements = [],
  margins,
  width = 0,
  topOffset,
  styles = ""
}: {
  elements?: Array<?Element>,
  margins: TMargin,
  width?: number,
  topOffset: number,
  styles?: string
}): { html: string, height: number } {
  const foreignObjects = elements.filter(Boolean);
  // $FlowIgnore
  const elementsHeight = sum(foreignObjects.map(e => e.offsetHeight));

  return {
    height: elementsHeight,
    html: !foreignObjects.length
      ? ""
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
    `
  };
}

export const wrapSvg: TWrapSvg = ({
  selector,
  title,
  margins = { top: 20, right: 20, bottom: 20, left: 20 },
  className = "",
  embed = {}
}) => {
  const svg = document.querySelector(selector);
  if (!svg) return svg;
  const viewBox = (svg.getAttribute("viewBox") || "").split(/\s+|,/);
  const {
    top: embedTop = {},
    right: embedRight = {},
    bottom: embedBottom = {}
  } = embed;
  const width = sum([
    parseInt(viewBox[2] || svg.getAttribute("width") || 0, 10),
    margins.left,
    margins.right,
    embedRight.width,
    (embedRight.margins || {}).left,
    (embedRight.margins || {}).right
  ]);

  const rightObject = buildForeignObject({
    ...embedRight,
    margins: {
      ...embedRight.margins,
      left: width - sum([embedRight.width, (embedRight.margins || {}).right])
    },
    topOffset: titleHeight + margins.top
  });

  const beforeObject = buildForeignObject({
    ...embedTop,
    margins,
    width: width - sum([margins.left, margins.right]),
    topOffset: titleHeight + margins.top
  });

  const height = sum([
    parseInt(viewBox[3] || svg.getAttribute("height") || 0, 10),
    margins.top,
    margins.bottom,
    titleHeight,
    beforeObject.height
  ]);

  const afterObject = buildForeignObject({
    ...embedBottom,
    margins,
    width: width - sum([margins.left, margins.right]),
    topOffset: height
  });

  const svgClass = svg.getAttribute("class");

  const wrapper = document.createElement("div");

  // eslint-disable-next-line fp/no-mutation
  wrapper.innerHTML = `
    <svg
      width="${width}"
      height="${sum([height, afterObject.height])}"
      viewBox="0 0 ${width} ${sum([height, afterObject.height])}"
      style="font-size: 10px"
      class="${EXPORT_CLASS} ${svgClass || ""} ${className}"
    >
      <g transform="translate(0, ${margins.top || 0})">
        <text x="${width / 2}" y="0" text-anchor="middle" dominant-baseline="hanging">
          <tspan style="font-size: 1.4rem;">${title}</tspan>
        </text>
      </g>
      ${beforeObject.html}
      ${rightObject.html}
      <g transform="translate(${margins.left || 0},${sum([
    titleHeight,
    margins.top,
    beforeObject.height
  ])})">
        ${svg.innerHTML}
      </g>
      ${afterObject.html}
    </svg>
  `;
  return wrapper.querySelector("svg");
};

export default wrapSvg;
