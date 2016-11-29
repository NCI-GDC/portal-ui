// Vendor
import { PropTypes } from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';

/*----------------------------------------------------------------------------*/
const DoubleRingChart = ({ data, height = 160, width = 160, outerRingWidth = 30 }) => {
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  const centerRingWidth = width - (outerRingWidth) * 2;
  const centerRingHeight = height - (outerRingWidth) * 2;
  const centerRadius = Math.min(centerRingWidth, centerRingHeight)/2;
  const radius = Math.min(width, height)/2;

  const node = ReactFauxDOM.createElement('div');
  node.style.setProperty('display', 'flex');
  node.style.setProperty('justify-content', 'center');

  const svg = d3.select(node).append('svg')
    .attr('width', width)
    .attr('height', height)
  .append('g')
    .attr('transform', `translate(${width/2}, ${height/2})`);

  const HALF_DEGREE_IN_RAD = 0.00872665;
  const innerPieData = data.map(d => ({
    v: d.value,
    label: d.label,
    innerRadius: 0,
    outerRadius: centerRadius - 5,
    clickHandler: d.clickHandler
  }));
  const innerPie = d3.pie().padAngle(HALF_DEGREE_IN_RAD*2).value(d => d.v)(innerPieData);
  const outerPieData = data.map((d, i) => {
    return ({
      items: d.outer.map(p => ({v: p.value, label: p.label, clickHandler: p.clickHandler})),
      innerRadius: centerRadius,
      outerRadius: radius,
    });
  });
  const outerPie = outerPieData.map(
    (p, i) => d3.pie()
    .padAngle(HALF_DEGREE_IN_RAD)
    .startAngle(innerPie[i].startAngle)
    .endAngle(innerPie[i].endAngle)(p.items.map(i => i.v))
  );

  const dataWithPie = [
    innerPieData.map(
      (p, i) => ({
        ...p,
        pie: innerPie[i],
        color: color(i)
      })
    ),
    outerPieData.reduce(
      (acc, p, i) => [
        ...acc,
        ...p.items.map((items, j) => ({
          ...p,
          pie: outerPie[i][j],
          v: items.v,
          label: items.label,
          color: d3.color(color(i)).brighter(0.5),
          clickHandler: items.clickHandler,
        }))
    ], [])
  ];

  const g = svg.selectAll('.g')
    .data(dataWithPie)
    .enter().append('g');

  const fill = g.selectAll('path')
    .data(d => d)
    .enter().append('path')
    .attr('d', d => {
      return d3.arc()
        .outerRadius(d.outerRadius)
        .innerRadius(d.innerRadius)(d.pie);
    })
    .style('fill', (d, i) => d.color);

    fill
    .attr('class', 'pointer')
    .on('mouseenter', d => {
      d3.select('.global-tooltip')
        .classed('active', true)
        .html(`<b>${d.label}</b><br />${d.pie.value} cases`);
    })
    .on('mouseleave', d => {
      d3.select('.global-tooltip')
      .classed('active', false)
    })
    .on('mousedown', d => d.clickHandler && d.clickHandler())

  return node.toReact();
};

DoubleRingChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.number,
    clickHandler: PropTypes.func,
    outer: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.number,
      clickHandler: PropTypes.func,
    }))
  })),
  height: PropTypes.number,
  width: PropTypes.number,
  outerRingWidth: PropTypes.number,
};

/*----------------------------------------------------------------------------*/

export default DoubleRingChart;
