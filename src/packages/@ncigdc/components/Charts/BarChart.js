// @flow

// Vender
import React from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import {
  compose,
  withState,
  pure,
} from 'recompose';

// Custom
import { withTheme } from '@ncigdc/theme';
import { withTooltip } from '@ncigdc/uikit/Tooltip';
import withSize from '@ncigdc/utils/withSize';
import './style.css';

export const DEFAULT_X_AXIS_LABEL_LENGTH = 10;

const BarChart = ({
  data,
  height: h,
  mappingLabel = 'label', // name it with the key you want, e.g. if your data structure is {id: 'bla', count: 1234 } put label = 'id' and value = 'count'
  mappingValue = 'value',
  margin: m,
  setTooltip,
  showXAxisLabels = true,
  size: { width },
  styles,
  theme,
  title,
  xAxis = {}, // Must have titleForSVG and title if showXAxisLabels is false.
  xAxisLabelLength = DEFAULT_X_AXIS_LABEL_LENGTH,
  yAxis = {},
}) => {
  if (!showXAxisLabels && (!xAxis.title || !xAxis.titleForSVG)) {
    throw new Error('For GDC Developers, when showXAxisLabels is false, value of titleForSVG or title in xAxis should not be blank.');
  }
  const el = ReactFauxDOM.createElement('div');
  el.style.width = '100%';

  el.setAttribute('class', 'test-bar-chart');
  const innerPadding = 0.3;
  const outerPadding = 0.3;

  const margin = m || {
    top: 20,
    right: 50,
    bottom: 65,
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

  const x = d3
    .scaleBand()
    .domain(data.map(d => d[mappingLabel]))
    .rangeRound([0, chartWidth])
    .paddingInner(innerPadding)
    .paddingOuter(outerPadding);

  const maxY = d3.max(data, d => d[mappingValue]);
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
      .tickSizeOuter(0)
  );

  yG.selectAll('path').style('stroke', 'none');
  yG.selectAll('line').style('stroke', yAxisStyle.stroke);
  yG.selectAll('text')
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

  if (showXAxisLabels) {
    // hidden x axis for full length labels in svg download
    const hiddenXG = svg
      .append('g')
      .attr('class', 'svgDownload')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    hiddenXG.selectAll('text')
      .style('text-anchor', 'start')
      .style('fontSize', xAxisStyle.fontSize)
      .style('fontWeight', xAxisStyle.fontWeight)
      .attr('fill', xAxisStyle.textFill)
      .attr('dx', '.8em')
      .attr('dy', '.5em')
      .text(d => d)
      .attr('transform', 'rotate(45)');

    hiddenXG.selectAll('path').style('stroke', xAxisStyle.stroke);

    hiddenXG.selectAll('line').style('stroke', xAxisStyle.stroke);

    // display x axis
    const xG = svg
      .append('g')
      .attr('class', 'displayOnly')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    xG.selectAll('text')
      .style('text-anchor', 'start')
      .style('fontSize', xAxisStyle.fontSize)
      .style('fontWeight', xAxisStyle.fontWeight)
      .attr('fill', xAxisStyle.textFill)
      .attr('dx', '.8em')
      .attr('dy', '.5em')
      .text(d => (d.length > xAxisLabelLength ? `${d.substring(0, xAxisLabelLength - 3)}...` : d))
      .attr('transform', 'rotate(45)');

    xG.selectAll('path').style('stroke', xAxisStyle.stroke);

    xG.selectAll('line').style('stroke', xAxisStyle.stroke);

    xG.selectAll('.tick')
      .data(data)
      .on('mouseenter', d => {
        setTooltip(d.tooltip);
      })
      .on('mouseleave', () => {
        setTooltip();
      });
  } else {
    svg
      .append('text')
      .attr('class', 'displayOnly')
      .attr('transform', 'rotate(0)')
      .attr('y', height + 20)
      .attr('x', width / 2 - margin.left)
      .attr('dx', '1em')
      .style('text-anchor', 'middle')
      .style('fontSize', '1.2rem')
      .style('fontWeight', '500')
      .attr('fill', yAxisStyle.textFill)
      .text(xAxis.title);

    svg
      .append('text')
      .attr('class', 'svgDownload')
      .attr('transform', 'rotate(0)')
      .attr('y', height + 20)
      .attr('x', width / 2 - margin.left)
      .attr('dx', '1em')
      .style('text-anchor', 'middle')
      .style('fontSize', '1.2rem')
      .style('fontWeight', '500')
      .attr('fill', xAxisStyle.textFill)
      .text(xAxis.titleForSVG);
  }

  const barGs = svg
    .selectAll('g.chart')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'bar-g');

  const drawBar = barG => {
    barG
      .append('rect')
      .attr('class', 'bar')
      .attr('fill', (styles.bars || { fill: 'steelblue' }).fill)
      .attr('width', x.bandwidth())
      .attr('y', d => y(d[mappingValue]))
      .attr('x', d => x(d[mappingLabel]))
      .attr('height', d => height - y(d[mappingValue]))
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

  barGs.each(function selectAndDraw() {
    drawBar(d3.select(this));
  });

  return el.toReact();
};

export default compose(
  withTheme,
  withTooltip,
  withState('chart', 'setState', <span />),
  withSize({ refreshRate: 16 }),
  pure
)(BarChart);
