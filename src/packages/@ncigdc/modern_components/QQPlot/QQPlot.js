import React from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import {
  compose,
  withState,
  pure,
  withProps,
  withPropsOnChange,
} from 'recompose';
import { last, groupBy } from 'lodash';
import * as ss from 'simple-statistics';
import './qq.css';

import { withTheme } from '@ncigdc/theme';
import { withTooltip } from '@ncigdc/uikit/Tooltip';
import withSize from '@ncigdc/utils/withSize';

import '@ncigdc/components/Charts/style.css';

const sortAscending = (a, b) => a - b;

// from https://rangevoting.org/Qnorm.html
const qnorm = function (p) {
  // ALGORITHM AS 111, APPL.STATIST., VOL.26, 118-121, 1977.
  // Computes z = invNorm(p)

  p = parseFloat(p);
  const split = 0.42;

  const a0 = 2.50662823884;
  const a1 = -18.61500062529;
  const a2 = 41.39119773534;
  const a3 = -25.44106049637;
  const b1 = -8.4735109309;
  const b2 = 23.08336743743;
  const b3 = -21.06224101826;
  const b4 = 3.13082909833;
  const c0 = -2.78718931138;
  const c1 = -2.29796479134;
  const c2 = 4.85014127135;
  const c3 = 2.32121276858;
  const d1 = 3.54388924762;
  const d2 = 1.63706781897;

  const q = p - 0.5;

  let r;
  let ppnd;

  if (Math.abs(q) <= split) {
    r = q * q;
    ppnd =
      (q * (((a3 * r + a2) * r + a1) * r + a0)) /
      ((((b4 * r + b3) * r + b2) * r + b1) * r + 1);
  } else {
    r = p;
    if (q > 0) r = 1 - p;
    if (r > 0) {
      r = Math.sqrt(-Math.log(r));
      ppnd = (((c3 * r + c2) * r + c1) * r + c0) / ((d2 * r + d1) * r + 1);
      if (q < 0) ppnd = -ppnd;
    } else {
      ppnd = 0;
    }
  }

  return ppnd;
};

const QQPlot = ({
  data = [],
  title,
  yAxisTitle = 'Sample Quantiles',
  xAxisTitle = 'Theoretical Quantiles',
  styles = {},
  height = 317,
  margin: m,
  theme,
  width,
}) => {
  const dataLength = data.length >= 100 ? 100 : data.length;
  const n = data.slice(0, dataLength).length;
  console.log(data.slice(0, dataLength));
  const getQuantile = (n, quantile) => Math.ceil(n * (quantile / 4)) - 1; // subtract 1 to account for 0 index array

  // quantile(y) and theoretical quantile (x)
  const zScores = data.slice(0, dataLength).sort(sortAscending).map((age, i) => ({
    x: qnorm((i + 1 - 0.5) / n),
    y: age,
  }));

  const quantile1Coords = zScores[getQuantile(n, 1)];
  const quantile3Coords = zScores[getQuantile(n, 3)];

  const el = ReactFauxDOM.createElement('div');
  el.style.width = '100%';

  el.setAttribute('class', 'test-qq-plot');
  const innerPadding = 0.3;
  const outerPadding = 0.3;

  const margin = m || {
    top: 20,
    right: 50,
    bottom: 65,
    left: 55,
  };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = (height || 200) - margin.top - margin.bottom;

  const padding = 40;
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

  const yAxisStyle = yAxis.style || {
    textFill: theme.greyScale3,
    fontSize: '1.3rem',
    fontWeight: '500',
    stroke: theme.greyScale4,
  };
  const xAxisStyle = xAxis.style || {
    textFill: theme.greyScale3,
    fontSize: '1.3rem',
    fontWeight: '700',
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
    .attr('width', chartWidth + 30)
    .attr('height', chartHeight)
    .style('paddingLeft', 30);

  const line = d3
    .line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y));

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
    .attr('stroke-width', 2);

    // const yG = svg.append('g').call(
      // d3
        // .axisLeft(y)
        // .ticks(Math.min(4, maxY))
        // .tickSize(-chartWidth)
        // .tickSizeOuter(0)
    // );
    //
    // yG.selectAll('path').style('stroke', 'none');
    // yG.selectAll('line').style('stroke', yAxisStyle.stroke);
    // yG.selectAll('text')
    //   .style('fontSize', yAxisStyle.fontSize)
    //   .style('fill', yAxisStyle.textFill);
    //
    // svg
    //   .append('path')
    //   .classed('regressionLine', true)
    //   .datum(regressionPoints(zScores))
    //   .attr('d', line)
    //   .attr('stroke', 'black')
    //   .attr('stroke-width', 2);
  svg
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left)
    .attr('x', 0 - height / 2)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .style('fontSize', yAxisStyle.fontSize)
    .style('fontWeight', yAxisStyle.fontWeight)
    .attr('fill', yAxisStyle.textFill)
    .text(yAxis.title || '');

  svg
    .append('text')
    .attr('y', 0)
    .attr('x', width / 4)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .style('fontSize', '2rem')
    .style('fontWeight', '500')
    .style('marginBottom', 10)
    // .attr('fill', yAxisStyle.textFill)
    .text(title);

  svg
    .selectAll('circle')
    .data(zScores)
    .enter()
    .append('circle')
    .attr('cx', (d) => xScale(d.x))
    .attr('cy', (d) => yScale(d.y))
    .attr('r', 2)
    .attr('stroke', 'green')
    .attr('fill', 'transparent');

  // x axis
  svg
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0,${chartHeight - padding})`)
    .call(xAxis);

  // y axis
  svg
    .append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${padding}, 0)`)
    .call(yAxis);

  svg
    .append('text')
    .attr('transform', 'rotate(-90)')
      // .attr('y', 0 - margin.left)
      // .attr('x', 0 - chartHeight / 2)
    .attr('y', -10)
    .attr('x', -100)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .style('fontSize', '1rem')
    .attr('fill', 'blue')
    .text(yAxisTitle);

      // .style('fontSize', yAxisStyle.fontSize)
      // .style('fontWeight', yAxisStyle.fontWeight)
      // .attr('fill', yAxisStyle.textFill)
  svg
    .append('rect')
    .attr('x', chartWidth)
    .attr('y', 100)
    .attr('clip-path', 'url(#regression-clip)')
    .style('fill', 'white')
    .attr('height', 100)
    .attr('width', chartWidth);

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
