// @flow

import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import _ from 'lodash';
import { compose, setDisplayName } from 'recompose';
import { withTooltip } from '@ncigdc/uikit/Tooltip';

const colors = ['rgb(141, 199, 217)', 'rgb(98, 175, 199)', 'rgb(52, 132, 157)'];

export default compose(
  setDisplayName('Venn'),
  withTooltip,
)(
  ({
    data,
    width = 500,
    height = 500,
    margin = 5,
    paddingTop = 10,
    paddingBottom = 10,
    paddingLeft = 10,
    paddingRight = 10,
    outlineColour = '#999',
    outlineWidth = 1.5,
    selectColour = '#A4DEF4',
    hoverColour = '#daf2fb',
    radius = 100,
    factor = 0.6,
    getFillColor = _ => {},
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
    const getAngle = i => angle * i + 90 % 360;

    // circle clip paths

    data.forEach((d, i) =>
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
        .attr('r', radius),
    );

    // outside circles 1 : 1

    data.forEach((d, i) =>
      svg
        .append('svg:rect')
        .attr('clip-path', `url(#circle_${i})`)
        .attr('class', 'inner')
        .attr('width', width)
        .attr('height', height)
        .style('fill', d => getFillColor(d) || colors[0]),
    );

    data.forEach((d, i) =>
      svg
        .append('svg:g')
        .attr('clip-path', `url(#circle_${i})`)
        .append('svg:rect')
        .attr('class', 'inner')
        .attr('clip-path', `url(#circle_${(i + 1) % data.length})`)
        .attr('width', width)
        .attr('height', height)
        .style('fill', d => getFillColor(d) || colors[1]),
    );

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
      .style('fill', d => getFillColor(d) || colors[2]);

    // 2 intersections
    // svg
    //   .append('svg:g')
    //   .attr('clip-path', 'url(#circle1_out)')
    //   .append('svg:rect')
    //   .attr('clip-path', 'url(#circle2_out)')
    //   .attr('width', width)
    //   .attr('height', height)
    //   .style('fill', outlineColour);

    // svg
    //   .append('svg:g')
    //   .attr('clip-path', 'url(#circle2_out)')
    //   .append('svg:rect')
    //   .attr('clip-path', 'url(#circle3_out)')
    //   .attr('width', width)
    //   .attr('height', height)
    //   .style('fill', outlineColour);

    // svg
    //   .append('svg:g')
    //   .attr('clip-path', 'url(#circle3_out)')
    //   .append('svg:rect')
    //   .attr('clip-path', 'url(#circle1_out)')
    //   .attr('width', width)
    //   .attr('height', height)
    //   .style('fill', outlineColour);

    // 3 intersections
    // svg
    //   .append('svg:g')
    //   .attr('clip-path', 'url(#circle3_out)')
    //   .append('svg:g')
    //   .attr('clip-path', 'url(#circle2_out)')
    //   .append('svg:rect')
    //   .attr('clip-path', 'url(#circle1_out)')
    //   .attr('width', width)
    //   .attr('height', height)
    //   .style('fill', outlineColour);

    return root.toReact();
  },
);
