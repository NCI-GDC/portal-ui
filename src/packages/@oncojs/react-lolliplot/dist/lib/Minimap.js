'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _MinimapNode = require('./MinimapNode');

var _MinimapNode2 = _interopRequireDefault(_MinimapNode);

var _MinimapZoomAreaNode = require('./MinimapZoomAreaNode');

var _MinimapZoomAreaNode2 = _interopRequireDefault(_MinimapZoomAreaNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Minimap = function Minimap(_ref) {
  var _ref$height = _ref.height,
      height = _ref$height === undefined ? 50 : _ref$height,
      props = _objectWithoutProperties(_ref, ['height']);

  return _react2.default.createElement(
    'div',
    { style: { position: 'relative', height: height + 'px' } },
    _react2.default.createElement(
      'div',
      { style: { position: 'absolute' } },
      _react2.default.createElement(_MinimapNode2.default, _extends({
        height: height
      }, props))
    ),
    _react2.default.createElement(
      'div',
      { style: { position: 'absolute' } },
      _react2.default.createElement(_MinimapZoomAreaNode2.default, _extends({
        height: height
      }, props))
    )
  );
};

exports.default = Minimap;