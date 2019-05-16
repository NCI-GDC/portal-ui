import React from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import {
  compose,
  withState,
  pure,
  withProps,
} from 'recompose';
import { last, groupBy, sortBy } from 'lodash';
import * as ss from 'simple-statistics';
import './qq.css';

import { withTheme } from '@ncigdc/theme';
import { withTooltip } from '@ncigdc/uikit/Tooltip';
import withSize from '@ncigdc/utils/withSize';
import { qnorm } from './qqUtils';
import '@ncigdc/components/Charts/style.css';

const QQPlot = ({
  data = [],
  yAxisTitle = 'Sample Quantiles',
  xAxisTitle = 'Theoretical Quantiles',
  styles = {},
  height = 320,
  width,
  theme,
  plotTitle = '',
}) => {
  const dataLength = data.length >= 100 ? 100 : data.length;
  const n = data.length;
  const getQuantile = (n, quantile) => Math.ceil(n * (quantile / 4)) - 1; // subtract 1 to account for 0 index array

  // quantile(y) and theoretical quantile (x)
  const zScores = sortBy(data).map((age, i) => ({
    x: qnorm((i + 1 - 0.5) / n),
    y: age,
  }));

  const quantile1Coords = zScores[getQuantile(n, 1)];
  const quantile3Coords = zScores[getQuantile(n, 3)];

  const el = ReactFauxDOM.createElement('div');
  el.style.width = '100%';
  el.setAttribute('class', 'qq-plot');

  const margin = styles.margin || {
    top: 20,
    right: 50,
    bottom: 65,
    left: 45,
  };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = (height || 200) - margin.top - margin.bottom;
  const padding = styles.padding || 40;

  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(zScores, (d) => {
        return Math.floor(d.x);
      }),
      d3.max(zScores, (d) => {
        return Math.ceil(d.x);
      }),
    ])
    .range([padding, chartWidth - padding * 2]);

  const yScale = d3
    .scaleLinear()
    .domain([
      d3.min(zScores, (d) => {
        return Math.floor(d.y);
      }),
      d3.max(zScores, (d) => {
        return Math.ceil(d.y);
      }),
    ])
    .range([chartHeight - padding, padding]);

  const xAxis = d3
    .axisBottom()
    .scale(xScale)
    .ticks(Object.keys(groupBy(zScores.map(z => z.x), Math.floor)).length);

  const yAxis = d3
    .axisLeft()
    .scale(yScale)
    .ticks(5);

  const axisStyle = {
    textFill: theme.greyScale3,
    fontSize: '1rem',
    fontWeight: '400',
    stroke: theme.greyScale4,
  };

  const slope = (quantile3Coords.y - quantile1Coords.y) / (quantile3Coords.x - quantile1Coords.x);
  const yMin = zScores[0].y;
  const yMax = last(zScores).y;
  const xAtYMin = quantile1Coords.x - ((quantile1Coords.y - yMin) / slope);
  const xAtYMax = quantile3Coords.x + ((yMax - quantile3Coords.y) / slope);

  const svg = d3
    .select(el)
    .append('svg')
    .attr('width', chartWidth)
    .attr('height', chartHeight);

  // draw sample points
  svg
    .selectAll('circle')
    .data(zScores)
    .enter()
    .append('circle')
    .attr('cx', (d) => xScale(d.x))
    .attr('cy', (d) => yScale(d.y))
    .attr('r', 2)
    .attr('stroke', 'green')
    .attr('fill', 'transparent')
    .attr('transform', `translate(${padding},0)`);

  const line = d3
    .line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y));

  // draw qq line
  svg
    .append('path')
    .attr('class', 'coords')
    .datum([
      {
        x: xAtYMin,
        y: yMin,
      },
      ...quantile1Coords,
      ...quantile3Coords,
      {
        x: xAtYMax,
        y: yMax,
      },
    ])
    .attr('d', line)
    .attr('stroke', 'red')
    .attr('stroke-width', 2)
    .attr('transform', `translate(${padding},0)`);

// clip path to prevent qq line extending beyond y-axis
// position and dimensions should come from chart settings
  svg
    .append('rect')
    .attr('x', -10)
    .attr('y', 20)
    .attr('clip-path', 'url(#regression-clip)')
    .style('fill', 'white')
    .attr('height', 200)
    .attr('width', 50)
    .attr('transform', `translate(${padding},0)`);

  // svg
  //   .append('text')
  //   .attr('transform', 'rotate(-90)')
  //   .attr('y', 0 - margin.left)
  //   .attr('x', 0 - height / 2)
  //   .attr('dy', '1em')
  //   .style('text-anchor', 'middle')
  //   .style('fontSize', axisStyle.fontSize)
  //   .style('fontWeight', axisStyle.fontWeight)
  //   .attr('fill', axisStyle.textFill)
  //   .text(yAxis.title || '');

  svg
    .append('text')
    .attr('y', 0)
    .attr('x', (width / 2) - (padding / 2))
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .style('fontSize', '1.2rem')
    .style('fontWeight', '400')
    .style('marginBottom', 10)
    .text(plotTitle);

  // x axis
  svg
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(${padding},${chartHeight - padding})`)
    .call(xAxis);

  svg
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', `translate(${width / 2 - (padding / 2)},${height - (padding * 2) - 10})`)
    .text(xAxisTitle)
    .style('fontSize', axisStyle.fontSize)
    .style('fontWeight', axisStyle.fontWeight)
    .attr('fill', axisStyle.textFill);

  // y axis
  svg
    .append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${padding * 2}, 0)`)
    .call(yAxis);
    // .selectAll('text')
    // .attr('y', 0)
    // .attr('x', 9)
    // .attr('dy', '.35em')
    // .attr('transform', 'translate(-15,-5)rotate(45)')
    // .style('text-anchor', 'start');
  // svg
  //   .append('text')
  //   .attr('transform', 'rotate(-90)')
  //     // .attr('y', 0 - margin.left)
  //     // .attr('x', 0 - chartHeight / 2)
  //   .attr('y', -10)
  //   .attr('x', -100)
  //   .attr('dy', '1em')
  //   .style('text-anchor', 'middle')
  //   .style('fontSize', '1rem')
  //   .attr('fill', 'blue')
  //   .text(yAxisTitle);

  svg
    .append('text')
    .attr('text-anchor', 'middle') // this makes it easy to centre the text as the transform is applied to the anchor
    .attr('transform', `translate(${padding - 10},${height / 3})rotate(-90)`) // text is drawn off the screen top left, move down and out and rotate
    .text(yAxisTitle)
    .style('fontSize', axisStyle.fontSize)
    .style('fontWeight', axisStyle.fontWeight)
    .attr('fill', axisStyle.textFill);

  return el.toReact();
};

export default compose(
  withTheme,
  withTooltip,
  withState('chart', 'setState', <span />),
  withSize({ refreshRate: 16 }),
  withProps(({ data }) => ({ data })),
  pure
)(QQPlot);
