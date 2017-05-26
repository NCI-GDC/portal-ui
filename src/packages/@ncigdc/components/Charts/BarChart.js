// @flow

// Vender
import React from "react";
import * as d3 from "d3";
import ReactFauxDOM from "react-faux-dom";
import { compose, withState, pure } from "recompose";

// Custom
import { withTheme } from "@ncigdc/theme";
import { withTooltip } from "@ncigdc/uikit/Tooltip";
import "./style.css";

const BarChart = (() => ({
  data,
  title,
  yAxis = {},
  xAxis = {},
  styles,
  height: h,
  margin: m,
  bandwidth: bw,
  setTooltip,
  theme
}) => {
  const el = ReactFauxDOM.createElement("div");

  const margin = m || { top: 30, right: 50, bottom: 55, left: 30 };
  const bandWidth = bw || 36;
  const width =
    Object.keys(data).length * bandWidth + margin.left + margin.right;
  const height = (h || 200) - margin.top - margin.bottom;
  const yAxisStyle = yAxis.style || {
    textFill: theme.greyScale3,
    fontSize: "1.3rem",
    fontWeight: "500",
    stroke: theme.greyScale4
  };
  const xAxisStyle = xAxis.style || {
    textFill: theme.greyScale3,
    fontSize: "1.3rem",
    fontWeight: "700",
    stroke: theme.greyScale4
  };

  const x = d3
    .scaleBand()
    .domain(data.map(d => d.label))
    .rangeRound([0, width])
    .paddingInner(0.3)
    .paddingOuter(0.5);

  const y = d3
    .scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(data, d => d.value)]);

  const svg = d3
    .select(el)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g", "chart")
    .attr("fill", "#fff")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  svg
    .append("text")
    .attr("y", 0 - margin.top)
    .attr("x", width / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("fontSize", "1.1rem")
    .style("fontWeight", "500")
    .attr("fill", yAxisStyle.textFill)
    .text(title);

  const yG = svg
    .append("g")
    .call(d3.axisLeft(y).ticks(4).tickSize(-width).tickSizeOuter(0));

  yG.selectAll("path").style("stroke", "none");
  yG.selectAll("line").style("stroke", yAxisStyle.stroke);
  yG
    .selectAll("text")
    .style("fontSize", yAxisStyle.fontSize)
    .style("fill", yAxisStyle.textFill);

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("fontSize", yAxisStyle.fontSize)
    .style("fontWeight", yAxisStyle.fontWeight)
    .attr("fill", yAxisStyle.textFill)
    .text(yAxis.title || "");

  const xG = svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  xG
    .selectAll("text")
    .style("text-anchor", "end")
    .style("fontSize", xAxisStyle.fontSize)
    .style("fontWeight", xAxisStyle.fontWeight)
    .attr("fill", xAxisStyle.textFill)
    .attr("dx", "-1em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-45)");

  xG.selectAll("path").style("stroke", xAxisStyle.stroke);

  xG.selectAll("line").style("stroke", xAxisStyle.stroke);

  const barGs = svg
    .selectAll("g.chart")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "bar-g");

  const drawBar = barG => {
    barG
      .append("rect")
      .attr("class", "bar")
      .attr("fill", (styles.bars || { fill: "steelblue" }).fill)
      .attr("width", x.bandwidth())
      .attr("y", d => y(d.value))
      .attr("x", d => x(d.label))
      .attr("height", d => height - y(d.value))
      .on("click", d => {
        if (d.onClick) {
          d.onClick();
        }
      })
      .classed("pointer", d => d.onClick)
      .on("mouseenter", d => {
        setTooltip(d.tooltip);
      })
      .on("mouseleave", () => {
        setTooltip();
      });
  };

  barGs.each(function selectAndDraw() {
    drawBar(d3.select(this));
  });

  return el.toReact();
})();

export default compose(
  withTheme,
  withTooltip,
  withState("chart", "setState", <span />),
  pure
)(BarChart);
