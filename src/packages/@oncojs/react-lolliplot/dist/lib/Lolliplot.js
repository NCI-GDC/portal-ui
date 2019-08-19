'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _LolliplotNode = require('./LolliplotNode');

var _LolliplotNode2 = _interopRequireDefault(_LolliplotNode);

var _ZoomAreaNode = require('./ZoomAreaNode');

var _ZoomAreaNode2 = _interopRequireDefault(_ZoomAreaNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var withClickedState = function withClickedState(Wrapped) {
  return function (_React$Component) {
    _inherits(_class2, _React$Component);

    function _class2() {
      var _temp, _this, _ret;

      _classCallCheck(this, _class2);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
        clicked: false,
        zoomStart: null
      }, _this.update = function (state) {
        return _this.setState(state);
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _class2.prototype.render = function render() {
      return Wrapped(Object.assign({
        setState: this.update
      }, this.state, this.props));
    };

    return _class2;
  }(_react2.default.Component);
};

var Lolliplot = function Lolliplot(_ref) {
  var _ref$height = _ref.height,
      height = _ref$height === undefined ? 250 : _ref$height,
      setState = _ref.setState,
      clicked = _ref.clicked,
      zoomStart = _ref.zoomStart,
      props = _objectWithoutProperties(_ref, ['height', 'setState', 'clicked', 'zoomStart']);

  return _react2.default.createElement(
    'div',
    {
      id: 'lolliplot-container',
      style: { position: 'relative', height: height + 'px' },
      onMouseUp: function onMouseUp() {
        return setState({ clicked: false, zoomStart: null });
      }
    },
    _react2.default.createElement(
      'div',
      {
        style: { position: 'absolute' }
      },
      _react2.default.createElement(_LolliplotNode2.default, _extends({
        height: height,
        setClicked: function setClicked(z) {
          return setState({ clicked: true, zoomStart: z });
        }
      }, props))
    ),
    _react2.default.createElement(
      'div',
      {
        style: {
          position: 'absolute',
          pointerEvents: clicked ? 'auto' : 'none'
        }
      },
      _react2.default.createElement(_ZoomAreaNode2.default, _extends({
        height: height,
        clicked: clicked,
        _zoomState: zoomStart
      }, props))
    )
  );
};

exports.default = withClickedState(Lolliplot);