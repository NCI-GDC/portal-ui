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

var Minimap = function Minimap() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      d3 = _ref.d3,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? 50 : _ref$height,
      width = _ref.width,
      _ref$domainWidth = _ref.domainWidth,
      domainWidth = _ref$domainWidth === undefined ? 500 : _ref$domainWidth,
      _ref$yAxisOffset = _ref.yAxisOffset,
      yAxisOffset = _ref$yAxisOffset === undefined ? 45 : _ref$yAxisOffset,
      min = _ref.min,
      max = _ref.max,
      dragging = _ref.dragging,
      sliding = _ref.sliding,
      _update = _ref._update,
      update = _ref.update,
      offsetX = _ref.offsetX,
      zoomStart = _ref.zoomStart,
      slideStartMin = _ref.slideStartMin,
      slideStartMax = _ref.slideStartMax,
      slideStart = _ref.slideStart;

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
  var scale = xAxisLength / domainWidth;

  var updateTargetMinimapZoom = function updateTargetMinimapZoom(_ref2) {
    var zoomX = _ref2.zoomX,
        zoomWidth = _ref2.zoomWidth,
        offsetX = _ref2.offsetX,
        difference = _ref2.difference;

    var draggingLeft = difference < 0;

    var targetMin = Math.max(0, draggingLeft ? (offsetX - yAxisOffset) / scale : (zoomX - yAxisOffset) / scale);

    var targetMax = Math.min(domainWidth, draggingLeft ? (offsetX - yAxisOffset + zoomWidth) / scale : (offsetX - yAxisOffset) / scale);

    return [targetMin, targetMax];
  };

  // Main Chart

  var d3Root = d3.select(root).style('position', 'relative');

  var svg = d3Root.append('svg').attrs(Object.assign({
    class: 'chart'
  }, (0, _spatial.dim)(width, height))).on('mousemove', function () {
    if (sliding) {
      var MAGIC_OFFSET_ADJUSTMENT = document.getElementById('lolliplot-container').getBoundingClientRect().left;

      var offset = d3.event.clientX - MAGIC_OFFSET_ADJUSTMENT;

      update({
        min: Math.max(0, slideStartMin + Math.round((offset - slideStart) / scale)),
        max: Math.min(domainWidth, slideStartMax + Math.round((offset - slideStart) / scale))
      });
    }
  }).on('mouseup', function () {
    if (sliding) {
      _update({ sliding: false });
    }

    if (dragging) {

      var difference = offsetX - zoomStart;

      // do not zoom if insignificant dragging distance
      if (Math.abs(difference) < 5) {
        _update({ dragging: false, draggingMinimap: false });
        return;
      }

      var _updateTargetMinimapZ = updateTargetMinimapZoom({
        zoomX: difference < 0 ? offsetX : zoomStart,
        zoomWidth: Math.abs(difference),
        offsetX: offsetX,
        difference: difference
      }),
          targetMin = _updateTargetMinimapZ[0],
          targetMax = _updateTargetMinimapZ[1];

      update({
        min: targetMin,
        max: targetMax
      });

      _update({
        dragging: false,
        draggingMinimap: false
      });
    }
  });

  var defs = svg.append('defs');

  // Chart clipPath

  defs.append('clipPath').attr('id', uniqueSelector + '-chart-clip').append('rect').attrs(Object.assign({
    x: yAxisOffset,
    y: 0
  }, (0, _spatial.dim)(xAxisLength, height)));

  svg.append('g').append('rect').attrs(Object.assign({
    class: 'minimap',
    x: yAxisOffset,
    y: 0
  }, (0, _spatial.dim)(xAxisLength, 50), {
    fill: 'rgba(0, 0, 0, 0)',
    cursor: 'text'
  })).on('mousedown', function () {
    var MAGIC_OFFSET_ADJUSTMENT = document.getElementById('lolliplot-container').getBoundingClientRect().left;

    _update({
      dragging: true,
      zoomStart: d3.event.clientX - MAGIC_OFFSET_ADJUSTMENT,
      offsetX: d3.event.clientX - MAGIC_OFFSET_ADJUSTMENT
    });
  }).on('mousemove', function () {
    if (dragging) {
      var MAGIC_OFFSET_ADJUSTMENT = document.getElementById('lolliplot-container').getBoundingClientRect().left;

      _update({
        offsetX: d3.event.clientX - MAGIC_OFFSET_ADJUSTMENT
      });
    }
  });

  svg.append('g').append('clipPath').attr('id', uniqueSelector + '-minimap-clip').append('rect').attrs(Object.assign({
    x: yAxisOffset,
    y: 0
  }, (0, _spatial.dim)(xAxisLength, 50)));

  svg.append('g').append('rect').attrs({
    class: 'minimap-zoom-area',
    x: min * scale + yAxisOffset + _spatial.halfPixel,
    y: _spatial.halfPixel,
    height: 50 - 1,
    width: Math.max(1, (max - min) * scale - 1),
    fill: 'rgba(0, 0, 0, 0)',
    'pointer-events': 'none'
  });

  if (dragging) {
    var difference = offsetX - zoomStart;

    svg.append('g').append('rect').attrs({
      'clip-path': 'url(#' + uniqueSelector + '-clip)',
      x: difference < 0 ? offsetX : zoomStart,
      y: 0,
      width: Math.abs(difference),
      height: 50,
      fill: 'rgba(83, 215, 88, 0.51)',
      cursor: 'text',
      'pointer-events': 'none'
    });
  }

  var minimapWidth = Math.max(1, (max - min) * scale - 1);

  svg.append('g').append('rect').attrs(Object.assign({
    class: 'minimap-slide-target',
    x: min * scale + yAxisOffset + _spatial.halfPixel + minimapWidth - 20,
    y: 5
  }, (0, _spatial.dim)(15, 15), {
    fill: 'rgb(255, 255, 255)',
    stroke: 'rgb(57, 57, 57)',
    cursor: 'move'
  })).on('mousedown', function () {
    var MAGIC_OFFSET_ADJUSTMENT = document.getElementById('lolliplot-container').getBoundingClientRect().left;

    _update({
      sliding: true,
      slideStart: d3.event.clientX - MAGIC_OFFSET_ADJUSTMENT,
      slideStartMin: min,
      slideStartMax: max
    });
  });

  svg.append('text').text('\u27FA').attrs({
    class: 'minimap-slide-target-arrow',
    x: min * scale + yAxisOffset + _spatial.halfPixel + minimapWidth - 19,
    y: 16,
    'font-size': '11px',
    'pointer-events': 'none'
  });

  return root.toReact();
};

/*----------------------------------------------------------------------------*/

exports.default = (0, _withZoomState2.default)(Minimap);