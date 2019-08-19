var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from 'react';
import MinimapNode from './MinimapNode';
import ZoomArea from './MinimapZoomAreaNode';

var Minimap = function Minimap(_ref) {
  var _ref$height = _ref.height,
      height = _ref$height === undefined ? 50 : _ref$height,
      props = _objectWithoutProperties(_ref, ['height']);

  return React.createElement(
    'div',
    { style: { position: 'relative', height: height + 'px' } },
    React.createElement(
      'div',
      { style: { position: 'absolute' } },
      React.createElement(MinimapNode, _extends({
        height: height
      }, props))
    ),
    React.createElement(
      'div',
      { style: { position: 'absolute' } },
      React.createElement(ZoomArea, _extends({
        height: height
      }, props))
    )
  );
};

export default Minimap;