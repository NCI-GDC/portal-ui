import PropTypes from 'prop-types';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import Color from 'color';
import { snakeCase } from 'lodash';

import { withTooltip } from '@ncigdc/uikit/Tooltip';

const DoubleRingChart = ({
  data = [],
  height = 160,
  outerRingWidth = 30,
  setTooltip,
  width = 160,
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

  // const HALF_DEGREE_IN_RAD = 0.00872665;
  // const HALF_OF_HALF_DEGREE_IN_RAD = 0.004363325;

  const innerPieData = data.map(d => ({
    clickHandler: d.clickHandler,
    color: d.color,
    id: d.id,
    innerRadius: width / 3.3,
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


  // const g = svg
  //   .selectAll('.arc')
  //   .data(pie(data))
  //   .enter()
  //   .append('g')
  //   .each(d => {
  //     d.outerRadius = outerRadius - 20;
  //   })
  //   .attr('class', 'arc');
  //
  // const gHover = svg
  //   .selectAll('.arc-hover')
  //   .data(pie(data))
  //   .enter()
  //   .append('g')
  //   .each(d => {
  //     d.outerRadius = outerRadius - 15;
  //   })
  //   .attr('class', 'arc-hover');

  fill
    .attr('class', d => `pointer arc-hover-${snakeCase(d.id)}`)
    .on('mouseenter', d => {
      const target = document.querySelector(`.arc-hover-${snakeCase(d.id)}`);
      target.style.stroke = Color(d.color).lighten(0.7).rgbString();
      target.style.strokeWidth = 5;
      setTooltip(d.tooltip);
    })
    .on('mouseleave', d => {
      const target = document.querySelector(`.arc-hover-${snakeCase(d.id)}`);
      target.style.stroke = '#fff';
      target.style.strokeWidth = 0.5;
      setTooltip();
    })
    .on('mousedown', d => {
      d.clickHandler && d.clickHandler();
    });

  //    .attr('stroke', d => Color(d.color).lighten(0.5).rgbString())
      // .attr('stroke-width', 5)
  // const fillHover = gHoverPath
  //   .attr('d', fill)
  //   .style('fill', d => d.color)
  //   .style('opacity', 0);
  //
  // fillHover
  //   .attr('class', d => `pointer arc-hover-${snakeCase(d.id)}`)
  //   .on('mouseenter', d => {
  //     console.log('here: ', d);
      // document.querySelector(`.arc-hover-${snakeCase(d.id)}`)
      //   .style.opacity = 0.5;
  //   })
  //   .on('mouseleave', d => {
  //     document.querySelector(`.arc-hover-${snakeCase(d.id)}`)
  //       .style.opacity = 0;
  //   });

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
