// @flow

// Vender
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import { withTooltip } from '@ncigdc/uikit/Tooltip';
import withSize from '@ncigdc/utils/withSize';
// Custom
import { withTheme } from '@ncigdc/theme';
import './style.css';

import { DEFAULT_X_AXIS_LABEL_LENGTH } from '@ncigdc/components/Charts/BarChart';

type TProps = {
  data: Object,
  yAxis: Object,
  xAxis: Object,
  styles: Object,
  margin: Object,
  displayFilters: Object,
  colors: Object,
  projectsIdtoName: Object,
  height?: number,
  size?: Object,
  theme: Object,
  setTooltip: Function,
};
const FilteredStackedBarChart = ({
  data,
  yAxis = {},
  xAxis = {
    rotate: 45,
    xAxisTextAnchor: 'start',
  },
  margin: m,
  displayFilters = {},
  colors,
  height = 200,
  size: { width },
  theme,
  setTooltip,
  xAxisLabelLength = DEFAULT_X_AXIS_LABEL_LENGTH,
}: TProps) => {
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
  const el = ReactFauxDOM.createElement('div');
  el.style.width = '100%';
  el.setAttribute('class', 'test-stacked-bar-chart');

  const margin = m || {
    top: 10,
    right: 0,
    bottom: 55,
    left: 70,
  };
  const chartWidth = width - margin.left - margin.right;
  const x = d3
    .scaleBand()
    .rangeRound([0, chartWidth])
    .padding(0.3)
    .align(0.3)
    .domain(data.map(d => d.symbol));
  const set = new Set(data.reduce((acc, d) => [...acc, ...Object.keys(d)], []));
  const allKeys = Array.from(set).filter(v => displayFilters[v]);
  const maxY = d3.max(data, d => allKeys.reduce((acc, key) => acc + d[key], 0));

  const y = d3
    .scaleLinear()
    .rangeRound([height, 0])
    .domain([0, maxY]);

  const stack = d3.stack().keys(allKeys);
  const g = d3
    .select(el)
    .append('svg')
    .attr('width', width)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const stackedData = stack(data).map(d => d
    .filter(d2 => !isNaN(d2[0]) && !isNaN(d2[1]))
    .map(d2 => d2.concat({
      key: d.key,
      index: d.index,
      data: d2.data,
    })));

  const xG = g
    .append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x));
  xG
    .selectAll('text')
    .style('text-anchor', xAxis.xAxisTextAnchor)
    .style('fontSize', xAxisStyle.fontSize)
    .style('fontWeight', xAxisStyle.fontWeight)
    .attr('fill', xAxisStyle.textFill)
    .attr('dx', '.8em')
    .attr('dy', '.5em')
    .text(d => (d.length > xAxisLabelLength ? `${d.substring(0, xAxisLabelLength - 3)}...` : d))
    .attr('transform', `rotate(${xAxis.rotate})`);
  xG.selectAll('path').style('stroke', xAxisStyle.stroke);
  xG.selectAll('line').style('stroke', xAxisStyle.stroke);

  g
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left)
    .attr('x', 0 - height / 2)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .style('fontWeight', yAxisStyle.fontWeight)
    .style('fontSize', yAxisStyle.fontSize)
    .attr('fill', yAxisStyle.textFill)
    .text(yAxis.title || '');
  const yG = g.append('g').call(
    d3
      .axisLeft(y)
      .ticks(Math.min(4, maxY))
      .tickSize(-chartWidth)
      .tickSizeOuter(0),
  );
  const bars = g
    .selectAll('.series')
    .data(stackedData)
    .enter()
    .append('g')
    .attr('class', 'series')
    .selectAll('g')
    .data(d => d)
    .enter();
  bars
    .append('rect')
    .attr('x', d => x(d[2].data.symbol))
    .attr('y', d => y(d[1]))
    .attr('fill', d => colors[d[2].key])
    .attr('height', d => y(d[0]) - y(d[1]))
    .attr('width', x.bandwidth())
    .on('mouseenter', d => {
      setTooltip(d[2].data.tooltips[d[2].key]);
    })
    .on('mouseleave', () => {
      setTooltip();
    })
    .classed('pointer', d => d[2].data.onClick)
    .on('click', d => {
      setTooltip();
      if (d[2].data.onClick) {
        d[2].data.onClick();
      }
    });
  yG.selectAll('path').style('stroke', 'none');
  yG.selectAll('line').style('stroke', yAxisStyle.stroke);
  yG
    .selectAll('text')
    .style('fontWeight', yAxisStyle.fontWeight)
    .style('fontSize', yAxisStyle.fontSize)
    .style('fill', yAxisStyle.textFill);

  return el.toReact();
};

export default withSize()(withTheme(withTooltip(FilteredStackedBarChart)));
