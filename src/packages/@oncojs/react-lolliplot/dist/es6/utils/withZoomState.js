function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { Component } from 'react';

var withZoomState = function withZoomState(Wrapped) {
  return function (_Component) {
    _inherits(Lolliplot, _Component);

    function Lolliplot() {
      var _temp, _this, _ret;

      _classCallCheck(this, Lolliplot);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
        dragging: false,
        offsetX: 0,
        zoomStart: null
      }, _this.update = function (state) {
        return _this.setState(state);
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    Lolliplot.prototype.render = function render() {
      return Wrapped(Object.assign({
        _update: this.update
      }, this.state, this.props));
    };

    return Lolliplot;
  }(Component);
};

export default withZoomState;