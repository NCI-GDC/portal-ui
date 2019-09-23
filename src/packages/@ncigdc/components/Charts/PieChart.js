// @flow

import * as d3 from 'd3';
import _ from 'lodash';
import ReactFauxDOM from 'react-faux-dom';
import { compose } from 'recompose';

import { withTooltip } from '@ncigdc/uikit/Tooltip';
import { withTheme } from '@ncigdc/theme';

const getNestedValue = (item, path) => {
  if (path.length === 1) {
    return item[path[0]];
  }

  const nextItem = item[path[0]];
  path.shift();

  return getNestedValue(nextItem, path);
};

const PieChart = compose(
  withTooltip,
  withTheme
)(
  ({
    data,
    enableInnerRadius = false,
    height = 160,
    mappingId = 'id',
    marginTop = 0,
    path = 'file_count',
    setTooltip,
    width = 160,
  }) => {
    const dataHasColors = data.every(datum => datum.color !== 'undefined' &&
      datum.color !== '');
    const color = d3.scaleOrdinal(d3.schemeCategory20);
    const outerRadius = height / 2 + 10;
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
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

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

    gPath.attr('d', arc).style('fill', (d, i) => dataHasColors
      ? data[i].color
      : color(i));

    const fillHover = gHoverPath
      .attr('d', arc)
      .style('fill', (d, i) => dataHasColors
        ? data[i].color
        : color(i))
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
  }
);

PieChart.propTypes = {
  data: PropTypes.array,
};

/*----------------------------------------------------------------------------*/

export default PieChart;
