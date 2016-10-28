// Vendor
import { PropTypes } from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';

/*----------------------------------------------------------------------------*/
import theme from '../theme';

const getNestedValue = (item, path) => {
  if (path.length === 1) {
    return item[path[0]];
  }

  const nextItem = item[path[0]];
  path.shift();

  return getNestedValue(nextItem, path);
};

const PieChart = ({ data, path = 'file_count', tooltipKey, height = 160, width = 160 }) => {
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  const outerRadius = height / 2 + 10;

  const node = ReactFauxDOM.createElement('div');
  node.style.setProperty('display', 'flex');
  node.style.setProperty('justify-content', 'center');

  const pie = d3.pie()
    // .sort(null)
    .value(d => getNestedValue(d, path.split('.')));

  const arc = d3.arc()
    .padRadius(outerRadius)
    .innerRadius(0);

  const svg = d3.select(node).append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

  const g = svg.selectAll('.arc')
    .data(pie(data))
    .enter()
    .append('g')
    .each(d => { d.outerRadius = outerRadius - 20 }) // eslint-disable-line
    .attr('class', 'arc');

  const gPath = g.append('path');

  gPath.attr('d', arc)
    .style('fill', (d, i) => color(i));

  const tip = g.append('g')
      .attr('class', 'arc-tooltip');

    const tipHeight = 25;
    const tipWidth = 120;
    const getTipY = (d) => 0;
    const getTipX = (d) => 0;
    tip.append('rect')
      .attr('fill', '#fff')
      .attr('stroke', theme.greyScale4)
      .attr('width', tipWidth)
      .attr('height', tipHeight)
      .attr('rx', 5)
      .attr('ry', 5)
      .attr("y", (d) => getTipY(d))
      .attr("x", (d) => getTipX(d));

    tip.append('text')
      .attr("y", (d) =>  getTipY(d))
      .attr("x", (d) => getTipX(d) + 5)
      .attr("dy", "1.2em")
      .style("text-anchor", "start")
      .attr("font-size", "1em")
      .attr('fill', theme.greyScale3)
      .text(d => d.data[tooltipKey]);

  return node.toReact();
};

PieChart.propTypes = {
  data: PropTypes.array,
};

/*----------------------------------------------------------------------------*/

export default PieChart;
