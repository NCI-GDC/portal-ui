import PropTypes from 'prop-types';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import Color from 'color';
import { snakeCase } from 'lodash';
import { compose } from 'recompose';

import { withTooltip } from '@ncigdc/uikit/Tooltip';
import withSize from '@ncigdc/utils/withSize';

const MAX_DIAMETER = 260;

const downloadMessage = 'To view data for this chart, download the separate TSV file';

const DoubleRingChart = ({
  data = [],
  margin = 50,
  maxDiameter = MAX_DIAMETER,
  outerRingWidth = 30,
  setTooltip,
  size: { height, width },
}) => {
  const diameter = Math.max(Math.min(width, height - (margin * 2)), maxDiameter);
  const centerRingDiameter = diameter - outerRingWidth * 2;
  const centerRadius = centerRingDiameter / 2;
  const radius = diameter / 2;

  const node = ReactFauxDOM.createElement('div');
  node.style.setProperty('display', 'flex');
  node.style.setProperty('justify-content', 'center');
  node.setAttribute('class', 'test-double-ring-chart');

  const svg = d3
    .select(node)
    .append('svg')
    .attr('width', diameter)
    .attr('height', diameter)
    .attr('border', 1)
    .append('g')
    .attr('transform', `translate(${radius}, ${radius})`);

  const innerPieData = data.map(({
    clickHandler,
    color,
    id,
    key,
    tooltip,
    value,
  }) => ({
    clickHandler,
    color,
    id,
    innerRadius: diameter / 3.8,
    key,
    outerRadius: centerRadius - 1.5,
    tooltip,
    v: value,
  }));

  const innerPie = d3
    .pie()
    .value(d => d.v)(innerPieData);

  const outerPieData = data.map(d => ({
    innerRadius: centerRadius,
    items: d.outer.map(({
      clickHandler,
      color,
      id,
      key,
      tooltip,
      value,
    }) => ({
      clickHandler,
      color,
      id,
      key,
      tooltip,
      v: value,
    })),
    outerRadius: radius,
  }));

  const outerPie = outerPieData.map((p, i) => d3
    .pie()
    .startAngle(innerPie[i].startAngle)
    .endAngle(innerPie[i].endAngle)(p.items.map(item => item.v)),);

  const dataWithPie = [
    innerPieData.map((p, i) => ({
      ...p,
      pie: innerPie[i],
    })),
    outerPieData.reduce(
      (acc, p, i) => [
        ...acc,
        ...p.items.map((item, j) => ({
          ...p,
          clickHandler: item.clickHandler,
          color: item.color,
          id: item.id,
          key: item.key,
          pie: outerPie[i][j],
          tooltip: item.tooltip,
          v: item.v,
        })),
      ],
      [],
    ),
  ];

  const g = svg
    .selectAll('.g')
    .data(dataWithPie)
    .enter()
    .append('g');

  svg
    .append('text')
    .attr('class', 'svgDownload')
    .attr('y', radius + 20)
    .style('text-anchor', 'middle')
    .text(downloadMessage);

  const fill = g
    .selectAll('path')
    .data(d => d)
    .enter()
    .append('path')
    .attr('d', d => d3
      .arc()
      .cornerRadius(1.6)
      .outerRadius(d.outerRadius)
      .innerRadius(d.innerRadius)(d.pie),)
    .attr('stroke', '#fff')
    .attr('stroke-width', 0.5)
    .style('fill', d => d.color);

  fill
    .attr('class', d => `arc-hover-${snakeCase(d.id)}`)
    .on('mouseenter', d => {
      const target = document.querySelector(`.arc-hover-${snakeCase(d.id)}`);
      target.style.fill = Color(d.color).darken(0.4).rgbString();
      setTooltip(d.tooltip);
    })
    .on('mouseleave', d => {
      const target = document.querySelector(`.arc-hover-${snakeCase(d.id)}`);
      target.style.fill = d.color;
      setTooltip();
    })
    .on('mousedown', d => {
      d.clickHandler && d.clickHandler();
    });

  return node.toReact();
};

DoubleRingChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      clickHandler: PropTypes.func,
      key: PropTypes.string,
      outer: PropTypes.arrayOf(
        PropTypes.shape({
          clickHandler: PropTypes.func,
          key: PropTypes.string,
          value: PropTypes.number,
        }),
      ),
      tooltip: PropTypes.object,
      value: PropTypes.number,
    }),
  ),
  height: PropTypes.number,
  outerRingWidth: PropTypes.number,
  width: PropTypes.number,
};

/*----------------------------------------------------------------------------*/

export default compose(
  withTooltip,
  withSize({ monitorHeight: true }),
)(DoubleRingChart);
