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
import reactSize from 'react-sizeme';

import { qnorm } from './qqUtils';

const QQPlot = ({
  axisStyles = {},
  data = [],
  exportCoordinates = false,
  height = 320,
  plotTitle = '',
  qqLineStyles = {},
  qqPointStyles = {},
  size: { width },
  styles = {},
  xAxisTitle = 'Theoretical Quantiles',
  yAxisTitle = 'Sample Quantiles',
}) => {
  // default styles
  const qqLine = {
    color: '#e377c2',
    strokeWidth: 2,
    ...qqLineStyles,
  };
  const qqPoint = {
    color: 'blue',
    strokeWidth: 1,
    radius: 1.5,
    ...qqPointStyles,
  };
  const axisStyle = {
    textColor: '#888',
    fontSize: '1rem',
    fontWeight: '400',
    ...axisStyles,
  };

  const margin = styles.margin || {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  };

  const chartWidth = (width || 300) - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  const padding = styles.padding || 40;

  // qq plot calculations
  const n = data.length;

  // subtract 1 to account for 0 index array
  const getQuantile = (count, quantile) => Math.ceil(count * (quantile / 4)) - 1;

  let zScores = data;

  // sample quantile(y) and theoretical quantile (x)
  if (!exportCoordinates) {
    zScores = sortBy(data).map((age, i) => ({
      x: qnorm((i + 1 - 0.5) / n),
      y: age,
    }));
  }

  const quantile1Coords = zScores[getQuantile(n, 1)];
  const quantile3Coords = zScores[getQuantile(n, 3)];

  // create svg
  const el = ReactFauxDOM.createElement('div');
  el.style.width = '100%';
  el.setAttribute('class', 'qq-plot');

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
    .range([chartHeight, padding]);

  const xAxis = d3
    .axisBottom()
    .scale(xScale)
    .ticks(Object.keys(groupBy(zScores.map(z => z.x), Math.floor)).length);

  const yAxis = d3
    .axisLeft()
    .scale(yScale)
    .ticks(5);

  // get slope from first and third quantile to match qqline from R
  const slope = (quantile3Coords.y - quantile1Coords.y) / (quantile3Coords.x - quantile1Coords.x);
  const yMin = zScores[0].y;
  const yMax = last(zScores).y;

  // calculate x values for start and end of line
  const xAtYMin = quantile1Coords.x - ((quantile1Coords.y - yMin) / slope);
  const xAtYMax = quantile3Coords.x + ((yMax - quantile3Coords.y) / slope);

  const svg = d3
    .select(el)
    .append('svg')
    .attr('width', chartWidth)
    .attr('height', chartHeight + padding);

  // draw sample points
  svg
    .selectAll('circle')
    .data(zScores)
    .enter()
    .append('circle')
    .attr('cx', (d) => xScale(d.x))
    .attr('cy', (d) => yScale(d.y))
    .attr('r', qqPoint.radius)
    .attr('stroke', qqPoint.color)
    .attr('stroke-width', qqPoint.strokeWidth)
    .attr('fill', 'transparent')
    .attr('transform', `translate(${padding},${-(padding / 2)})`);

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
    .attr('stroke', qqLine.color)
    .attr('stroke-width', qqLine.strokeWidth)
    .attr('transform', `translate(${padding},${-(padding / 2)})`);

// clip path to prevent qq line extending beyond y-axis
  svg
    .append('rect')
    .attr('x', -(padding))
    .attr('y', padding / 2)
    .attr('clip-path', 'url(#regression-clip-left)')
    .style('fill', 'white')
    .attr('height', chartHeight - padding)
    .attr('width', padding * 2)
    .attr('transform', `translate(${padding},${padding / 2})`);

  // position slightly higher to account for qqline end
  svg
    .append('rect')
    .attr('x', -(padding))
    .attr('y', padding / 2)
    .attr('clip-path', 'url(#regression-clip-right)')
    .style('fill', 'white')
    .attr('height', chartHeight)
    .attr('width', padding * 2)
    .attr('transform', `translate(${chartWidth},${-padding})`);

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
    .attr('transform', `translate(${padding},${height - (padding / 2)})`)
    .call(xAxis);

  svg
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', `translate(${(chartWidth + padding) / 2},${height + (padding / 2)})`)
    .text(xAxisTitle)
    .style('fontSize', axisStyle.fontSize)
    .style('fontWeight', axisStyle.fontWeight)
    .attr('fill', axisStyle.textColor);

  // y axis
  svg
    .append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${padding * 2}, ${-(padding / 2)})`)
    .call(yAxis);

  svg
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', `translate(${padding - 10},${height / 2})rotate(-90)`)
    .text(yAxisTitle)
    .style('fontSize', axisStyle.fontSize)
    .style('fontWeight', axisStyle.fontWeight)
    .attr('fill', axisStyle.textColor);

  return el.toReact();
};

export default reactSize(compose(
  withState('chart', 'setState', <span />),
  withProps(({ data }) => ({ data })),
  pure
))(QQPlot);
