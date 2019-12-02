import $ from 'jquery';
import Konva from 'konva';

(function ($) {
	const plugin_name = 'InCHlib';
	const defaults = {};

	function InCHlib(element, options) {
    // basic plugin setup
		this.element = element;
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
		this._name = plugin_name;

		// start plugin
		this.init();
	}

	InCHlib.prototype.init = function () {
		this.element.innerHTML = 'boop';
  };

  $.fn[plugin_name] = function (options) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + plugin_name)) {
        // stop multiple instantiations
        $.data(this, 'plugin_' + plugin_name, new InCHlib(this, options));
      }
    });
  }
})(jQuery);