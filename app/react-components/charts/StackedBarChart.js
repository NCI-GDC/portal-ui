// Vender

import React from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';

// Custom
import './style.css';
let StackedBarChart = (() => {
  return ({ data, yAxis, styles, width = 450, height = 200 }) => {
    const el = ReactFauxDOM.createElement('div')

    const margin = {top: 10, right: 0, bottom: 55, left: 40};
    const x = d3.scaleBand()
      .rangeRound([0, width])
      .padding(0.1)
      .align(0.1)
      .domain(data.map(d => d.symbol));

    const y = d3.scaleLinear()
      .rangeRound([height, 0])
      .domain([0, d3.max(data, d => d.total)]);

    const allKeys = [...new Set(data.reduce((acc, d) => ([...acc, ...Object.keys(d)]), []))]
      .filter(v => v !== 'symbol' && v !== 'total' && v !== 'gene_id');
    const colors = d3.scaleOrdinal(d3.schemeCategory20);

    const stack = d3.stack()
    .keys(allKeys);

    const g = d3.select(el)
    .append("svg")
      .attr("width", width)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const stackedData = stack(data)
    .map(
      d => d.filter(d2 => !isNaN(d2[0]) && !isNaN(d2[1]))
      .map(d2 => d2.concat({key: d.key, index: d.index, data: d2.data}))
    );

    g.selectAll('.series')
    .data(stackedData)
    .enter().append('g')
      .attr('class', 'series')
    .selectAll('a')
    .data(d => d)
    .enter().append('a')
      .attr('xlink:href', d => `genes/${d[2].data.gene_id}`)
      .append('rect')
      .attr('x', d => x(d[2].data.symbol))
      .attr('y', d => y(d[1]))
      .attr('fill', d => colors(d[2].index))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
      .on('mouseenter', (d, i, nodes) => {
        d3.select('.global-tooltip')
          .classed('active', true)
          .html(`<b>${d[2].key}</b><br />${d[2].data[d[2].key]} cases affected`);
      })
      .on('mouseleave', d => {
        d3.select('.global-tooltip')
          .classed('active', false)
      })
      .on('click', d => {
        d3.select('.global-tooltip')
          .classed('active', false)
      });

    const xG = g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    xG.selectAll("text")
        .style("text-anchor", "end")
        .attr("fill", (styles.xAxis || { textFill : 'black' }).textFill)
        .attr("dx", "-1em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)")
      xG.selectAll("path")
        .style("stroke", (styles.xAxis || {stroke: 'black'}).stroke);
      xG.selectAll("line")
        .style("stroke", (styles.xAxis || {stroke: 'black'}).stroke);

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("fontSize", "1rem")
      .style("fontWeight", "300")
      .attr("fill", (styles.yAxis || { textFill: 'black' }).textFill)
      .text(yAxis.title || '');

    const yG = g.append("g")
      .call(d3.axisLeft(y).ticks(5));
    yG.selectAll("path")
    .style("stroke", (styles.yAxis || {stroke: 'black'}).stroke);
    yG.selectAll("line")
    .style("stroke", (styles.yAxis || {stroke: 'black'}).stroke)
    yG.selectAll("text")
    .style("fill", (styles.yAxis || {textFill: 'black'}).textFill)

    return el.toReact();
  }
})();

export default StackedBarChart;
