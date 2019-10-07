// @flow

import * as d3 from 'd3';
import _ from 'lodash';
import ReactFauxDOM from 'react-faux-dom';
import { compose, pure } from 'recompose';

import { withTooltip } from '@ncigdc/uikit/Tooltip';
import { withTheme } from '@ncigdc/theme';
import withSize from '@ncigdc/utils/withSize';

const getNestedValue = (item, path) => {
  if (path.length === 1) {
    return item[path[0]];
  }

  const nextItem = item[path[0]];
  path.shift();

  return getNestedValue(nextItem, path);
};

const downloadMessage = 'Please download the TSV to view data for this chart.';

const PieChart = ({
  data,
  diameter = 160, // if the pie chart is responsive, this is the MAX diameter
  enableInnerRadius = false,
  isResponsive = false,
  mappingId = 'id',
  marginTop = 0,
  path = 'file_count',
  setTooltip,
  size: { width: responsiveDiameter },
}) => {
  const dataHasColors = data.every(datum =>
    typeof datum.color !== 'undefined' && datum.color !== '');
  const color = d3.scaleOrdinal(d3.schemeCategory20);
  const getSliceColor = i => (dataHasColors
    ? data[i].color
    : color(i));

  const pieDiameter = isResponsive && responsiveDiameter < diameter
    ? responsiveDiameter
    : diameter;
  const radius = pieDiameter / 2;
  const outerRadius = radius + 10;
  const innerRadius = enableInnerRadius ? outerRadius / 2 : 0;

  const node = ReactFauxDOM.createElement('div');
  node.style.setProperty('margin-top', `${marginTop}px`);
  node.style.setProperty('display', 'flex');
  node.style.setProperty('justify-content', 'center');
  node.setAttribute('class', 'test-pie-chart');

  const pie = d3.pie().value(d => getNestedValue(d, path.split('.')));

  const arc = d3
    .arc()
    .padRadius(outerRadius)
    .innerRadius(innerRadius);

  const svg = d3
    .select(node)
    .append('svg')
    .attr('width', pieDiameter)
    .attr('height', pieDiameter)
    .append('g')
    .attr('transform', `translate(${radius}, ${radius})`);

  svg
    .append('text')
    .attr('class', 'svgDownload')
    .attr('y', radius + 20)
    .style('text-anchor', 'middle')
    .text(downloadMessage);

  const g = svg
    .selectAll('.arc')
    .data(pie(data))
    .enter()
    .append('g')
    .each(d => {
      d.outerRadius = outerRadius - 20;
    })
    .attr('class', 'arc');

  const gHover = svg
    .selectAll('.arc-hover')
    .data(pie(data))
    .enter()
    .append('g')
    .each(d => {
      d.outerRadius = outerRadius - 15;
    })
    .attr('class', 'arc-hover');

  const gPath = g.append('path');
  const gHoverPath = gHover.append('path');

  gPath.attr('d', arc).style('fill', (d, i) => getSliceColor(i));

  const fillHover = gHoverPath
    .attr('d', arc)
    .style('fill', (d, i) => getSliceColor(i))
    .style('opacity', 0);

  fillHover
    .attr('class', d => `pointer arc-hover-${_.snakeCase(d.data[mappingId])}`)
    .on('mouseenter', d => {
      document.querySelector(
        `.arc-hover-${_.snakeCase(d.data[mappingId])}`
      ).style.opacity = 0.5;
      setTooltip(d.data.tooltip);
    })
    .on('mouseleave', d => {
      document.querySelector(
        `.arc-hover-${_.snakeCase(d.data[mappingId])}`
      ).style.opacity = 0;
      setTooltip();
    })
    .on('mousedown', d => {
      if (d.data.clickHandler) {
        d.data.clickHandler(d);
        setTooltip();
      }
    });

  return node.toReact();
};

/*----------------------------------------------------------------------------*/

export default compose(
  withTheme,
  withTooltip,
  withSize({ refreshRate: 16 }),
  pure,
)(PieChart);
