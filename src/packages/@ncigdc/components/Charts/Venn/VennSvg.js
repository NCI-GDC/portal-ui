// @flow

import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import _ from 'lodash';
import { compose, setDisplayName } from 'recompose';
import { withTooltip } from '@ncigdc/uikit/Tooltip';

const colors = [
  'rgb(220, 238, 244)',
  'rgb(195, 232, 244)',
  'rgb(165, 218, 235)',
];

const RADIUS = 85;
const FACTOR = 0.6;

export default compose(
  setDisplayName('Venn'),
  withTooltip,
)(
  ({
    ops = [],
    numCircles,
    outlineColour = '#999',
    getFillColor = _.noop,
    onMouseOver = _.noop,
    onMouseOut = _.noop,
    style = {},
    ...props
  }) => {
    const margin = 1;
    if (numCircles === 2 && ops.length !== 3) {
      console.warn(`expected 3 operations, received ${ops.length}`);
    } else if (numCircles === 3 && ops.length !== 7) {
      console.warn(`expected 7 operations, received ${ops.length}`);
    }

    const outerRadius = RADIUS + 1.5;
    const angle = 360 / numCircles;
    const getAngle = i => angle * i - (numCircles === 2 ? 90 : 60) % 360;

    const offsets = Array(numCircles)
      .fill()
      .map((d, i) => {
        const angle = Math.PI * getAngle(i) / 180;

        return {
          x: Math.sin(angle) * RADIUS * FACTOR,
          y: Math.cos(angle) * RADIUS * FACTOR,
        };
      });

    const height =
      Math.abs(offsets[0].y - offsets[offsets.length - 1].y) +
      (margin + outerRadius) * 2;

    const width =
      Math.abs(offsets[0].x - offsets[1].x) + (margin + outerRadius) * 2;

    const onClick = props.onClick || _.noop;
    const cursor = props.onClick ? 'pointer' : 'default';

    const cy = (numCircles === 2 ? 0.5 : 0.45) * height;
    const cx = 0.5 * width;

    const root = ReactFauxDOM.createElement('div');

    const svg = d3
      .select(root)
      .append('svg')
      .style('display', 'block')
      .attr('viewBox', `0 0 ${width} ${height}`);

    // fix weird flex error in CreateAnalysis
    if (style.width) svg.attr('width', style.width);

    const defs = svg.append('svg:defs');

    // circle clip paths
    offsets.forEach((offset, i) => {
      defs
        .append('svg:clipPath')
        .attr('id', `circle_${i}`)
        .append('svg:circle')
        .attr('cx', cx + offset.x)
        .attr('cy', cy - offset.y)
        .attr('r', RADIUS);

      defs
        .append('svg:clipPath')
        .attr('id', `circle_${i}_outline`)
        .append('svg:circle')
        .attr('cx', cx + offset.x)
        .attr('cy', cy - offset.y)
        .attr('r', outerRadius);
    });

    if (numCircles === 2) {
      ops.slice(1).forEach((d, i) => svg
        .append('svg:rect')
        .attr('clip-path', `url(#circle_${i}_outline)`)
        .attr('class', 'inner')
        .attr('width', width)
        .attr('height', height)
        .style('fill', outlineColour),);

      ops.slice(1).forEach((d, i) => svg
        .append('svg:rect')
        .attr('clip-path', `url(#circle_${i})`)
        .attr('class', 'inner')
        .attr('width', width)
        .attr('height', height)
        .style('cursor', cursor)
        .style('fill', () => getFillColor(d, 0) || colors[0])
        .on('click', () => onClick(d.op))
        .on('mouseover', () => onMouseOver(d.op))
        .on('mouseout', onMouseOut),);
    } else {
      ops.slice(4).forEach((d, i) => svg
        .append('svg:rect')
        .attr('clip-path', `url(#circle_${i}_outline)`)
        .attr('class', 'inner')
        .attr('width', width)
        .attr('height', height)
        .style('fill', outlineColour),);

      ops.slice(4).forEach((d, i) => svg
        .append('svg:rect')
        .attr('clip-path', `url(#circle_${i})`)
        .attr('class', 'inner')
        .attr('width', width)
        .attr('height', height)
        .style('cursor', cursor)
        .style('fill', () => getFillColor(d, 0) || colors[0])
        .on('click', () => onClick(d.op))
        .on('mouseover', () => onMouseOver(d.op))
        .on('mouseout', onMouseOut),);

      ops.slice(1, 4).forEach((d, i) => svg
        .append('svg:g')
        .attr('clip-path', `url(#circle_${i}_outline)`)
        .append('svg:rect')
        .attr('clip-path', `url(#circle_${(i + 1) % numCircles}_outline)`)
        .attr('width', width)
        .attr('height', height)
        .style('fill', outlineColour),);

      ops.slice(1, 4).forEach((d, i) => svg
        .append('svg:g')
        .attr('clip-path', `url(#circle_${i})`)
        .append('svg:rect')
        .attr('class', 'inner')
        .attr('clip-path', `url(#circle_${(i + 1) % numCircles})`)
        .attr('width', width)
        .attr('height', height)
        .style('cursor', cursor)
        .style('fill', () => getFillColor(d, 1) || colors[1])
        .style('stroke', 'black')
        .style('stroke-width', 2)
        .on('click', () => onClick(d.op))
        .on('mouseover', () => onMouseOver(d.op))
        .on('mouseout', onMouseOut),);
    }

    let innerOutline = svg
      .append('svg:g')
      .attr('clip-path', `url(#circle_${numCircles - 1}_outline)`);

    _.range(numCircles - 1, 0).forEach(
      x => (innerOutline = innerOutline
        .append('svg:g')
        .attr('clip-path', `url(#circle_${x}_outline)`)),
    );

    innerOutline
      .append('svg:rect')
      .attr('clip-path', 'url(#circle_0_outline)')
      .attr('width', width)
      .attr('height', height)
      .style('fill', outlineColour);

    let inner = svg
      .append('svg:g')
      .attr('clip-path', `url(#circle_${numCircles - 1})`);

    _.range(numCircles - 1, 0).forEach(
      x => (inner = inner.append('svg:g').attr('clip-path', `url(#circle_${x})`)),
    );

    inner
      .append('svg:rect')
      .attr('class', 'inner')
      .attr('clip-path', `url(#circle_${0})`)
      .attr('width', width)
      .attr('height', height)
      .style('cursor', cursor)
      .style('fill', () => getFillColor(ops[0], 2) || colors[2])
      .on('click', () => onClick(ops[0].op))
      .on('mouseover', () => onMouseOver(ops[0].op))
      .on('mouseout', onMouseOut);

    return root.toReact();
  },
);
