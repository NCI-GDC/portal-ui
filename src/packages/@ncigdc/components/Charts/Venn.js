// @flow

import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
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
  var radius = 100;
  var factor = 0.6;
  var cy = 0.3 * config.height;
  var cx = 0.5 * config.width;

  const root = ReactFauxDOM.createElement('div');

  const svg = d3
    .select(root)
    .append(`svg`)
    .attr('width', config.width)
    .attr('height', config.height);

  const defs = svg.append('svg:defs');

  const angles = [300, 60, 180];

  data.forEach((d, i) => {
    defs
      .append('svg:clipPath')
      .attr('id', `circle${i + 1}`)
      .append('svg:circle')
      .attr('cx', cx + Math.sin(Math.PI * angles[i] / 180) * radius * factor)
      .attr('cy', cy - Math.cos(Math.PI * angles[i] / 180) * radius * factor)
      .attr('r', radius);

    defs
      .append('svg:clipPath')
      .attr('id', `circle${i + 1}_out`)
      .append('svg:circle')
      .attr('cx', cx + Math.sin(Math.PI * angles[i] / 180) * radius * factor)
      .attr('cy', cy - Math.cos(Math.PI * angles[i] / 180) * radius * factor)
      .attr('r', radius + config.outlineWidth);

    svg
      .append('svg:rect')
      .attr('clip-path', `url(#circle${i + 1}_out)`)
      .attr('width', config.width)
      .attr('height', config.height)
      .style('fill', config.outlineColour);

    svg
      .append('svg:rect')
      .datum({ selected: false, data: [d] })
      .attr('clip-path', `url(#circle${i + 1})`)
      .attr('class', 'inner')
      .attr('width', config.width)
      .attr('height', config.height)
      .style('fill', function() {
        return 'red';
      });

    let inner = svg.append('svg:g').attr('clip-path', `url(#circle${i + 1})`);

    if (!i) {
      inner
        .append('svg:rect')
        .attr('class', 'inner')
        .attr('clip-path', `url(#circle${i + 1})`)
        .attr('width', config.width)
        .attr('height', config.height)
        .style('fill', function() {
          return 'purple';
        });
    }
  });

  // 2 intersections
  // svg
  //   .append('svg:g')
  //   .attr('clip-path', 'url(#circle1_out)')
  //   .append('svg:rect')
  //   .attr('clip-path', 'url(#circle2_out)')
  //   .attr('width', config.width)
  //   .attr('height', config.height)
  //   .style('fill', config.outlineColour);

  svg
    .append('svg:g')
    .attr('clip-path', 'url(#circle1)')
    .append('svg:rect')
    .datum({ selected: false, data: ['test', 'foo'] })
    .attr('class', 'inner')
    .attr('clip-path', 'url(#circle2)')
    .attr('width', config.width)
    .attr('height', config.height)
    .style('fill', function() {
      return 'green';
    });

  // svg
  //   .append('svg:g')
  //   .attr('clip-path', 'url(#circle2_out)')
  //   .append('svg:rect')
  //   .attr('clip-path', 'url(#circle3_out)')
  //   .attr('width', config.width)
  //   .attr('height', config.height)
  //   .style('fill', config.outlineColour);

  svg
    .append('svg:g')
    .attr('clip-path', 'url(#circle2)')
    .append('svg:rect')
    .attr('class', 'inner')
    .attr('clip-path', 'url(#circle3)')
    .attr('width', config.width)
    .attr('height', config.height)
    .style('fill', function() {
      return 'green';
    });

  // svg
  //   .append('svg:g')
  //   .attr('clip-path', 'url(#circle3_out)')
  //   .append('svg:rect')
  //   .attr('clip-path', 'url(#circle1_out)')
  //   .attr('width', config.width)
  //   .attr('height', config.height)
  //   .style('fill', config.outlineColour);

  svg
    .append('svg:g')
    .attr('clip-path', 'url(#circle3)')
    .append('svg:rect')
    .attr('class', 'inner')
    .attr('clip-path', 'url(#circle1)')
    .attr('width', config.width)
    .attr('height', config.height)
    .style('fill', function() {
      return 'green';
    });

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
