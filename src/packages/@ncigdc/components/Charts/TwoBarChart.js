// @flow

// Vender
import React from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import { compose, withState, pure } from 'recompose';

// Custom
import { withTheme } from '@ncigdc/theme';
import { withTooltip } from '@ncigdc/uikit/Tooltip';
import withSize from '@ncigdc/utils/withSize';
import './style.css';
import { MAX_X_AXIS_LENGTH } from '@ncigdc/components/Charts/BarChart';

const BarChart = ({
  data1,
  data2,
  title,
  yAxis = {},
  xAxis = {},
  styles,
  height: h,
  margin: m,
  setTooltip,
  theme,
  size: { width },
  minBarHeight = 0,
}) => {
  const el = ReactFauxDOM.createElement('div');
  el.style.width = '100%';
  el.setAttribute('class', 'test-bar-chart');
  const innerPadding = 0.3;
  const outerPadding = 0.3;

  const margin = m || {
    top: 20,
    right: 50,
    bottom: 85,
    left: 55,
  };
  const chartWidth = width - margin.left - margin.right;
  const height = (h || 200) - margin.top - margin.bottom;
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

  const x1 = d3
    .scaleBand()
    .domain(data1.map(d => d.label))
    .rangeRound([0, chartWidth])
    .paddingInner(innerPadding)
    .paddingOuter(outerPadding);

  const maxY = d3.max([...data1, ...data2], d => d.value);
  const y = d3
    .scaleLinear()
    .range([height, 0])
    .domain([0, maxY]);

  const svg = d3
    .select(el)
    .append('svg')
    .attr('width', width)
    .attr('height', height + margin.top + margin.bottom)
    .append('g', 'chart')
    .attr('fill', '#fff')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  svg
    .append('text')
    .attr('y', 0 - margin.top)
    .attr('x', width / 2)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .style('fontSize', '1.1rem')
    .style('fontWeight', '500')
    .attr('fill', yAxisStyle.textFill)
    .text(title);

  const yG = svg.append('g').call(
    d3
      .axisLeft(y)
      .ticks(Math.min(4, maxY))
      .tickSize(-chartWidth)
      .tickSizeOuter(0),
  );

  yG.selectAll('path').style('stroke', 'none');
  yG.selectAll('line').style('stroke', yAxisStyle.stroke);
  yG
    .selectAll('text')
    .style('fontSize', yAxisStyle.fontSize)
    .style('fill', yAxisStyle.textFill);

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

  const xG = svg
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x1));

  xG
    .selectAll('text')
    .style('text-anchor', 'start')
    .style('fontSize', xAxisStyle.fontSize)
    .style('fontWeight', xAxisStyle.fontWeight)
    .attr('fill', xAxisStyle.textFill)
    .attr('dx', '.8em')
    .attr('dy', '.5em')
    .text(d => (d.length > MAX_X_AXIS_LENGTH ? `${d.substring(0, MAX_X_AXIS_LENGTH)}...` : d))
    .attr('transform', 'rotate(45)');

  xG.selectAll('path').style('stroke', xAxisStyle.stroke);

  xG.selectAll('line').style('stroke', xAxisStyle.stroke);

  const drawBar = (barG, styles, xOffset = 0) => {
    barG
      .append('rect')
      .attr('class', 'bar')
      .attr('fill', (styles || { fill: 'steelblue' }).fill)
      .attr('width', x1.bandwidth() / 2)
      .attr('y', d => {
        const barOffset = y(d.value);
        return barOffset === height
          ? barOffset
          : Math.min(barOffset, height - minBarHeight);
      })
      .attr('x', d => x1(d.label) + xOffset)
      .attr('height', d => {
        const barHeight = height - y(d.value);
        return barHeight && Math.max(barHeight, minBarHeight);
      })
      .on('click', d => {
        if (d.onClick) {
          d.onClick();
        }
      })
      .classed('pointer', d => d.onClick)
      .on('mouseenter', d => {
        setTooltip(d.tooltip);
      })
      .on('mouseleave', () => {
        setTooltip();
      });
  };

  svg
    .selectAll('g.chart')
    .data(data1)
    .enter()
    .append('g')
    .attr('class', 'bar-g')
    .each(function () {
      drawBar(d3.select(this), styles.bars1);
    });

  svg
    .selectAll('g.chart')
    .data(data2)
    .enter()
    .append('g')
    .attr('class', 'bar-g')
    .each(function () {
      drawBar(d3.select(this), styles.bars2, x1.bandwidth() / 2 + 4);
    });

  return el.toReact();
};

export default compose(
  withTheme,
  withTooltip,
  withState('chart', 'setState', <span />),
  withSize(),
  pure,
)(BarChart);
