// @flow

import PropTypes from 'prop-types';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';

import { withTooltip } from '@ncigdc/uikit/Tooltip';

const DoubleRingChart = ({
  data,
  colors,
  height = 160,
  width = 160,
  outerRingWidth = 30,
  setTooltip,
}) => {
  const centerRingWidth = width - outerRingWidth * 2;
  const centerRingHeight = height - outerRingWidth * 2;
  const centerRadius = Math.min(centerRingWidth, centerRingHeight) / 2;
  const radius = Math.min(width, height) / 2;

  const node = ReactFauxDOM.createElement('div');
  node.style.setProperty('display', 'flex');
  node.style.setProperty('justify-content', 'center');
  node.setAttribute('class', 'test-double-ring-chart');

  const svg = d3
    .select(node)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

  const HALF_DEGREE_IN_RAD = 0.00872665;
  const innerPieData = data.map(d => ({
    v: d.value,
    key: d.key,
    tooltip: d.tooltip,
    innerRadius: 0,
    outerRadius: centerRadius - 5,
    clickHandler: d.clickHandler,
  }));
  const innerPie = d3
    .pie()
    .padAngle(HALF_DEGREE_IN_RAD * 2)
    .value(d => d.v)(innerPieData);
  const outerPieData = data.map((d, i) => ({
    items: d.outer.map(p => ({
      v: p.value,
      key: p.key,
      tooltip: p.tooltip,
      clickHandler: p.clickHandler,
    })),
    innerRadius: centerRadius,
    outerRadius: radius,
  }));
  const outerPie = outerPieData.map((p, i) => d3
    .pie()
    .padAngle(HALF_DEGREE_IN_RAD)
    .startAngle(innerPie[i].startAngle)
    .endAngle(innerPie[i].endAngle)(p.items.map(i => i.v)),);

  const dataWithPie = [
    innerPieData.map((p, i) => ({
      ...p,
      pie: innerPie[i],
      color: colors[innerPieData[i].key].color,
    })),
    outerPieData.reduce(
      (acc, p, i) => [
        ...acc,
        ...p.items.map((item, j) => ({
          ...p,
          pie: outerPie[i][j],
          v: item.v,
          key: item.key,
          tooltip: item.tooltip,
          color: colors[innerPieData[i].key].projects[item.key],
          clickHandler: item.clickHandler,
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
      .outerRadius(d.outerRadius)
      .innerRadius(d.innerRadius)(d.pie),)
    .style('fill', (d, i) => d.color);

  fill
    .attr('class', 'pointer')
    .on('mouseenter', d => {
      setTooltip(d.tooltip);
    })
    .on('mouseleave', d => {
      setTooltip();
    })
    .on('mousedown', d => d.clickHandler && d.clickHandler());

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

export default withTooltip(DoubleRingChart);
