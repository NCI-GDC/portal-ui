// @flow

import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import _ from 'lodash';
import { compose, setDisplayName } from 'recompose';
import { withTooltip } from '@ncigdc/uikit/Tooltip';

const config = {
  width: 500,
  height: 500,
  margin: 5,
  paddingTop: 10,
  paddingBottom: 10,
  paddingLeft: 10,
  paddingRight: 10,
  outlineColour: '#999',
  outlineWidth: 1.5,
  selectColour: '#A4DEF4',
  hoverColour: '#daf2fb',
  radius: 100,
  factor: 0.6,
};

export default compose(setDisplayName('Venn'), withTooltip)(({ data }) => {
  const radius = 100;
  const factor = 0.6;
  const cy = 0.3 * config.height;
  const cx = 0.5 * config.width;

  const root = ReactFauxDOM.createElement('div');

  const svg = d3
    .select(root)
    .append(`svg`)
    .attr('width', config.width)
    .attr('height', config.height);

  const defs = svg.append('svg:defs');

  const angle = 360 / data.length;
  const getAngle = i => angle * i % 360;

  // circle clip paths

  data.forEach((d, i) =>
    defs
      .append('svg:clipPath')
      .attr('id', `circle_${i}`)
      .append('svg:circle')
      .attr('cx', cx + Math.sin(Math.PI * getAngle(i) / 180) * radius * factor)
      .attr('cy', cy - Math.cos(Math.PI * getAngle(i) / 180) * radius * factor)
      .attr('r', radius),
  );

  // outside circles 1 : 1

  data.forEach((d, i) =>
    svg
      .append('svg:rect')
      .attr('clip-path', `url(#circle_${i})`)
      .attr('class', 'inner')
      .attr('width', config.width)
      .attr('height', config.height)
      .style('fill', 'rgb(96, 78, 115)'),
  );

  data.forEach((d, i) =>
    svg
      .append('svg:g')
      .attr('clip-path', `url(#circle_${i})`)
      .append('svg:rect')
      .attr('class', 'inner')
      .attr('clip-path', `url(#circle_${(i + 1) % data.length})`)
      .attr('width', config.width)
      .attr('height', config.height)
      .style('fill', 'green'),
  );

  let inner = svg
    .append('svg:g')
    .attr('clip-path', `url(#circle_${data.length - 1})`);

  _.range(data.length - 1, 0).forEach(
    x => (inner = inner.append('svg:g').attr('clip-path', `url(#circle_${x})`)),
  );

  inner
    .append('svg:rect')
    .attr('class', 'inner')
    .attr('clip-path', `url(#circle_${0})`)
    .attr('width', config.width)
    .attr('height', config.height)
    .style('fill', 'yellow');

  // 2 intersections
  // svg
  //   .append('svg:g')
  //   .attr('clip-path', 'url(#circle1_out)')
  //   .append('svg:rect')
  //   .attr('clip-path', 'url(#circle2_out)')
  //   .attr('width', config.width)
  //   .attr('height', config.height)
  //   .style('fill', config.outlineColour);

  // svg
  //   .append('svg:g')
  //   .attr('clip-path', 'url(#circle2_out)')
  //   .append('svg:rect')
  //   .attr('clip-path', 'url(#circle3_out)')
  //   .attr('width', config.width)
  //   .attr('height', config.height)
  //   .style('fill', config.outlineColour);

  // svg
  //   .append('svg:g')
  //   .attr('clip-path', 'url(#circle3_out)')
  //   .append('svg:rect')
  //   .attr('clip-path', 'url(#circle1_out)')
  //   .attr('width', config.width)
  //   .attr('height', config.height)
  //   .style('fill', config.outlineColour);

  // 3 intersections
  // svg
  //   .append('svg:g')
  //   .attr('clip-path', 'url(#circle3_out)')
  //   .append('svg:g')
  //   .attr('clip-path', 'url(#circle2_out)')
  //   .append('svg:rect')
  //   .attr('clip-path', 'url(#circle1_out)')
  //   .attr('width', config.width)
  //   .attr('height', config.height)
  //   .style('fill', config.outlineColour);

  return root.toReact();
});
