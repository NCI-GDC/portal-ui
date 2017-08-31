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

export default compose(
  setDisplayName('Venn'),
  withTooltip,
)(
  ({
    data = [],
    ops = [],
    width = 500,
    height = ops.length === 3 ? 280 : 350,
    margin = 5,
    paddingTop = 10,
    paddingBottom = 10,
    paddingLeft = 10,
    paddingRight = 10,
    outlineColour = '#999',
    outlineWidth = 1.5,
    selectColour = '#A4DEF4',
    hoverColour = '#daf2fb',
    radius = 85,
    factor = 0.6,
    getFillColor = (x, µ) => {},
    onClick = _ => {},
    onMouseOver = _ => {},
    onMouseOut = _ => {},
  }) => {
    const cy = 0.3 * height;
    const cx = 0.5 * width;

    const root = ReactFauxDOM.createElement('div');

    const svg = d3
      .select(root)
      .append(`svg`)
      .attr('width', width)
      .attr('height', height);

    const defs = svg.append('svg:defs');

    const angle = 360 / data.length;
    const getAngle = i => angle * i - (ops.length === 3 ? 90 : 60) % 360;

    // circle clip paths

    data.forEach((d, i) => {
      defs
        .append('svg:clipPath')
        .attr('id', `circle_${i}`)
        .append('svg:circle')
        .attr(
          'cx',
          cx + Math.sin(Math.PI * getAngle(i) / 180) * radius * factor,
        )
        .attr(
          'cy',
          cy - Math.cos(Math.PI * getAngle(i) / 180) * radius * factor + radius,
        )
        .attr('r', radius);

      defs
        .append('svg:clipPath')
        .attr('id', `circle_${i}_outline`)
        .append('svg:circle')
        .attr(
          'cx',
          cx + Math.sin(Math.PI * getAngle(i) / 180) * radius * factor,
        )
        .attr(
          'cy',
          cy - Math.cos(Math.PI * getAngle(i) / 180) * radius * factor + radius,
        )
        .attr('r', radius + outlineWidth);
    });

    if (ops.length === 3) {
      ops
        .slice(1)
        .forEach((d, i) =>
          svg
            .append('svg:rect')
            .attr('clip-path', `url(#circle_${i}_outline)`)
            .attr('class', 'inner')
            .attr('width', width)
            .attr('height', height)
            .style('fill', outlineColour),
        );

      ops
        .slice(1)
        .forEach((d, i) =>
          svg
            .append('svg:rect')
            .attr('clip-path', `url(#circle_${i})`)
            .attr('class', 'inner')
            .attr('width', width)
            .attr('height', height)
            .style('cursor', 'pointer')
            .style('fill', () => getFillColor(d, 0) || colors[0])
            .on('click', () => onClick(d.op))
            .on('mouseover', () => onMouseOver(d.op))
            .on('mouseout', onMouseOut),
        );
    }

    if (ops.length > 3) {
      ops
        .slice(4)
        .forEach((d, i) =>
          svg
            .append('svg:rect')
            .attr('clip-path', `url(#circle_${i}_outline)`)
            .attr('class', 'inner')
            .attr('width', width)
            .attr('height', height)
            .style('fill', outlineColour),
        );

      ops
        .slice(4)
        .forEach((d, i) =>
          svg
            .append('svg:rect')
            .attr('clip-path', `url(#circle_${i})`)
            .attr('class', 'inner')
            .attr('width', width)
            .attr('height', height)
            .style('cursor', 'pointer')
            .style('fill', () => getFillColor(d, 0) || colors[0])
            .on('click', () => onClick(d.op))
            .on('mouseover', () => onMouseOver(d.op))
            .on('mouseout', onMouseOut),
        );

      ops
        .slice(1, 4)
        .forEach((d, i) =>
          svg
            .append('svg:g')
            .attr('clip-path', `url(#circle_${i}_outline)`)
            .append('svg:rect')
            .attr('clip-path', `url(#circle_${(i + 1) % data.length}_outline)`)
            .attr('width', width)
            .attr('height', height)
            .style('fill', outlineColour),
        );

      ops
        .slice(1, 4)
        .forEach((d, i) =>
          svg
            .append('svg:g')
            .attr('clip-path', `url(#circle_${i})`)
            .append('svg:rect')
            .attr('class', 'inner')
            .attr('clip-path', `url(#circle_${(i + 1) % data.length})`)
            .attr('width', width)
            .attr('height', height)
            .style('cursor', 'pointer')
            .style('fill', () => getFillColor(d, 1) || colors[1])
            .style('stroke', 'black')
            .style('stroke-width', 2)
            .on('click', () => onClick(d.op))
            .on('mouseover', () => onMouseOver(d.op))
            .on('mouseout', onMouseOut),
        );
    }

    let innerOutline = svg
      .append('svg:g')
      .attr('clip-path', `url(#circle_${data.length - 1}_outline)`);

    _.range(data.length - 1, 0).forEach(
      x =>
        (innerOutline = innerOutline
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
      .attr('clip-path', `url(#circle_${data.length - 1})`);

    _.range(data.length - 1, 0).forEach(
      x =>
        (inner = inner.append('svg:g').attr('clip-path', `url(#circle_${x})`)),
    );

    inner
      .append('svg:rect')
      .attr('class', 'inner')
      .attr('clip-path', `url(#circle_${0})`)
      .attr('width', width)
      .attr('height', height)
      .style('cursor', 'pointer')
      .style('fill', () => getFillColor(ops[0], 2) || colors[2])
      .on('click', () => onClick(ops[0].op))
      .on('mouseover', () => onMouseOver(ops[0].op))
      .on('mouseout', onMouseOut);

    return root.toReact();
  },
);
