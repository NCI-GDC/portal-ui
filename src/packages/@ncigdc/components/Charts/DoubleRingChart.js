import PropTypes from 'prop-types';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import Color from 'color';
import { snakeCase } from 'lodash';
import { compose } from 'recompose';

import { withTooltip } from '@ncigdc/uikit/Tooltip';
import withSize from '@ncigdc/utils/withSize';

const DoubleRingChart = ({
  data = [],
  margin = {
    bottom: 50,
    left: 50,
    right: 50,
    top: 50,
  },
  outerRingWidth = 30,
  setTooltip,
  size: { width },
}) => {
  const chartWidth = width - margin.left - margin.right;
  const height = chartWidth;
  const centerRingWidth = chartWidth - outerRingWidth * 2;
  const centerRingHeight = height - outerRingWidth * 2;
  const centerRadius = Math.min(centerRingWidth, centerRingHeight) / 2;
  const radius = Math.min(chartWidth, height) / 2;

  const node = ReactFauxDOM.createElement('div');
  node.style.setProperty('display', 'flex');
  node.style.setProperty('justify-content', 'center');
  node.setAttribute('class', 'test-double-ring-chart');

  const svg = d3
    .select(node)
    .append('svg')
    .attr('width', chartWidth)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${chartWidth / 2}, ${height / 2})`);

  // const HALF_DEGREE_IN_RAD = 0.00872665;
  // const HALF_OF_HALF_DEGREE_IN_RAD = 0.004363325;

  const innerPieData = data.map(d => ({
    clickHandler: d.clickHandler,
    color: d.color,
    id: d.id,
    innerRadius: chartWidth / 3.3,
    key: d.key,
    // innerRadius: 0,
    // outerRadius: centerRadius - 5,
    outerRadius: centerRadius - 1.5,
    tooltip: d.tooltip,
    v: d.value,
  }));

  const innerPie = d3
    .pie()
    // .padAngle(HALF_OF_HALF_DEGREE_IN_RAD * 1.2)
    // .padAngle(HALF_DEGREE_IN_RAD)
    .value(d => d.v)(innerPieData);

  const outerPieData = data.map(d => ({
    innerRadius: centerRadius,
    items: d.outer.map(p => ({
      clickHandler: p.clickHandler,
      color: p.color,
      id: p.id,
      key: p.key,
      tooltip: p.tooltip,
      v: p.value,
    })),
    outerRadius: radius,
  }));

  const outerPie = outerPieData.map((p, i) => d3
    .pie()
    // .padAngle(HALF_OF_HALF_DEGREE_IN_RAD / 1.5)
    // .padAngle(HALF_DEGREE_IN_RAD)
    .startAngle(innerPie[i].startAngle)
    .endAngle(innerPie[i].endAngle)(p.items.map(i => i.v)),);

  const dataWithPie = [
    innerPieData.map((p, i) => ({
      ...p,
      pie: innerPie[i],
      // color: colors[innerPieData[i].key].color,
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
          // color: colors[innerPieData[i].key].projects[item.key],
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
    .attr('class', d => `pointer arc-hover-${snakeCase(d.id)}`)
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
  withSize()
)(DoubleRingChart);
