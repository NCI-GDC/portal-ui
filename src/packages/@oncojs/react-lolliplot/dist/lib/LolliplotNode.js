'use strict';

exports.__esModule = true;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _reactFauxDom = require('react-faux-dom');

var _reactFauxDom2 = _interopRequireDefault(_reactFauxDom);

var _lodash = require('lodash.range');

var _lodash2 = _interopRequireDefault(_lodash);

var _attrs = require('./utils/attrs');

var _attrs2 = _interopRequireDefault(_attrs);

var _spatial = require('./utils/spatial');

var _uuid = require('./utils/uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _theme = require('./theme');

var _theme2 = _interopRequireDefault(_theme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*----------------------------------------------------------------------------*/

var Lolliplot = function Lolliplot() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      d3 = _ref.d3,
      data = _ref.data,
      collisions = _ref.collisions,
      height = _ref.height,
      width = _ref.width,
      _ref$domainWidth = _ref.domainWidth,
      domainWidth = _ref$domainWidth === undefined ? 500 : _ref$domainWidth,
      _ref$highlightedPoint = _ref.highlightedPointId,
      highlightedPointId = _ref$highlightedPoint === undefined ? '' : _ref$highlightedPoint,
      _ref$yAxisOffset = _ref.yAxisOffset,
      yAxisOffset = _ref$yAxisOffset === undefined ? 45 : _ref$yAxisOffset,
      _ref$xAxisOffset = _ref.xAxisOffset,
      xAxisOffset = _ref$xAxisOffset === undefined ? 40 : _ref$xAxisOffset,
      _ref$numXTicks = _ref.numXTicks,
      numXTicks = _ref$numXTicks === undefined ? 12 : _ref$numXTicks,
      _ref$onPointClick = _ref.onPointClick,
      onPointClick = _ref$onPointClick === undefined ? function () {} : _ref$onPointClick,
      _ref$onPointMouseover = _ref.onPointMouseover,
      onPointMouseover = _ref$onPointMouseover === undefined ? function () {} : _ref$onPointMouseover,
      _ref$onPointMouseout = _ref.onPointMouseout,
      onPointMouseout = _ref$onPointMouseout === undefined ? function () {} : _ref$onPointMouseout,
      _ref$getMutationTextC = _ref.getMutationTextColor,
      getMutationTextColor = _ref$getMutationTextC === undefined ? function () {
    return 'white';
  } : _ref$getMutationTextC,
      getPointColor = _ref.getPointColor,
      animating = _ref.animating,
      min = _ref.min,
      max = _ref.max,
      setClicked = _ref.setClicked;

  (0, _invariant2.default)(d3, 'You must pass in the d3 library, either v3 || v4');

  d3.selection.prototype.attrs = _attrs2.default;
  d3.scaleOrdinal = d3.scaleOrdinal || d3.scale.ordinal;
  d3.scaleLinear = d3.scaleLinear || d3.scale.linear;

  var root = _reactFauxDom2.default.createElement('div');

  (0, _invariant2.default)(root, 'Must provide an element or selector!');

  width = width || root.clientWidth;
  height = height || root.clientHeight;

  var uniqueSelector = (0, _uuid2.default)();
  var xAxisLength = width - yAxisOffset;
  var scale = xAxisLength / domainWidth;

  var visibleData = data.filter(function (d) {
    return d.x > min && d.x < max;
  });

  var scaleLinear = d3.scaleLinear().domain([min, max]).range([yAxisOffset, width]);

  var maxY = Math.max.apply(Math, visibleData.map(function (d) {
    return d.y;
  }));

  var highestValue = Math.max(10, maxY);

  var scaleLinearY = d3.scaleLinear().domain([-highestValue / numXTicks, highestValue]).range([height - xAxisOffset, 15]);

  // Main Chart

  var d3Root = d3.select(root).style('position', 'relative');

  var svg = d3Root.append('svg').attrs(Object.assign({
    class: 'chart'
  }, (0, _spatial.dim)(width, height))).on('mousedown', function () {
    setClicked(d3.event.offsetX);
  });

  // Chart clipPath

  svg.append('clipPath').attr('id', uniqueSelector + '-chart-clip').append('rect').attrs(Object.assign({
    x: yAxisOffset,
    y: 0
  }, (0, _spatial.dim)(xAxisLength, height - xAxisOffset)));

  // yAxis

  svg.append('g').append('line').attrs({
    class: 'yAxis',
    x1: yAxisOffset,
    y1: 0,
    x2: yAxisOffset,
    y2: height - xAxisOffset,
    stroke: _theme2.default.black
  });

  // yAxis label

  svg.append('text').text('# of Cases').attrs({
    x: 5,
    y: (height - xAxisOffset) / 2,
    'font-size': '11px',
    transform: 'rotate(270, 10, 124)'
  });

  // xAxis

  svg.append('g').append('line').attrs({
    class: 'xAxis',
    x1: yAxisOffset,
    y1: height - xAxisOffset,
    x2: width,
    y2: height - xAxisOffset,
    stroke: _theme2.default.black
  });

  svg.append('g').selectAll('line').data(data).enter().append('line').attrs({
    class: function _class(d) {
      return 'mutation-line-' + d.id;
    },
    'clip-path': 'url(#' + uniqueSelector + '-chart-clip)',
    x1: function x1(d) {
      return scaleLinear(d.x);
    },
    y1: height - xAxisOffset,
    x2: function x2(d) {
      return scaleLinear(d.x);
    },
    y2: function y2(d) {
      return scaleLinearY(d.y);
    },
    stroke: 'rgba(0, 0, 0, 0.2)'
  });

  svg.append('g').selectAll('circle').data(data).enter().append('circle').attrs({
    class: function _class(d) {
      return '\n        mutation-circle-' + d.id + ' ' + (d.id === highlightedPointId ? 'selected-mutation' : '');
    },
    'clip-path': 'url(#' + uniqueSelector + '-chart-clip)',
    cx: function cx(d) {
      return scaleLinear(d.x);
    },
    cy: function cy(d) {
      return scaleLinearY(d.y);
    },
    r: function r(d) {
      return _theme2.default.mutationRadius + Math.min((collisions[d.x + ',' + d.y] || []).length, 5);
    },
    fill: function fill(d) {
      return getPointColor ? getPointColor(d) : 'steelblue';
    }
  }).on('mouseover', function (d) {
    if (!animating) {
      if (onPointMouseover) {
        onPointMouseover(d, d3.event);
      }
    }
  }).on('mouseout', function (d) {
    if (!animating) {
      d3.select('.tooltip').style('left', '-9999px');
      if (onPointMouseout) onPointMouseout(d, d3.event);
    }
  }).on('mousedown', function (d) {
    return onPointClick(d, d3.event);
  });

  var TEXT_VOFFSET = 3.5;

  svg.append('g').selectAll('text').data(data.filter(function (d) {
    return collisions[d.x + ',' + d.y];
  })).enter().append('text').attrs({
    x: function x(d) {
      return scaleLinear(d.x);
    },
    y: function y(d) {
      return scaleLinearY(d.y) + TEXT_VOFFSET;
    },
    fill: function fill(d) {
      return getMutationTextColor(d);
    },
    fontSize: '10px',
    'text-anchor': 'middle',
    'pointer-events': 'none'
  }).text(function (d) {
    return collisions[d.x + ',' + d.y].length;
  });

  var selectedNode = data.filter(function (d) {
    return d.id === highlightedPointId;
  }).map(function (d) {
    return Object.assign({}, d, { size: _theme2.default.mutationRadius * 3 });
  });

  svg.append('g').selectAll('rect').data(selectedNode).enter().append('rect').attrs({
    class: 'selected-mutation-box',
    'clip-path': 'url(#' + uniqueSelector + '-chart-clip)',
    x: function x(d) {
      return scaleLinear(d.x) - d.size / 2;
    },
    y: function y(d) {
      return scaleLinearY(d.y) - d.size / 2;
    },
    width: function width(d) {
      return d.size;
    },
    height: function height(d) {
      return d.size;
    },
    fill: 'none',
    stroke: 'rgb(251, 94, 45)',
    'stroke-width': 2
  }).on('mouseover', function (d) {
    if (!animating) {
      if (onPointMouseover) {
        onPointMouseover(d, d3.event);
      }
    }
  }).on('mouseout', function (d) {
    if (!animating) {
      d3.select('.tooltip').style('left', '-9999px');
      if (onPointMouseout) onPointMouseout(d, d3.event);
    }
  }).on('click', function (d) {
    return onPointClick(d, d3.event);
  });

  svg.append('g').attr('class', 'yTicks');

  d3Root.select('.yTicks').append('g').selectAll('text').data((0, _lodash2.default)(1, highestValue, highestValue / 10)).enter().append('text').text(function (i) {
    return Math.round(i);
  }).attrs({
    class: function _class(i) {
      return 'yTick-text-' + i;
    },
    x: yAxisOffset - 10,
    y: function y(i) {
      return scaleLinearY(i) + 3;
    },
    'font-size': '11px',
    'text-anchor': 'end'
  });

  d3Root.select('.yTicks').append('g').selectAll('line').data((0, _lodash2.default)(1, highestValue, highestValue / 10)).enter().append('line').attrs({
    class: function _class(i) {
      return 'yTick-line-' + i;
    },
    x1: yAxisOffset - 7,
    y1: function y1(i) {
      return scaleLinearY(i);
    },
    x2: yAxisOffset,
    y2: function y2(i) {
      return scaleLinearY(i);
    },
    stroke: _theme2.default.black
  });

  // Horizontal ticks

  svg.append('g').attr('class', 'xTicks');

  var length = (max - min) / numXTicks;
  var olength = domainWidth / numXTicks;

  d3Root.select('.xTicks').append('g').selectAll('text').data((0, _lodash2.default)(numXTicks - 1).map(function (x) {
    return x + 1;
  })).enter().append('text').text(function (i) {
    return Math.round(length * i + min);
  }).attrs({
    class: function _class(i) {
      return 'xTick-text-' + i;
    },
    x: function x(i) {
      return olength * i * scale + yAxisOffset;
    },
    y: height - xAxisOffset + 20,
    'font-size': '11px',
    'text-anchor': 'middle',
    'pointer-events': 'none'
  });

  for (var i = 1; i < numXTicks; i++) {
    var _length = domainWidth / numXTicks;

    d3Root.select('.xTicks').append('line').attrs({
      class: 'xTick-line-' + i,
      x1: _length * i * scale + yAxisOffset,
      y1: height - xAxisOffset,
      x2: _length * i * scale + yAxisOffset,
      y2: height - xAxisOffset + 10,
      stroke: _theme2.default.black,
      'pointer-events': 'none'
    });
  }

  return root.toReact();
};

/*----------------------------------------------------------------------------*/

exports.default = Lolliplot;