'use strict';

exports.__esModule = true;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _reactFauxDom = require('react-faux-dom');

var _reactFauxDom2 = _interopRequireDefault(_reactFauxDom);

var _attrs = require('./utils/attrs');

var _attrs2 = _interopRequireDefault(_attrs);

var _spatial = require('./utils/spatial');

var _uuid = require('./utils/uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _withZoomState = require('./utils/withZoomState');

var _withZoomState2 = _interopRequireDefault(_withZoomState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*----------------------------------------------------------------------------*/

var ZoomAreaNode = function ZoomAreaNode() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      d3 = _ref.d3,
      height = _ref.height,
      width = _ref.width,
      _ref$domainWidth = _ref.domainWidth,
      domainWidth = _ref$domainWidth === undefined ? 500 : _ref$domainWidth,
      _ref$yAxisOffset = _ref.yAxisOffset,
      yAxisOffset = _ref$yAxisOffset === undefined ? 45 : _ref$yAxisOffset,
      _ref$xAxisOffset = _ref.xAxisOffset,
      xAxisOffset = _ref$xAxisOffset === undefined ? 40 : _ref$xAxisOffset,
      min = _ref.min,
      max = _ref.max,
      dragging = _ref.clicked,
      _update = _ref._update,
      update = _ref.update,
      offsetX = _ref.offsetX,
      _zoomState = _ref._zoomState;

  (0, _invariant2.default)(d3, 'You must pass in the d3 library, either v3 || v4');

  d3.selection.prototype.attrs = _attrs2.default;
  d3.scaleOrdinal = d3.scaleOrdinal || d3.scale.ordinal;
  d3.scaleLinear = d3.scaleLinear || d3.scale.linear;

  // Similar to a React target element
  var root = _reactFauxDom2.default.createElement('div');

  (0, _invariant2.default)(root, 'Must provide an element or selector!');

  width = width || root.clientWidth;
  height = height || root.clientHeight;

  var uniqueSelector = (0, _uuid2.default)();
  var xAxisLength = width - yAxisOffset;

  var updateTargetChartZoom = function updateTargetChartZoom(_ref2) {
    var zoomX = _ref2.zoomX,
        zoomWidth = _ref2.zoomWidth,
        offsetX = _ref2.offsetX,
        difference = _ref2.difference;

    var draggingLeft = difference < 0;

    var scale = d3.scaleLinear().domain([0, xAxisLength]).range([min, max]);

    var targetMin = Math.max(0, draggingLeft ? scale(offsetX - yAxisOffset) : scale(zoomX - yAxisOffset));

    var targetMax = Math.min(domainWidth, draggingLeft ? scale(offsetX + zoomWidth - yAxisOffset) : scale(offsetX - yAxisOffset));

    return [targetMin, targetMax];
  };

  // Main Chart

  var d3Root = d3.select(root).style('position', 'relative');

  var svg = d3Root.append('svg').attrs(Object.assign({
    class: 'chart'
  }, (0, _spatial.dim)(width, height))).on('mouseup', function () {
    if (dragging) {
      var actualOffset = offsetX || _zoomState;
      var difference = actualOffset - _zoomState;

      // do not zoom if insignificant dragging distance
      if (Math.abs(difference) < 5) {
        _update({ dragging: false, draggingMinimap: false });
        return;
      }

      if (dragging) {
        var _updateTargetChartZoo = updateTargetChartZoom({
          zoomX: difference < 0 ? actualOffset : _zoomState,
          zoomWidth: Math.abs(difference),
          offsetX: actualOffset,
          difference: difference
        }),
            targetMin = _updateTargetChartZoo[0],
            targetMax = _updateTargetChartZoo[1];

        update({
          min: targetMin,
          max: targetMax
        });
      }

      _update({
        dragging: false,
        offsetX: 0
      });
    }
  });

  svg.append('clipPath').attr('id', uniqueSelector + '-chart-clip').append('rect').attrs(Object.assign({
    x: yAxisOffset,
    y: 0
  }, (0, _spatial.dim)(xAxisLength, height - xAxisOffset)));

  svg.append('rect').attrs({
    class: uniqueSelector + '-chart-zoom-area',
    x: yAxisOffset,
    y: _spatial.halfPixel,
    width: xAxisLength,
    height: height - xAxisOffset - _spatial.halfPixel,
    fill: 'rgba(0, 0, 0, 0)'
  }).on('mousemove', function () {
    if (dragging) {
      var MAGIC_OFFSET_ADJUSTMENT = document.getElementById('lolliplot-container').getBoundingClientRect().left;

      _update({
        offsetX: d3.event.clientX - MAGIC_OFFSET_ADJUSTMENT
      });
    }
  });

  if (dragging) {
    var actualOffset = offsetX || _zoomState;
    var difference = actualOffset - _zoomState;

    svg.append('g').append('rect').attrs({
      class: 'zoom-shading',
      x: difference < 0 ? actualOffset : _zoomState,
      y: 0,
      width: Math.abs(difference),
      height: height - xAxisOffset,
      fill: 'rgba(214, 214, 214, 0.51)',
      cursor: 'text',
      "pointer-events": 'none'
    });
  }

  return root.toReact();
};

/*----------------------------------------------------------------------------*/

exports.default = (0, _withZoomState2.default)(ZoomAreaNode);