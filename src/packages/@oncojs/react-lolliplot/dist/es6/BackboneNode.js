import React from "react";
import invariant from "invariant";
import ReactFauxDOM from "react-faux-dom";
import attrs from "./utils/attrs";
import { dim, halfPixel } from "./utils/spatial";
import uuid from "./utils/uuid";

/*----------------------------------------------------------------------------*/

var BackboneNode = function BackboneNode() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      d3 = _ref.d3,
      data = _ref.data,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? 75 : _ref$height,
      width = _ref.width,
      _ref$domainWidth = _ref.domainWidth,
      domainWidth = _ref$domainWidth === undefined ? 500 : _ref$domainWidth,
      _ref$yAxisOffset = _ref.yAxisOffset,
      yAxisOffset = _ref$yAxisOffset === undefined ? 45 : _ref$yAxisOffset,
      _ref$proteinDb = _ref.proteinDb,
      proteinDb = _ref$proteinDb === undefined ? "pfam" : _ref$proteinDb,
      _ref$onProteinClick = _ref.onProteinClick,
      onProteinClick = _ref$onProteinClick === undefined ? function () {} : _ref$onProteinClick,
      _ref$onProteinMouseov = _ref.onProteinMouseover,
      onProteinMouseover = _ref$onProteinMouseov === undefined ? function () {} : _ref$onProteinMouseov,
      _ref$onProteinMouseou = _ref.onProteinMouseout,
      onProteinMouseout = _ref$onProteinMouseou === undefined ? function () {} : _ref$onProteinMouseou,
      min = _ref.min,
      max = _ref.max,
      proteinMouseover = _ref.proteinMouseover;

  invariant(d3, "You must pass in the d3 library, either v3 || v4");

  d3.selection.prototype.attrs = attrs;
  d3.scaleOrdinal = d3.scaleOrdinal || d3.scale.ordinal;
  d3.scaleLinear = d3.scaleLinear || d3.scale.linear;

  // Similar to a React target element
  var root = ReactFauxDOM.createElement("div");

  invariant(root, "Must provide an element or selector!");

  width = width || root.clientWidth;

  var uniqueSelector = uuid();
  var xAxisLength = width - yAxisOffset;
  var scale = xAxisLength / domainWidth;

  // Main Chart

  var d3Root = d3.select(root).style("position", "relative");

  var svg = d3Root.append("svg").attrs(Object.assign({
    class: uniqueSelector + "-chart"
  }, dim(width, height)));

  var chart = d3Root.select("." + uniqueSelector + "-chart");

  // Backbone

  svg.append("g").append("rect").attrs({
    class: "xAxisBottom",
    x: yAxisOffset,
    y: Math.round(height / 2),
    width: width,
    height: 10,
    fill: "#d0d0d0"
  });

  chart.append("text").text(proteinDb).attrs({
    x: 5,
    y: 47,
    "font-size": "11px"
  });

  var scaleLinear = d3.scaleLinear().domain([min, max]).range([yAxisOffset, width]);

  var widthZoomRatio = domainWidth / Math.max(max - min, 0.00001);

  chart.append("g").selectAll("rect").data(data).enter().append("rect").attrs({
    class: function _class(d) {
      return "range-" + d.id + "-" + d.start + "-" + d.end;
    },
    x: function x(d) {
      return Math.max(yAxisOffset, scaleLinear(d.start)) + halfPixel;
    },
    y: Math.round(height / 2) - 7,
    width: function width(d) {
      var barWidth = (d.end - Math.max(d.start, min)) * widthZoomRatio * scale;
      return Math.max(0, barWidth - 1);
    },
    height: height - 50 - halfPixel,
    rx: 10,
    ry: 10,
    fill: function fill(d, i) {
      return d.getProteinColor ? d.getProteinColor() : "hsl(\n        " + i * 100 + ",\n        " + (proteinMouseover === d.id ? 85 : 80) + "%,\n        " + (proteinMouseover === d.id ? 55 : 40) + "%)\n      ";
    },
    stroke: function stroke(d, i) {
      return d.getProteinColor ? d.getProteinColor() : "hsl(\n        " + i * 100 + ",\n        " + (proteinMouseover === d.id ? 65 : 60) + "%,\n        " + (proteinMouseover === d.id ? 65 : 60) + "%)\n      ";
    },
    strokeWidth: 1
  }).style("cursor", "pointer").on("click", function (d) {
    if (onProteinClick) {
      onProteinClick(d);
    }
  }).on("mouseover", function (d) {
    if (onProteinMouseover) {
      onProteinMouseover(d, d3.event);
    }
  }).on("mouseout", function (d) {
    if (onProteinMouseout) {
      onProteinMouseout(d, d3.event);
    }
  });

  chart.append("g").attr("class", "protein-text-clip-path").selectAll("clipPath").data(data).enter().append("clipPath").attr("id", function (d) {
    return uniqueSelector + "-clip-range-" + d.id + "-" + d.start + "-" + d.end;
  }).append("rect").attrs({
    class: function _class(d) {
      return "clip-range-" + d.id + "-" + d.start + "-" + d.end + "-rect";
    },
    x: function x(d) {
      return Math.max(yAxisOffset, scaleLinear(d.start)) + halfPixel;
    },
    y: Math.round(height / 2) - 7,
    width: function width(d) {
      var barWidth = (d.end - Math.max(d.start, min)) * widthZoomRatio * scale;
      return Math.max(0, barWidth - 1);
    },
    height: height - 50 - halfPixel
  });

  chart.append("g").attrs({
    "clip-path": "url(#" + uniqueSelector + "-chart-clip)"
  }).selectAll("text").data(data).enter().append("text").text(function (d) {
    return d.id.toUpperCase();
  }).attrs({
    class: function _class(d) {
      return "protein-name-" + d.id + "-" + d.start + "-" + d.end;
    },
    "clip-path": function clipPath(d) {
      return "url(#" + uniqueSelector + "-clip-range-" + d.id + "-" + d.start + "-" + d.end + ")";
    },
    x: function x(d) {
      var barWidth = (d.end - Math.max(d.start, min)) * widthZoomRatio * scale;
      var x = scaleLinear(d.start);
      return (barWidth + yAxisOffset < yAxisOffset ? x : Math.max(yAxisOffset, x)) + 6;
    },
    y: height - 25,
    fill: "white",
    "font-size": "11px",
    "pointer-events": "none"
  });

  return root.toReact();
};

/*----------------------------------------------------------------------------*/

export default BackboneNode;