/* eslint-disable */
/* tslint:disable */

import $ from 'jquery';
import Konva from 'konva';
import Color from 'color';
import { each, round } from 'lodash';

/**
  * InCHlib is an interactive JavaScript library which facilitates data
  * visualization and exploration by means of a cluster heatmap. InCHlib
  * is a versatile tool, and its use is not limited only to chemical or
  * biological data. Source code, tutorial, documentation, and example
  * data are freely available from InCHlib website <a
  * href="http://openscreen.cz/software/inchlib"
  * target=blank>http://openscreen.cz/software/inchlib</a>. At the
  * website, you can also find a Python script <a
  * href="http://openscreen.cz/software/inchlib/inchlib_clust"
  * target=blank>inchlib_clust</a> which performs data clustering and
  * prepares <a href="http://openscreen.cz/software/inchlib/input_format"
  * target=blank>input data for InCHlib</a>.
  *
  * @author <a href="mailto:ctibor.skuta@img.cas.cz">Ctibor Škuta</a>
  * @author <a href="mailto:petr.bartunek@img.cas.cz">Petr Bartůněk</a>
  * @author <a href="mailto:svozild@vscht.cz">Daniel Svozil</a>
  * @version 1.2.0
  * @category 1
  * @license InCHlib - Interactive Cluster Heatmap Library http://openscreen.cz/software/inchlib Copyright 2014, Ctibor Škuta, Petr Bartůněk, Daniel Svozil Licensed under the MIT license.
  *
  * Permission is hereby granted, free of charge, to any person
  * obtaining a copy of this software and associated documentation
  * files (the "Software"), to deal in the Software without
  * restriction, including without limitation the rights to use,
  * copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the
  * Software is furnished to do so, subject to the following
  * conditions:
  *
  * The above copyright notice and this permission notice shall be
  * included in all copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
  * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
  * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
  * OTHER DEALINGS IN THE SOFTWARE.
  *
  * @requires <a href='http://code.jquery.com/jquery-2.0.3.min.js'>jQuery Core 2.0.3</a>
  * @dependency <script language="JavaScript" type="text/javascript" src="http://code.jquery.com/jquery-2.0.3.min.js"></script>
  *
  * @requires <a href='https://konvajs.org/'>Konva</a>
  * @dependency <script language="JavaScript" type="text/javascript" src="http://openscreen.cz/software/inchlib/static/js/Konva.min.js"></script>
  *
  * @param {Object} options An object with the options for the InCHlib component.
  *
  * @option {string} target
  *   identifier of the DIV tag where the component should be displayed

  * @option {boolean} [column_dendrogram=false]
  *   turn on/off the column dendrogram

  * @option {boolean} [count_column=false]
  *   turn on/off the count column

  * @option {boolean} [dendrogram=true]
  *   turn on/off the row dendrogram

  * @option {string} [font.family="Trebuchet&nbsp;MS"]
  *   font family

  * @option {string} [heatmap_colors="Greens"]
  *   the heatmap color scale

  * @option {number} [heatmap_part_width=0.7]
  *   define the heatmap part width from the width of the whole graph

  * @option {string} [highlight_colors="Reds"]
  *   color scale for highlighted rows

  * @option {obejct} [highlighted_rows=[]]
  *   array of row IDs to highlight

  * @option {boolean} [independent_columns=true]
  *   determines whether the color scale is based on the values from all columns together or for each column separately

  * @option {number} [max_column_width=100]
  *   maximum column width in pixels

  * @option {number} [max_height=800]
  *   maximum graph height in pixels

  * @option {number} [max_row_height=25]
  *   maximum row height in pixels

  * @option {boolean} [metadata=false]
  *   turn on/off the metadata

  * @option {number} [min_row_height=false]
  *   minimum row height in pixels

  * @option {number} [width="the width of target DIV"]
  *   width of the graph in pixels

  * @option {boolean} [heatmap=true]
  *   turn on/off the heatmap

  * @option {string} [font.color="#3a3a3a"]
  *   the color of the text values in the heatmap

  * @option {boolean} [draw_row_ids=false]
  *   draws the row IDs next to the heatmap when there is enough space to visualize them

  * @option {boolean} [fixed_row_id_size=false]
  *   fixes the row id size on given number and extends the right margin of the visualization accordingly

  * @option {number} [max_percentile=100]
  *   the value percentile above which the color will be equal to the terminal color of the color scale

  * @option {number} [min_percentile=0]
  *   the value percentile below which the color will be equal to the beginning color of the color scale

  * @option {number} [middle_percentile=50]
  *   the value percentile which defines where the middle color of the color scale will be used

  * @option {array} [columns_order=[]]
  *   the order of columns defined by their indexes startin from 0, when not provided the columns are sorted in common order 0, 1, 2... etc.

  *
  * @example
  *   const options = {
  *     max_width: 800,
  *   }
  *  $(target).InCHlib(options);
  */

(function ($) {
  const plugin_name = 'InCHlib';

  const defaults = {
    categories: {
      colors: {},
      defaults: [],
    },
    column_dendrogram: false,
    column_metadata_colors: 'RdLrBu',
    column_metadata: false,
    columns_order: [],
    count_column: false,
    data: {},
    dendrogram: true,
    draw_row_ids: false,
    fixed_row_id_size: false,
    font: {
      color: '#3a3a3a',
      family: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      size: 12,
    },
    heatmap_colors: 'RdLrGr',
    heatmap_header: true,
    heatmap_part_width: 0.7,
    heatmap: true,
    highlight_colors: 'Oranges',
    highlighted_rows: [],
    independent_columns: true,
    max_column_width: 150,
    max_height: 800,
    max_percentile: 100,
    max_row_height: 25,
    max_width: 0,
    metadata: false,
    middle_percentile: 50,
    min_percentile: 0,
    min_row_height: 1,
    png_padding: 20,
    tooltip: {
      fill: '#fff',
      stroke: 'lightgrey',
      text_fill: 'grey',
    },
  };

  function InCHlib(element, options) {
    const self = this;

    // basic plugin setup
    self.element = element;
    self.$element = $(element);
    self.options = $.extend({}, defaults, options);
    self._name = plugin_name;
    self.$element.attr('id', self._name);

    // inchlib setup
    self.user_options = options || {};
    self.element.style.position = 'relative';
    const element_width = self.element.offsetWidth;

    self.options.width = self.options.max_width &&
      self.options.max_width < element_width
      ? self.options.max_width
      : element_width;
    
    self.options.legend_width = 170;

    self.options.width -= self.options.legend_width;

    self.options.stage_width = self.options.width + self.options.legend_width;

    self.$element.width(self.options.stage_width);

    self.options.heatmap_part_width = self.options.heatmap_part_width > 0.9
      ? 0.9
      : self.options.heatmap_part_width;

    self.header_height = 150;
    self.footer_height = 70;
    self.dendrogram_heatmap_distance = 5;

    self.min_size_draw_values = 20;
    self.column_metadata_row_height = self.min_size_draw_values;

    // control hover color with opacity
    self.hover_fill = '#3a3a3a';
    self.hover_opacity_off = 1;
    self.hover_opacity_on = 0.7;

    // column metadata colors & legend info
    self.MAX_DAYS_TO_DEATH = 3379;
    self.MAX_AGE_AT_DIAGNOSIS = 90;
    self.invalid_column_metadata_color = '#fff';
    self.age_dx_colors = {
      hue: 106,
      max_light: 88,
      min_light: 45,
      sat: 25,
    };

    self.get_days_to_death_color = val => {
      // create red & green values for RGB().
      // will result in a shade of blue.
      // higher value = darker blue.
      const red_green = Math.floor(255 - (val / self.MAX_DAYS_TO_DEATH * 255));
      return isNaN(red_green) // i.e. val is "not reported"
        ? self.invalid_column_metadata_color
        : `rgb(${red_green},${red_green},255)`;
    };

    self.get_age_at_diagnosis_color = val => {
      // create lightness value for HSL().
      // will result in a shade of green.
      // higher value = darker green.
      const percentage = 1 - (val / self.MAX_AGE_AT_DIAGNOSIS);
      const lightness = (percentage * (self.age_dx_colors.max_light - self.age_dx_colors.min_light)) + self.age_dx_colors.min_light;
      return isNaN(percentage) // i.e. val is "not reported"
        ? self.invalid_column_metadata_color
        : `hsl(${self.age_dx_colors.hue},${self.age_dx_colors.sat}%,${lightness}%)`;
    }

    self.legend_id = `legend_${self._name}`;
    self.legend_continuous_categories = ['Age at Diagnosis', 'Days to Death'];
    self.legend_horizontal_categories = ['Gender', 'Vital Status'];
    self.legend_headings = [
      ...Object.keys(self.options.categories.colors),
      ...self.legend_continuous_categories
    ]
    .sort();

    self.legend_gradients = {
      age: {
        max: `hsl(${self.age_dx_colors.hue},${self.age_dx_colors.sat}%,${self.age_dx_colors.min_light}%)`,
        min: `hsl(${self.age_dx_colors.hue},${self.age_dx_colors.sat}%,${self.age_dx_colors.max_light}%)`,
      },
      days: {
        max: 'rgb(0,0,255)',
        min: 'rgb(255,255,255)',
      },
    }

    self.legend_gradient_upper_value = name => name === 'Age at Diagnosis'
      ? self.MAX_AGE_AT_DIAGNOSIS
      : self.MAX_DAYS_TO_DEATH;

    /**
    * Default function definitions for the InCHlib events
    * @name InCHlib#events
    */
    self.events = {
      /**
        * @name InCHlib#row_onclick
        * @event
        * @param {function} function() callback function for click on the heatmap row event
        * @eventData {string} gene_ensembl, used to create a link to the gene page

        * @example
        * instance.events.row_onclick = (
        *    function(gene_ensembl) {
        *       alert(gene_ensembl);
        *    }
        * );
        *
        */
      row_onclick(gene_ensembl) {
        const clickInchlibLink = new CustomEvent('clickInchlibLink', {
          detail: {
            gene_ensembl
          },
        });
        self.element.dispatchEvent(clickInchlibLink);
      },
      /**
        * @name InCHlib#heatmap_header_onclick
        * @event
        * @param {function} function() callback function for click on the heatmap header event
        * @eventData {string} case_uuid, used to create a link to the case page

        * @example
        * instance.events.heatmap_header_onclick = (
        *    function(case_uuid) {
        *       alert(case_uuid);
        *    }
        * );
        *
        */
       heatmap_header_onclick(case_uuid) {
        const clickInchlibLink = new CustomEvent('clickInchlibLink', {
          detail: {
            case_uuid
          },
        });
        self.element.dispatchEvent(clickInchlibLink);
      },

    };

    /**
    * Default color scales
    * @name InCHlib#colors
    */
    self.colors = {
      YlGn: {
        start: {
          r: 255,
          g: 255,
          b: 204,
        },
        end: {
          r: 35,
          g: 132,
          b: 67,
        },
      },
      GnBu: {
        start: {
          r: 240,
          g: 249,
          b: 232,
        },
        end: {
          r: 43,
          g: 140,
          b: 190,
        },
      },
      BuGn: {
        start: {
          r: 237,
          g: 248,
          b: 251,
        },
        end: {
          r: 35,
          g: 139,
          b: 69,
        },
      },
      PuBu: {
        start: {
          r: 241,
          g: 238,
          b: 246,
        },
        end: {
          r: 5,
          g: 112,
          b: 176,
        },
      },
      BuPu: {
        start: {
          r: 237,
          g: 248,
          b: 251,
        },
        end: {
          r: 136,
          g: 65,
          b: 157,
        },
      },
      RdPu: {
        start: {
          r: 254,
          g: 235,
          b: 226,
        },
        end: {
          r: 174,
          g: 1,
          b: 126,
        },
      },
      PuRd: {
        start: {
          r: 241,
          g: 238,
          b: 246,
        },
        end: {
          r: 206,
          g: 18,
          b: 86,
        },
      },
      OrRd: {
        start: {
          r: 254,
          g: 240,
          b: 217,
        },
        end: {
          r: 215,
          g: 48,
          b: 31,
        },
      },
      Purples2: {
        start: {
          r: 242,
          g: 240,
          b: 247,
        },
        end: {
          r: 106,
          g: 81,
          b: 163,
        },
      },
      Blues: {
        start: {
          r: 239,
          g: 243,
          b: 255,
        },
        end: {
          r: 33,
          g: 113,
          b: 181,
        },
      },
      Greens: {
        start: {
          r: 237,
          g: 248,
          b: 233,
        },
        end: {
          r: 35,
          g: 139,
          b: 69,
        },
      },
      Oranges: {
        start: {
          r: 254,
          g: 237,
          b: 222,
        },
        end: {
          r: 217,
          g: 71,
          b: 1,
        },
      },
      Reds: {
        start: {
          r: 254,
          g: 229,
          b: 217,
        },
        end: {
          r: 203,
          g: 24,
          b: 29,
        },
      },
      Greys: {
        start: {
          r: 200,
          g: 200,
          b: 200,
        },
        end: {
          r: 20,
          g: 20,
          b: 20,
        },
      },
      PuOr: {
        start: {
          r: 230,
          g: 97,
          b: 1,
        },
        end: {
          r: 94,
          g: 60,
          b: 153,
        },
      },
      BrBG: {
        start: {
          r: 166,
          g: 97,
          b: 26,
        },
        end: {
          r: 1,
          g: 133,
          b: 113,
        },
      },
      RdBu: {
        start: {
          r: 202,
          g: 0,
          b: 32,
        },
        end: {
          r: 5,
          g: 113,
          b: 176,
        },
      },
      RdGy: {
        start: {
          r: 202,
          g: 0,
          b: 32,
        },
        end: {
          r: 64,
          g: 64,
          b: 64,
        },
      },
      BuYl: {
        start: {
          r: 5,
          g: 113,
          b: 176,
        },
        end: {
          r: 250,
          g: 233,
          b: 42,
        },
      },
      YlOrR: {
        start: {
          r: 255,
          g: 255,
          b: 178,
        },
        end: {
          r: 227,
          g: 26,
          b: 28,
        },
        middle: {
          r: 204,
          g: 76,
          b: 2,
        },
      },
      YlOrB: {
        start: {
          r: 255,
          g: 255,
          b: 212,
        },
        end: {
          r: 5,
          g: 112,
          b: 176,
        },
        middle: {
          r: 204,
          g: 76,
          b: 2,
        },
      },
      PRGn2: {
        start: {
          r: 123,
          g: 50,
          b: 148,
        },
        end: {
          r: 0,
          g: 136,
          b: 55,
        },
        middle: {
          r: 202,
          g: 0,
          b: 32,
        },
      },
      PiYG2: {
        start: {
          r: 208,
          g: 28,
          b: 139,
        },
        end: {
          r: 77,
          g: 172,
          b: 38,
        },
        middle: {
          r: 255,
          g: 255,
          b: 178,
        },
      },
      YlGnBu: {
        start: {
          r: 255,
          g: 255,
          b: 204,
        },
        end: {
          r: 34,
          g: 94,
          b: 168,
        },
        middle: {
          r: 35,
          g: 132,
          b: 67,
        },
      },
      RdYlBu: {
        start: {
          r: 215,
          g: 25,
          b: 28,
        },
        end: {
          r: 44,
          g: 123,
          b: 182,
        },
        middle: {
          r: 255,
          g: 255,
          b: 178,
        },
      },
      RdYlGn: {
        start: {
          r: 215,
          g: 25,
          b: 28,
        },
        end: {
          r: 26,
          g: 150,
          b: 65,
        },
        middle: {
          r: 255,
          g: 255,
          b: 178,
        },
      },
      BuWhRd: {
        start: {
          r: 33,
          g: 113,
          b: 181,
        },
        middle: {
          r: 255,
          g: 255,
          b: 255,
        },
        end: {
          r: 215,
          g: 25,
          b: 28,
        },
      },
      RdLrBu: {
        start: {
          r: 215,
          g: 25,
          b: 28,
        },
        middle: {
          r: 254,
          g: 229,
          b: 217,
        },
        end: {
          r: 44,
          g: 123,
          b: 182,
        },
      },
      RdBkGr: {
        start: {
          r: 215,
          g: 25,
          b: 28,
        },
        middle: {
          r: 0,
          g: 0,
          b: 0,
        },
        end: {
          r: 35,
          g: 139,
          b: 69,
        },
      },
      RdLrGr: {
        start: {
          r: 215,
          g: 25,
          b: 28,
        },
        middle: {
          r: 254,
          g: 229,
          b: 217,
        },
        end: {
          r: 35,
          g: 139,
          b: 69,
        },
      },
    };

    /**
    * Push the chart down to make room for the toolbar
    * @name InCHlib#toolbar_distance
    */
    self.toolbar_distance = 75;

    /**
    * Default Konvajs objects references
    * @name InCHlib#objects_ref
    */
    self.objects_ref = {
      tooltip_label: new Konva.Label({
        opacity: 1,
        listening: false,
      }),

      tooltip_tag: new Konva.Tag({
        cornerRadius: 4,
        fill: self.options.tooltip.fill,
        id: 'testing-testing',
        lineJoin: 'round',
        listening: false,
        pointerHeight: 10,
        pointerWidth: 18,
        stroke: self.options.tooltip.stroke,
        strokeWidth: 2,
      }),

      tooltip_text: new Konva.Text({
        fontFamily: self.options.font.family,
        fontSize: 10,
        padding: 8,
        fill: self.options.tooltip.text_fill,
        listening: false,
        align: 'center',
        lineHeight: 1.2,
      }),

      node: new Konva.Line({
        stroke: 'grey',
        strokeWidth: 2,
        lineCap: 'square',
        lineJoin: 'round',
        listening: false,
      }),

      node_rect: new Konva.Rect({
        fill: '#fff',
        opacity: 0,
      }),

      heatmap_value: new Konva.Text({
        fontFamily: self.options.font.family,
        fill: self.hover_fill,
        listening: false,
        fontStyle: '500',
      }),

      heatmap_line: new Konva.Line({
        lineCap: 'butt',
      }),

      column_header: new Konva.Text({
        fontFamily: self.options.font.family,
        fill: self.hover_fill,
        opacity: self.hover_opacity_off,
      }),

      count: new Konva.Text({
        fontSize: 10,
        fill: '#6d6b6a',
        fontFamily: self.options.font.family,
        listening: false,
      }),

      cluster_overlay: new Konva.Rect({
        fill: '#fff',
        opacity: 0.5,
      }),

      cluster_border: new Konva.Line({
        stroke: self.hover_fill,
        strokeWidth: 1,
        dash: [6, 2],
      }),

      zoom_icon: new Konva.Text({
        align: 'center',
        fill: '#333',
        fontFamily: 'FontAwesome',
        fontSize: 14,
        height: 28,
        text: String.fromCharCode('0xf00e'),
        verticalAlign: 'middle',
        width: 40,
      }),

      layer_below_toolbar: new Konva.Layer({
        y: self.toolbar_distance,
      })
    };

    /**
    * Creates color steps for the heatmap.
    * @name InCHlib#color_steps
    */
    self.color_steps = [
      0,
      self._get_color_for_value(0, 0, 1, 0.5, self.options.heatmap_colors),
      .5,
      self._get_color_for_value(0.5, 0, 1, 0.5, self.options.heatmap_colors),
      1,
      self._get_color_for_value(1, 0, 1, 0.5, self.options.heatmap_colors),
    ];

    /**
    * Gets 5 values to display next to the heatmap scale.
    * @name InCHlib#get_scale_values
    */
    self.get_scale_values = () => {
      const [min, max, mid] = self.data_descs_all;
      return [
        min,
        (((mid - min) / 2) + min),
        mid,
        (((max - mid) / 2) + mid),
        max,
      ]
      .map(x => round(x, 1).toFixed(1));
    };

    /**
    * Info for the toolbar buttons.
    * @name InCHlib#toolbar_buttons
    */
    self.toolbar_buttons = [
      {
        fa_icon: 'fa-undo',
        label: 'Reset',
        id: 'reset',
      },
      {
        fa_icon: 'fa-paint-brush',
        label: 'Edit Heatmap Colors',
        id: 'edit_heatmap_colors',
      },
      {
        fa_icon: 'fa-bars',
        label: 'Edit Categories',
        id: 'edit_categories',
      },
      {
        fa_icon: 'fa-download',
        label: 'Download',
        id: 'download',
      },
      {
        fa_icon: ['fa-caret-down','fa-caret-up'],
        label: 'Legend',
        id: 'legend',
      }
    ];

    self.dendrogram_active_color = '#F5273C';

    // start plugin
    self.init();
  }

  // MODALS

  InCHlib.prototype._draw_modal = function (modal_title, modal_content, has_close_btn = false) {
    const self = this;
    const overlay = self._draw_overlay();
    const cancel_id = 'inchlib_cancel';
    const save_id = 'inchlib_save';

    const modal_btn = $('<button />', {
      'class': 'inchlib-modal_actions-btn',
      'type': 'button',
    });

    const modal_actions = [
      modal_btn.clone()
        .attr('id', cancel_id)
        .text(has_close_btn 
          ? 'Close' 
          : 'Cancel'),
      ...has_close_btn || modal_btn.clone()
        .attr('id', save_id)
        .text('Save')
    ];

    const modal = $('<div />', { 'class': 'inchlib-modal'}).append(
      $('<h2 />', { text: modal_title }),
      $('<div />',{ 'class': 'inchlib-modal_content' })
        .append(modal_content),
      $('<div />', {'class': 'inchlib-modal_actions' })
        .append(modal_actions)
    );

    self.$element.append(modal);

    $(`#${cancel_id}`).click(function(e) {
      e.preventDefault();
      overlay.trigger('click');
    });

    overlay.click(function() {
      overlay.fadeOut().remove();
      $('.inchlib-modal').remove();
    });
  };

  InCHlib.prototype._draw_categories_modal = function () {
    const self = this;
    const modal_title = 'Edit Categories';
    const form_id = `${self._name}_categories_form`;

    const categories_form = $(`<form id='${form_id}'></form>`);

    const options = ['<ul class="inchlib-modal_categories-form_list">']
      .concat(self.column_metadata.feature_names
        .map((category, i) => {
          const key = category.toLowerCase().split(' ').join('-');
          const id = `${self._name}_${key}`;
          const checked = self.column_metadata.visible[i]
            ? ' checked'
            : '';
          return `<li class="inchlib-modal_categories-form_list-item"><input type='checkbox' id='${id}' class='inchlib-modal_categories-form_input' name='inchlib-edit-categories' value='${category}'${checked}/><label for='${id}' class='inchlib-modal_categories-form_label'>${category}</label></li>`;
        })
      )
      .concat('</ul>')
      .join('');

    categories_form.html(options);

    self._draw_modal(modal_title, categories_form);

    $('#inchlib_save').click(function(e) {
      e.preventDefault();
      const categories_updated = [];

      $.each($(`#${form_id} input[name="inchlib-edit-categories"]`),
        function() {
          categories_updated.push($(this).is(':checked'));
        }
      );
      self.column_metadata.visible = categories_updated;
      $('.inchlib_overlay').trigger('click');
      self.redraw();
    });
  };

  InCHlib.prototype._draw_heatmap_modal = function () {
    const self = this;
    const modal_title = 'Edit Heatmap Colors';
    const form_id = `${self._name}_heatmap_form`;

    const color_scales = Object.keys(self.colors).map(color => {
      const color_1 = self._get_color_for_value(0, 0, 1, 0.5, color);
      const color_2 = self._get_color_for_value(0.5, 0, 1, 0.5, color);
      const color_3 = self._get_color_for_value(1, 0, 1, 0.5, color);
      const checked = self.options.heatmap_colors === color;
      const scale = $(`<label class="inchlib-modal_heatmap-label"><input type="radio" class="inchlib-modal_heatmap-input" name="inchlib-color-scale" value="${color}"${checked ? ' checked' : ''}><div class="inchlib-modal_heatmap-gradient" style="background: linear-gradient(to right, ${color_1},${color_2},${color_3})"></div></label>`);
      return scale;
    });

    const heatmap_form = $(`<form id='${form_id}' class="inchlib-modal_heatmap-form"></form>`).append(color_scales);

    self._draw_modal(modal_title, heatmap_form);

    $('#inchlib_save').click(function(e) {
      e.preventDefault();
      const color = $(`#${form_id} input:checked`).val();
      const settings = { heatmap_colors: color };
      self.update_settings(settings);
      self.redraw_heatmap();
      self._update_color_scale();
      $('.inchlib-overlay').trigger('click');
    });
  };

  InCHlib.prototype._update_user_options = function (options) {
    const self = this;
    const updated_options = {};
    let key;

    for (var i = 0, keys = Object.keys(options), len = keys.length; i < len; i++) {
      key = keys[i];
      if (self.user_options[key] !== undefined &&
        self.user_options[key] !== options[key] &&
        self.user_options[key] === true) {
        updated_options[key] = false;
      } else if (self.user_options[key] === undefined) {
        updated_options[key] = options[key];
      }
    }
    $.extend(self.options, updated_options);
  };

  /**
    * Read data from JSON variable.
    *
    * @param {object} [variable] Clustering in proper JSON format.
    */
  InCHlib.prototype.read_data = function (json) {
    const self = this;
    self.json = json;
    self.data = self.json.data;

    const options = {};
    if (json.metadata !== undefined) {
      self.metadata = json.metadata;
      options.metadata = true;
    } else {
      options.metadata = false;
    }
    if (json.column_dendrogram !== undefined) {
      self.column_dendrogram = json.column_dendrogram;
      options.column_dendrogram = true;
    } else {
      options.column_dendrogram = false;
    }
    if (json.column_metadata !== undefined) {
      self.column_metadata = json.column_metadata;
      self.column_metadata.visible = Array(self.column_metadata.features.length)
        .fill(true);
      options.column_metadata = true;
    } else {
      options.column_metadata = false;
    }

    self._update_user_options(options);
    self._add_prefix();
  };

  InCHlib.prototype._add_prefix = function () {
    const self = this;
    self.data.nodes = self._add_prefix_to_data(self.data.nodes);
    var id;

    if (self.options.metadata) {
      const metadata = {};
      for (var i = 0, keys = Object.keys(self.metadata.nodes), len = keys.length; i < len; i++) {
        id = [self._name, keys[i]].join('#');
        metadata[id] = self.metadata.nodes[keys[i]];
      }
      self.metadata.nodes = metadata;
    }

    if (self.column_dendrogram) {
      self.column_dendrogram.nodes = self._add_prefix_to_data(self.column_dendrogram.nodes);
    }
  };

  InCHlib.prototype._add_prefix_to_data = function (data) {
    const self = this;
    let id;
    const prefixed_data = {};

    for (let i = 0, keys = Object.keys(data), len = keys.length; i < len; i++) {
      id = [self._name, keys[i]].join('#');
      prefixed_data[id] = data[keys[i]];

      if (prefixed_data[id].parent !== undefined) {
        prefixed_data[id].parent = [self._name, prefixed_data[id].parent].join('#');
      }

      if (prefixed_data[id].count != 1) {
        prefixed_data[id].left_child = [self._name, prefixed_data[id].left_child].join('#');
        prefixed_data[id].right_child = [self._name, prefixed_data[id].right_child].join('#');
      }
    }
    return prefixed_data;
  };

  InCHlib.prototype._get_root_id = function (nodes) {
    let root_id;
    for (let i = 0, keys = Object.keys(nodes), len = keys.length; i < len; i++) {
      if (nodes[keys[i]].parent === undefined) {
        root_id = keys[i];
        break;
      }
    }
    return root_id;
  };

  InCHlib.prototype._get_dimensions = function () {
    const self = this;
    const dimensions = {
      data: 0,
      metadata: 0,
      overall: 0,
    };
    let key;
    const keys = Object.keys(self.data.nodes);

    for (var i = 0; i < keys.length; i++) {
      key = keys[i];
      if (self.data.nodes[key].count == 1) {
        dimensions.data = self.data.nodes[key].features.length;
        break;
      }
    }

    if (self.options.metadata) {
      key = keys[0];
      dimensions.metadata = self.metadata.nodes[key].length;
    }

    dimensions.overall = dimensions.data + dimensions.metadata;
    return dimensions;
  };

  InCHlib.prototype._get_min_max_middle = function (data) {
    const self = this;
    const min_max_middle = [];
    let all = [];

    for (var i = 0; i < data.length; i++) {
      all = all.concat(data[i].filter((x) => { return x !== null; }));
    }

    const len = all.length;
    all.sort((a, b) => { return a - b; });
    min_max_middle.push((self.options.min_percentile > 0)
      ? all[self._hack_round(len * self.options.min_percentile / 100)]
      : Math.min.apply(null, all));
    min_max_middle.push((self.options.max_percentile < 100)
      ? all[self._hack_round(len * self.options.max_percentile / 100)]
      : Math.max.apply(null, all));
    min_max_middle.push((self.options.middle_percentile != 50)
      ? all[self._hack_round(len * self.options.middle_percentile / 100)]
      : all[self._hack_round((len - 1) / 2)]);
    return min_max_middle;
  };

  InCHlib.prototype._get_data_min_max_middle = function (data, axis) {
    const self = this;
    if (axis === undefined) {
      axis = 'column';
    }

    let value;
    let len;
    let columns;
    const data_rows = data.length;
    const data_cols = data[0].length;
    if (axis === 'column') {
      columns = [];

      for (var i = 0; i < data_cols; i++) {
        columns.push([]);
      }

      for (var i = 0; i < data_rows; i++) {
        for (var j = 0; j < data_cols; j++) {
          value = data[i] && data[i][j];
          if (value !== false &&
            value !== null &&
            value !== undefined) {
            columns[j].push(value);
          }
        }
      }
    } else {
      columns = data.slice(0);
    }

    const data2descs = {};
    let min;
    let max;
    let middle;

    for (var i = 0; i < columns.length; i++) {
      if (self._is_number(columns[i][0])) {
        columns[i] = columns[i].map(parseFloat);
        columns[i].sort((a, b) => { return a - b; });
        len = columns[i].length;
        max = (self.options.max_percentile < 100)
          ? columns[i][self._hack_round(len * self.options.max_percentile / 100)]
          : Math.max.apply(null, columns[i]);
        min = (self.options.min_percentile > 0)
          ? columns[i][self._hack_round(len * self.options.min_percentile / 100)]
          : Math.min.apply(null, columns[i]);
        middle = (self.options.middle_percentile != 50)
          ? columns[i][self._hack_round(len * self.options.middle_percentile / 100)]
          : columns[i][self._hack_round((len - 1) / 2)];
        data2descs[i] = {
          min,
          max,
          middle,
        };
      } else {
        const hash_object = self._get_hash_object(columns[i]);
        min = 0;
        max = self._hack_size(hash_object) - 1;
        middle = max / 2;
        data2descs[i] = {
          min,
          max,
          middle,
          str2num: hash_object,
        };
      }
    }

    return data2descs;
  };

  InCHlib.prototype._get_hash_object = function (array) {
    let count = 0;
    const hash_object = {};

    for (var i = 0; i < array.length; i++) {
      if (hash_object[array[i]] === undefined) {
        hash_object[array[i]] = count;
        count++;
      }
    }
    return hash_object;
  };

  InCHlib.prototype._get_max_length = function (items) {
    const lengths = items.map((x) => { return (`${x}`).length; });
    const max = Math.max.apply(Math, lengths);
    return max;
  };

  InCHlib.prototype._get_max_value_length = function () {
    const self = this;
    let { nodes } = self.data;
    let max_length = 0;
    let node_data;
    let key;

    const keys = Object.keys(nodes);
    for (var i = 0; i < keys.length; i++) {
      key = keys[i];
      if (nodes[key].count == 1) {
        node_data = nodes[key].features;
        for (var j = 0, len_2 = node_data.length; j < len_2; j++) {
          if ((`${node_data[j]}`).length > max_length) {
            max_length = (`${node_data[j]}`).length;
          }
        }
      }
    }
    if (self.options.metadata) {
      nodes = self.metadata.nodes;
      const keys = Object.keys(nodes);
      for (var i = 0; i < keys.length; i++) {
        key = keys[i];
        node_data = nodes[key];
        for (var j = 0, len_2 = node_data.length; j < len_2; j++) {
          if ((`${node_data[j]}`).length > max_length) {
            max_length = (`${node_data[j]}`).length;
          }
        }
      }
    }
    return max_length;
  };

  InCHlib.prototype._preprocess_heatmap_data = function () {
    const self = this;
    const heatmap_array = [];
    let j = 0;
    let key;
    let len;
    let data;
    let node;

    const keys = Object.keys(self.data.nodes);

    for (var i = 0; i < keys.length; i++) {
      key = keys[i];
      node = self.data.nodes[key];
      if (node.count == 1) {
        data = node.features;
        heatmap_array.push([key]);
        heatmap_array[j].push.apply(heatmap_array[j], data);
        if (self.options.metadata) {
          heatmap_array[j].push.apply(heatmap_array[j], self.metadata.nodes[key]);
        }
        j++;
      }
    }
    return heatmap_array;
  };

  InCHlib.prototype._reorder_heatmap = function (column_index) {
    const self = this;
    self.leaves_y_coordinates = {};
    column_index++;

    if (self.ordered_by_index == column_index) {
      self.heatmap_array.reverse();
    } else if (self._is_number(self.heatmap_array[0][column_index])) {
      self.heatmap_array.sort((a, b) => {
        return (a[column_index] == null)
          ? -1
          : (b[column_index] == null)
            ? 1
            : a[column_index] - b[column_index];
      });
    } else {
      self.heatmap_array.sort((a, b) => {
        return (a[column_index] == null)
          ? -1
          : (b[column_index] == null)
            ? 1
            : (a[column_index] > b[column_index])
              ? 1
              : (a[column_index] < b[column_index])
                ? -1
                : 0;
      });
    }

    let y = self.pixels_for_leaf / 2 + self.header_height;

    for (var i = 0; i < self.heatmap_array.length; i++) {
      self.leaves_y_coordinates[self.heatmap_array[i][0]] = y;
      y += self.pixels_for_leaf;
    }

    self.ordered_by_index = column_index;
  };

  /**
  * Draw already read data (from file/JSON variable).
  */
  InCHlib.prototype.draw = function () {
    const self = this;
    self.zoomed_clusters = {
      row: [],
      column: [],
    };
    self.last_highlighted_cluster = null;
    self.current_object_ids = [];
    self.current_column_ids = [];
    self.highlighted_rows_y = [];
    self.heatmap_array = self._preprocess_heatmap_data();
    self.on_features = {
      data: [],
      metadata: [],
      count_column: [],
    };

    self.column_metadata_rows = self.options.column_metadata
      ? self.column_metadata.visible.filter(x => x).length
      : 0;
    self.column_metadata_height = (self.column_metadata_rows * self.column_metadata_row_height) + 15;

    if (self.options.heatmap) {
      self.active_column = null;
      self.active_header_column = null;
      self.dimensions = self._get_dimensions();
      self._set_heatmap_settings();
    } else {
      self.dimensions = {
        data: 0,
        metadata: 0,
        overall: 0,
      };
      self.options.heatmap_header = false;
      self.options.column_dendrogram = false;
    }
    self._adjust_leaf_size(self.heatmap_array.length);
  
    self.right_margin = 100;

    self._adjust_horizontal_sizes();
    self.top_heatmap_distance = self.header_height + self.column_metadata_height + self.column_metadata_row_height / 2;

    if (self.options.column_dendrogram && self.heatmap_header) {
      self.footer_height = 150;
    }

    self.stage = new Konva.Stage({
      // this has to be a javascript selector, not a jquery one
      container: self.element,
    });

    self.options.height = self.heatmap_array.length * self.pixels_for_leaf + self.header_height + self.footer_height;

    self.stage.setWidth(self.options.stage_width);
    self.stage.setHeight(self.options.height);
    self._draw_stage_layer();

    self._draw_dendrogram_layers();
    self.root_id = self._get_root_id(self.data.nodes);
    self._draw_row_dendrogram(self.root_id);

    if (self.options.column_dendrogram && self.options.dendrogram) {
      self.column_root_id = self._get_root_id(self.column_dendrogram.nodes);
      self.nodes2columns = false;
      self.columns_start_index = 0;
      self._draw_column_dendrogram(self.column_root_id);
    }
    
    self._draw_heatmap();
    self._draw_heatmap_header();
    self._draw_navigation();
    self.highlight_rows(self.options.highlighted_rows);
    self._draw_heatmap_scale();
  };

  InCHlib.prototype._draw_dendrogram_layers = function () {
    const self = this;
    self.cluster_layer = self.objects_ref.layer_below_toolbar.clone();
    self.dendrogram_hover_layer = self.objects_ref.layer_below_toolbar.clone();
    self.stage.add(self.cluster_layer, self.dendrogram_hover_layer);

    self.cluster_layer.on('click', (evt) => {
      self.unhighlight_cluster();
      self.unhighlight_column_cluster();
    });
  };

  InCHlib.prototype._draw_row_dendrogram = function (node_id) {
    const self = this;
    self.dendrogram_layer = self.objects_ref.layer_below_toolbar.clone();
    const node = self.data.nodes[node_id];
    const { count } = node;

    self.distance_step = self.distance / node.distance;
    self.leaves_y_coordinates = {};
    self.objects2leaves = {};

    self._adjust_leaf_size(count);
    self.options.height = count * self.pixels_for_leaf + self.header_height + self.footer_height + self.column_metadata_height + self.toolbar_distance - 40;

    self.stage.setWidth(self.options.stage_width);
    self.stage.setHeight(self.options.height);

    let current_left_count = 0;
    let current_right_count = 0;
    const y = self.header_height + self.column_metadata_height + self.pixels_for_leaf / 2;

    if (node.count > 1) {
      current_left_count = self.data.nodes[node.left_child].count;
      current_right_count = self.data.nodes[node.right_child].count;
    }
    self._draw_row_dendrogram_node(node_id, node, current_left_count, current_right_count, 0, y);
    self.middle_item_count = (self.min_item_count + self.max_item_count) / 2;
    self.stage.add(self.dendrogram_layer);

    console.log(self.dendrogram_layer);

    self._bind_dendrogram_hover_events(self.dendrogram_layer);

    self.dendrogram_layer.on('click', function (evt) {
      self._dendrogram_layers_click(this, evt);
    });

    self.dendrogram_layer.on('mousedown', function (evt) {
      self._dendrogram_layers_mousedown(this, evt);
    });

    self.dendrogram_layer.on('mouseup', function (evt) {
      self._dendrogram_layers_mouseup(this, evt);
    });
  };

  InCHlib.prototype._draw_row_dendrogram_node = function (node_id, node, current_left_count, current_right_count, x, y) {
    const self = this;
    if (node.count != 1) {
      const node_neighbourhood = self._get_node_neighbourhood(node, self.data.nodes);
      const right_child = self.data.nodes[node.right_child];
      const left_child = self.data.nodes[node.left_child];
      const y1 = self._get_y1(node_neighbourhood, current_left_count, current_right_count);
      let y2 = self._get_y2(node_neighbourhood, current_left_count, current_right_count);
      let x1 = self._hack_round(self.distance - self.distance_step * node.distance);
      x1 = (x1 == 0) ? 2 : x1;


      const x2 = x1;
      const left_distance = self.distance - self.distance_step * self.data.nodes[node.left_child].distance;
      const right_distance = self.distance - self.distance_step * self.data.nodes[node.right_child].distance;

      if (right_child.count == 1) {
        y2 += self.pixels_for_leaf / 2;
      }

      self.dendrogram_layer.add(self._draw_horizontal_path(node_id, x1, y1, x2, y2, left_distance, right_distance));
      self._draw_row_dendrogram_node(node.left_child, left_child, current_left_count - node_neighbourhood.left_node.right_count, current_right_count + node_neighbourhood.left_node.right_count, left_distance, y1);
      self._draw_row_dendrogram_node(node.right_child, right_child, current_left_count + node_neighbourhood.right_node.left_count, current_right_count - node_neighbourhood.right_node.left_count, right_distance, y2);
    } else {
      const { objects } = node;
      self.leaves_y_coordinates[node_id] = y;

      for (var i = 0; i < objects.length; i++) {
        self.objects2leaves[objects[i]] = node_id;
      }

      const count = node.objects.length;
      if (count < self.min_item_count) {
        self.min_item_count = count;
      }
      if (count > self.max_item_count) {
        self.max_item_count = count;
      }
    }
  };

  InCHlib.prototype._draw_stage_layer = function () {
    const self = this;
    const { height, png_padding, width } = self.options;
    self.stage_layer = new Konva.Layer();
    // drawing a large white background for PNG download.

    // PADDING
    const padding = png_padding * 2;
    const move_bg_to_center = png_padding * -1;

    // HEIGHT
    const min_height = 700;
    const get_height = height < min_height
      ? min_height
      : height;
    const fill_bg_gap = 130;
    const bg_height = get_height + self.toolbar_distance + padding + fill_bg_gap;

    // WIDTH
    const legend_width = 160;
    // the legend for PNG view is off-stage, to the right.
    // the bg has to be extended for it.
    const bg_width = width + legend_width + padding;

    const stage_bg = new Konva.Rect({
      fill: '#fff',
      height: bg_height,
      opacity: 1,
      width: bg_width,
      x: move_bg_to_center,
      y: move_bg_to_center,
    });
    self.stage_layer.add(stage_bg);
    stage_bg.moveToBottom();
    self.stage.add(self.stage_layer);

    self.stage_layer.on('click', (evt) => {
      self.unhighlight_cluster();
      self.unhighlight_column_cluster();
    });
  };

  InCHlib.prototype._draw_column_dendrogram = function (node_id) {
    const self = this;
    self.column_dendrogram_layer = self.objects_ref.layer_below_toolbar.clone();
    self.column_x_coordinates = {};
    const node = self.column_dendrogram.nodes[node_id];
    self.current_column_count = node.count;
    self.vertical_distance = self.header_height;
    self.vertical_distance_step = self.vertical_distance / node.distance;

    self.last_highlighted_column_cluster = null;
    const current_left_count = self.column_dendrogram.nodes[node.left_child].count;
    const current_right_count = self.column_dendrogram.nodes[node.right_child].count;
    self._draw_column_dendrogram_node(node_id, node, current_left_count, current_right_count, 0, 0);
    self.stage.add(self.column_dendrogram_layer);

    if (!self.nodes2columns) {
      self.nodes2columns = self._get_nodes2columns();
    }

    self._bind_dendrogram_hover_events(self.column_dendrogram_layer);

    self.column_dendrogram_layer.on('click', function (evt) {
      self._column_dendrogram_layers_click(this, evt);
    });

    self.column_dendrogram_layer.on('mousedown', function (evt) {
      self._column_dendrogram_layers_mousedown(this, evt);
    });

    self.column_dendrogram_layer.on('mouseup', function (evt) {
      self._dendrogram_layers_mouseup(this, evt);
    });
  };

  InCHlib.prototype._get_nodes2columns = function () {
    const self = this;
    const coordinates = [];
    const coordinates2nodes = {};
    const nodes2columns = {};
    let key; let value;

    const keys = Object.keys(self.column_x_coordinates);
    for (var i = 0; i < keys.length; i++) {
      key = keys[i];
      value = self.column_x_coordinates[key];
      coordinates2nodes[value] = key;
      coordinates.push(value);
    }
    coordinates.sort((a, b) => { return a - b; });

    for (var i = 0; i < coordinates.length; i++) {
      nodes2columns[coordinates2nodes[coordinates[i]]] = i;
    }
    return nodes2columns;
  };

  InCHlib.prototype._bind_dendrogram_hover_events = function (layer) {
    const self = this;

    layer.on('mouseover', function (evt) {
      self._cursor_mouseover();
      self._dendrogram_layers_mouseover(this, evt);
    });

    layer.on('mouseout', function (evt) {
      self._cursor_mouseout();
      self._dendrogram_layers_mouseout(this, evt);
    });
  };

  InCHlib.prototype._delete_layers = function (to_destroy, to_remove_children) {
    const self = this;
    for (var i = 0; i < to_destroy.length; i++) {
      if (to_destroy[i] !== undefined) {
        to_destroy[i].destroy();
      }
    }

    if (to_remove_children !== undefined) {
      for (var i = 0; i < to_remove_children.length; i++) {
        to_remove_children[i].removeChildren();
        to_remove_children[i].draw();
      }
    }
  };

  InCHlib.prototype._delete_all_layers = function () {
    const self = this;
    self.stage.destroyChildren();
  };

  InCHlib.prototype._adjust_leaf_size = function (leaves) {
    const self = this;
    self.pixels_for_leaf = (self.options.max_height - self.header_height - self.footer_height - self.column_metadata_height - 5) / leaves;

    if (self.options.draw_row_ids && self.options.fixed_row_id_size) {
      self.options.min_row_height = self.options.fixed_row_id_size + 2;
    }

    if (self.pixels_for_leaf > self.options.max_row_height) {
      self.pixels_for_leaf = self.options.max_row_height;
    }

    if (self.options.min_row_height > self.pixels_for_leaf) {
      self.pixels_for_leaf = self.options.min_row_height;
    }
  };

  InCHlib.prototype._adjust_horizontal_sizes = function (dimensions) {
    const self = this;
    if (dimensions === undefined) {
      dimensions = self._get_visible_count();
    }

    if (self.options.dendrogram) {
      if (self.options.heatmap) {
        self.heatmap_width = (self.options.width - self.right_margin - self.dendrogram_heatmap_distance) * self.options.heatmap_part_width;
      } else {
        self.heatmap_width = 0;
      }

      self.pixels_for_dimension = (dimensions > 0 && self.heatmap_width > 0) ? self.heatmap_width / dimensions : 0;
      if (self.pixels_for_dimension === 0) {
        self.heatmap_width = 0;
      }

      self.distance = self.options.width - self.heatmap_width - self.right_margin;
      self.heatmap_distance = self.distance + self.dendrogram_heatmap_distance;
    } else {
      self.heatmap_width = self.options.width - self.right_margin;
      self.distance = self.right_margin / 2;
      self.heatmap_distance = self.distance;
      self.pixels_for_dimension = dimensions ? self.heatmap_width / dimensions : 0;
    }

    if (self.options.max_column_width && self.options.max_column_width < self.pixels_for_dimension) {
      self.pixels_for_dimension = self.options.max_column_width;
      self.heatmap_width = dimensions * self.pixels_for_dimension;

      if (self.options.dendrogram) {
        self.distance = self.options.width - self.heatmap_width - self.right_margin - self.dendrogram_heatmap_distance;
        self.heatmap_distance = self.distance + self.dendrogram_heatmap_distance;
      } else {
        self.distance = self._hack_round((self.options.width - self.heatmap_width) / 2);
        self.right_margin = self.distance;
        self.heatmap_distance = self.distance;
      }
    }
  };

  InCHlib.prototype._set_color_settings = function () {
    const self = this;
    let data = [];
    const keys = Object.keys(self.data.nodes);
    let node;
    for (var i = 0; i < keys.length; i++) {
      node = self.data.nodes[keys[i]];
      if (node.count == 1) {
        data.push(node.features);
      }
    }

    self.data_descs = {};
    self.data_descs_all = self._get_min_max_middle(data);

    if (self.options.independent_columns) {
      self.data_descs = self._get_data_min_max_middle(data);
    } else {
      for (var i = 0; i < self.dimensions.data; i++) {
        self.data_descs[i] = {
          min: self.data_descs_all[0],
          max: self.data_descs_all[1],
          middle: self.data_descs_all[2],
        };
      }
    }

    if (self.options.metadata) {
      const metadata = [];

      for (var i = 0; i < keys.length; i++) {
        metadata.push(self.metadata.nodes[keys[i]]);
      }
      self.metadata_descs = self._get_data_min_max_middle(metadata);
    }
  };

  InCHlib.prototype._set_heatmap_settings = function () {
    const self = this;
    let keys;
    let key;
    let node;

    self.header = [];
    for (var i = 0; i < self.dimensions.overall; i++) {
      self.header.push('');
    }

    if (self.options.columns_order.length === 0 || self.options.columns_order.length !== self.dimensions.data) {
      self.options.columns_order = [];
      for (var i = 0; i < self.dimensions.data; i++) {
        self.options.columns_order.push(i);
      }
    }

    if (self.options.metadata) {
      for (i = self.dimensions.data; i < self.dimensions.data + self.dimensions.metadata; i++) {
        self.options.columns_order.push(i);
      }
    }

    if (self.options.count_column) {
      self.options.columns_order.push(self.options.columns_order.length);
    }

    self.features = {};

    for (var i = 0; i < self.options.columns_order.length; i++) {
      self.features[i] = true;
    }

    self._set_on_features();

    self.heatmap_header = false;
    self.metadata_header = false;
    self.current_label = null;

    self._set_color_settings();

    if (self.data.feature_names !== undefined) {
      self.heatmap_header = self.data.feature_names;
    }

    if (self.heatmap_header) {
      for (var i = 0; i < self.dimensions.data; i++) {
        self.header[i] = self.heatmap_header[self.on_features.data[i]];
      }
    }

    if (self.options.metadata) {
      if (self.metadata.feature_names) {
        self.metadata_header = self.metadata.feature_names;

        for (var i = 0; i < self.dimensions.metadata; i++) {
          self.header[self.dimensions.data + i] = self.metadata_header[i];
        }
      }
    }

    if (self.options.column_metadata) {
      if (self.column_metadata.feature_names !== undefined) {
        self.column_metadata_header = self.column_metadata.feature_names
          .filter((x, i) => self.column_metadata.visible[i]);
      }
    }

    if (self.options.count_column) {
      self.max_item_count = 1;
      self.min_item_count = 1;
      self.dimensions.overall++;
      self.header.push('Count');
    }

    self._adjust_horizontal_sizes();
    self.top_heatmap_distance = self.header_height + self.column_metadata_height + self.column_metadata_row_height / 2;
  };

  InCHlib.prototype._set_on_features = function (features) {
    const self = this;
    let key;
    if (features === undefined) {
      var features = [];
      for (var i = 0, keys = Object.keys(self.features), len = keys.length; i < len; i++) {
        key = keys[i];
        if (self.features[key]) {
          features.push(self.options.columns_order[i]);
        }
      }
    }

    self.on_features = {
      data: [],
      metadata: [],
      count_column: [],
    };

    for (var i = 0, len = features.length; i < len; i++) {
      key = features[i];
      if (key < self.dimensions.data) {
        self.on_features.data.push(key);
      } else if (key <= self.dimensions.data + self.dimensions.metadata - 1) {
        self.on_features.metadata.push(key - self.dimensions.data);
      } else {
        self.on_features.count_column.push(0);
      }
    }
  };

  InCHlib.prototype._draw_column_metadata = function (x1) {
    const self = this;

    const visible_features = self.column_metadata.features
      .filter((x, i) => self.column_metadata.visible[i]);

    if (visible_features.length > 0) {
      const visible_feature_names = self.column_metadata.feature_names
      .filter((x, i) => self.column_metadata.visible[i]);
      self.column_metadata_descs = self._get_data_min_max_middle(visible_features, 'row');
      let y1 = self.header_height + 0.5 * self.column_metadata_row_height;

      for (var i = 0; i < visible_features.length; i++) {
        const heatmap_row = self._draw_column_metadata_row(visible_features[i], visible_feature_names[i], i, x1, y1);
        self.heatmap_layer.add(heatmap_row);
        self._bind_row_events(heatmap_row);
        y1 += self.column_metadata_row_height;
      }
    }
  };

  InCHlib.prototype._draw_heatmap = function () {
    const self = this;
    if (!self.options.heatmap) {
      return;
    }

    let y;
    let key;

    self.heatmap_layer = self.objects_ref.layer_below_toolbar.clone();
    self.heatmap_overlay = self.objects_ref.layer_below_toolbar.clone();

    self.current_draw_values = true;
    self.max_value_length = self._get_max_value_length();
    self.value_font_size = self._get_font_size(self.max_value_length, self.pixels_for_dimension, self.pixels_for_leaf, 12);

    if (self.pixels_for_leaf < self.min_size_draw_values) {
      self.current_draw_values = false;
    }

    const x1 = self.heatmap_distance;

    for (var i = 0, keys = Object.keys(self.leaves_y_coordinates), len = keys.length; i < len; i++) {
      key = keys[i];
      y = self.leaves_y_coordinates[key];
      const heatmap_row = self._draw_heatmap_row(key, x1, y);
      self.heatmap_layer.add(heatmap_row);
      self._bind_row_events(heatmap_row);
    }

    if (self.options.column_metadata) {
      self._draw_column_metadata(x1);
    }

    self.highlighted_rows_layer = self.objects_ref.layer_below_toolbar.clone();
    self.stage.add(self.heatmap_layer, self.heatmap_overlay, self.highlighted_rows_layer);

    self.highlighted_rows_layer.moveToTop();
    self.row_overlay = self.objects_ref.heatmap_line.clone();
    self.column_overlay = self.objects_ref.heatmap_line.clone();

    self.heatmap_layer.on('mouseleave', (evt) => {
      self.last_header = null;
      self.heatmap_overlay.destroyChildren();
      self.heatmap_overlay.draw();
    });
  };

  InCHlib.prototype._draw_heatmap_row = function (node_id, x1, y1) {
    const self = this;
    const node = self.data.nodes[node_id];
    const row = new Konva.Group({ id: node_id });
    let x2;
    let y2;
    let color;
    let line;
    let value;
    let text;
    let text_value;
    let col_index;
  
    const [ gene_ensembl, gene_symbol ] = self.metadata.nodes[node_id];
  
    // draw heatmap cells
    for (var i = 0, len = self.on_features.data.length; i < len; i++) {
      col_index = self.on_features.data[i];
      x2 = x1 + self.pixels_for_dimension;
      y2 = y1;
      value = node.features[col_index];
      text_value = value;
  
      if (value !== null) {
        color = self._get_color_for_value(value, self.data_descs[col_index].min, self.data_descs[col_index].max, self.data_descs[col_index].middle, self.options.heatmap_colors);
  
        line = self.objects_ref.heatmap_line.clone({
          stroke: color,
          points: [
            x1,
            y1,
            x2,
            y2,
          ],
          value: text_value,
          column: ['d', col_index].join('_'),
          gene_symbol,
          // gene_symbol for heatmap cell tooltip
          strokeWidth: self.pixels_for_leaf,
        });
        row.add(line);
      }
  
      x1 = x2;
    }
  
    // don't draw gene symbol column if it's empty
    x2 = x1;
    y2 = y1;
  
    if (self.current_draw_values) {
      text = self.objects_ref.heatmap_value.clone({
        text: gene_symbol,
        fontSize: self.options.font.size,
      });
      const width = text.getWidth();
      x2 = x1 + width + 10;
      
      line = self.objects_ref.heatmap_line.clone({
        // gene_ensembl for creating links
        gene_ensembl,
        points: [
          x1,
          y1,
          x2,
          y2,
        ],
        // gene_symbol for gene column tooltip
        name: gene_symbol,
        column: ['m', 1].join('_'),
        strokeWidth: self.pixels_for_leaf,
        opacity: 1 - self.hover_opacity_off,
        // this hover is being controlled by having an overlay
        // on top of the text
        stroke: '#fff',
      });
  
      const y = self._hack_round(y1 - self.value_font_size / 2);
      text.position({
        x: x1 + 5,
        y,
      });
      row.add(text, line);
      row.on('click', ({ target: { attrs: { gene_ensembl = '' }}}) => {
        if (gene_ensembl !== '') {
          self.events.row_onclick(gene_ensembl);
        }
      });
    }
    x1 = x2;
  
    return row;
  };

  InCHlib.prototype._get_column_metadata_color = function (title, text_value) {
    const self = this;
    return title === 'Days to Death'
      ? self.get_days_to_death_color(text_value)
      : title === 'Age at Diagnosis'
        ? self.get_age_at_diagnosis_color(text_value)
        : self.options.categories.colors[title][text_value] ||
          self.invalid_column_metadata_color;
  };

  InCHlib.prototype._draw_column_metadata_row = function (data, title, row_index, x1, y1) {
    const self = this;
    const row = new Konva.Group({ class: 'column_metadata' });
    let x2; let y2; let color; let line; let value; let text; let text_value; let width; let
      col_index;
    const str2num = self.column_metadata_descs[row_index].str2num !== undefined;

    for (let i = 0; i < self.on_features.data.length; i++) {
      col_index = self.on_features.data[i];
      value = data[col_index];
      text_value = value;

      if (str2num) {
        value = self.column_metadata_descs[row_index].str2num[value];
      }

      const color = self._get_column_metadata_color(title, text_value);

      x2 = x1 + self.pixels_for_dimension;
      y2 = y1;

      line = self.objects_ref.heatmap_line.clone({
        strokeWidth: self.column_metadata_row_height,
        stroke: color,
        // category value
        name: text_value,
        points: [
          x1,
          y1,
          x2,
          y2,
        ],
        column: ['cm', row_index].join('_'),
      });
      row.add(line);
      x1 = x2;
    }
    // add the category name
    text = self.objects_ref.heatmap_value.clone({
      text: title,
      fontSize: self.options.font.size,
    });

    const y = self._hack_round(y1 - self.value_font_size / 2);
    text.position({
      x: x1 + 5,
      y,
    });
    row.add(text);

    return row;
  };

  InCHlib.prototype._bind_row_events = function (row) {
    const self = this;
    row.on('mouseenter', (evt) => {
      self._row_mouseenter(evt);
    });

    row.on('mouseleave', (evt) => {
      self._row_mouseleave(evt);
    });

    row.on('mouseover', (evt) => {
      const { target: { attrs: { column = '' }}} = evt;
      const is_gene_symbol_column = column === 'm_1';
      if (is_gene_symbol_column) {
        evt.target.opacity(1 - self.hover_opacity_on);
        self.heatmap_layer.draw();
        self._cursor_mouseover();
      }
      self._draw_col_label(evt);
    });

    row.on('mouseout', (evt) => {
      const { target: { attrs: { column = '' }}} = evt;
      const is_gene_symbol_column = column === 'm_1';
      if (is_gene_symbol_column) {
        evt.target.opacity(1 - self.hover_opacity_off);
        self.heatmap_layer.draw();
        self._cursor_mouseout();
      }
      self.heatmap_overlay.find('#col_label')[0].destroy();
      self.heatmap_overlay.find('#column_overlay')[0].destroy();
      self.heatmap_overlay.draw();
    });

    row.on('click', (evt) => {
      const row_id = evt.target.parent.attrs.id;
      if (evt.target.parent.attrs.class !== 'column_metadata') {
        const items = self.data.nodes[row_id].objects;
        const item_ids = [];
        for (var i = 0; i < items.length; i++) {
          item_ids.push(items[i]);
        }
      }
    });
  };

  InCHlib.prototype._draw_heatmap_header = function () {
    // the header goes at the bottom
    // because we're using a dendrogram on top
    const self = this;
    if (
      self.options.heatmap_header &&
      self.header.length > 0 &&
      self.pixels_for_dimension >= self.min_size_draw_values
    ) {
      self.header_layer = self.objects_ref.layer_below_toolbar.clone();
      const count = self._hack_size(self.leaves_y_coordinates);
      const y = (self.options.column_dendrogram && self.heatmap_header)
        ? self.header_height + (self.pixels_for_leaf * count) + 15 + self.column_metadata_height
        : self.header_height - 20;
      const rotation = 90;
      let distance_step = 0;
      let key;
      const current_headers = [];

      for (var i = 0, len = self.on_features.data.length; i < len; i++) {
        current_headers.push(self.header[self.on_features.data[i]]);
      }

      for (var i = 0, len = self.on_features.metadata.length; i < len; i++) {
        current_headers.push(self.header[self.on_features.metadata[i] + self.dimensions.data]);
      }
      if (self.options.count_column && self.features[self.dimensions.overall - 1]) {
        current_headers.push(self.header[self.dimensions.overall - 1]);
      }
      const max_text_length = self._get_max_length(current_headers);

      for (var i = 0, len = current_headers.length; i < len; i++) {
        const skip_column = ['gene_ensembl', 'gene_symbol']
          .includes(current_headers[i]);
        if (skip_column) {
          continue;
        }
        // TODO this is not great. we should ask backend devs to provide
        // id and uuid in an object.
        const [ case_id, case_uuid ] = current_headers[i].split('_');
        const x = (self.heatmap_distance + distance_step * self.pixels_for_dimension + self.pixels_for_dimension / 2) + 5;
        const column_header = self.objects_ref.column_header.clone({
          fill: self.hover_fill,
          fontFamily: self.options.font.family,
          fontSize: self.options.font.size,
          fontStyle: '500',
          position_index: i,
          rotation,
          text: case_id,
          x,
          y,
        });
        const rect_height = column_header.getWidth() + 10;
        const rect_x = self.heatmap_distance + (self.pixels_for_dimension * distance_step);
        const rect_y = y - 5;
        var rect = new Konva.Rect({
          case_uuid,
          width: self.pixels_for_dimension,
          height: rect_height,
          fill: '#fff',
          x: rect_x,
          y: rect_y,
          opacity: 1 - self.hover_opacity_off,
        });
        self.header_layer.add(column_header, rect);
        distance_step++;
      }

      self.stage.add(self.header_layer);

      self.header_layer.on('click', ({ target: { attrs: { case_uuid }}}) => {
        self.events.heatmap_header_onclick(case_uuid);
      });

      self.header_layer.on('mouseover', function (evt) {
        self._draw_col_overlay_for_header(evt);
        self._cursor_mouseover();
        const label = evt.target;
        label.setOpacity(1 - self.hover_opacity_on);
        this.draw();
      });

      self.header_layer.on('mouseout', function (evt) {
        self.column_overlay.destroy();
        self.heatmap_overlay.draw();
        self._cursor_mouseout();
        const label = evt.target;
        label.setOpacity(1 - self.hover_opacity_off);
        self.active_header_column = null;
        this.draw();
      });
    }
  };

  InCHlib.prototype._draw_col_overlay_for_header = function(evt) {
    const self = this;
    const { case_uuid, x, y } = evt.target.attrs;

    if (self.active_header_column !== case_uuid) {
      const overlayX = x + (self.pixels_for_dimension / 2);
      self.column_overlay.destroy();
      self.active_header_column = case_uuid;
      self.column_overlay = self.objects_ref.heatmap_line.clone({
        points: [
          overlayX,
          self.header_height,
          overlayX,
          self.header_height + 10 + self.column_metadata_height + (self.heatmap_array.length) * self.pixels_for_leaf,
        ],
        strokeWidth: self.pixels_for_dimension,
        stroke: '#fff',
        opacity: 0.3,
        listening: false,
        id: 'column_overlay',
      });
      self.heatmap_overlay.add(self.column_overlay);
      self.heatmap_overlay.moveToTop();
      self.heatmap_overlay.draw();
    }
  };

  InCHlib.prototype._draw_toolbar = function () {
    const self = this;

    const toolbar_ul = $(`<ul class="inchlib-toolbar"></ul>`);
    const toolbar_buttons = self.toolbar_buttons.map(btn => {
      const is_button_disabled = btn.id === 'reset' && (self.zoomed_clusters.row.length === 0 && self.zoomed_clusters.column.length === 0);
      const open_button = `<li class="inchlib-toolbar_item"><button type="button" class="inchlib-toolbar_btn inchlib-toolbar_btn-${btn.id}${is_button_disabled ? ' inchlib-toolbar_btn-disabled' :''}" data-inchlib-id="${btn.id}" data-inchlib-tooltip="${btn.label}">`;
      const close_button = '</button></li>';
      const contents = btn.id === 'legend'
      ? `${btn.label}<i class="fa ${btn.fa_icon[0]}"></i>`
      : `<i class="fa ${btn.fa_icon}"></i>`;
      return `${open_button}${contents}${close_button}`;
    })
    .join('');

    toolbar_ul.html(toolbar_buttons);
    self.$element.append(toolbar_ul);

    $('.inchlib-toolbar_btn')
      .mouseover(function () {
        const $this = $(this);
        if ($this.attr('data-inchlib-id') !== 'legend') {
          self._toolbar_mouseover($this);
        }
      })
      .mouseout(function() {
        if ($(this).attr('data-inchlib-id') !== 'legend') {
          self._toolbar_mouseout();
        }
      })
      .click(function() {
        if (!$(this).hasClass('inchlib-toolbar_btn-disabled')) {
          self._toolbar_click($(this));
        }
      })
  };

  InCHlib.prototype._toolbar_click = function (button) {
    const self = this;
    const id = button.attr('data-inchlib-id');
    if (id === 'reset') {
      self.redraw();
    } else if (id === 'edit_heatmap_colors') {
      self._draw_heatmap_modal();
    } else if (id === 'edit_categories') {
      self._draw_categories_modal();
    } else if (id === 'download') {
      // toggle the download menu
      const download_menu = $('.inchlib-download');
      if (download_menu.length === 0) {
        self._draw_download_menu();
      } else {
        const overlay = self.$element.find('.inchlib-overlay');
        if (overlay.length === 1) {
          overlay.trigger('click');
        }
      }
    } else if (id === 'legend') {
      // legend stays visible unless you click
      // on the legend toggle again
      if ($(`#${self.legend_id}`).length === 1) {
        button.removeClass('no-hover');
        $(`#${self.legend_id}`).fadeOut().remove();
        button.find('.fa-caret-up')
          .removeClass('fa-caret-up')
          .addClass('fa-caret-down');
      } else {
        button.addClass('no-hover');
        self._draw_legend_for_screen();
        button.find('.fa-caret-down')
          .removeClass('fa-caret-down')
          .addClass('fa-caret-up');
      }
    }
  };

  InCHlib.prototype._toolbar_mouseover = function (button) {
    const self = this;

    const position = button.parent().position();
    const x = button.closest('ul').position().left + position.left;
    const y = position.top + 35;

    self.toolbar_tooltip = self.objects_ref.tooltip_label.clone({
      x,
      y,
    });
    self.toolbar_tooltip.add(self.objects_ref.tooltip_tag.clone());
    self.toolbar_tooltip.add(self.objects_ref.tooltip_text.clone({ text: button.attr('data-inchlib-tooltip') }));

    self.navigation_layer.add(self.toolbar_tooltip);
    self.toolbar_tooltip.moveToTop();

    // center align the tooltip
    const toolbar_coords = self.toolbar_tooltip.getClientRect();
    self.toolbar_tooltip.x(x + 22 - (toolbar_coords.width / 2));

    self.navigation_layer.draw();
  };

  InCHlib.prototype._toolbar_mouseout = function () {
    const self = this;
    self.toolbar_tooltip.destroy();
    self.navigation_layer.draw();
  };

  InCHlib.prototype._draw_download_menu = function () {
    const self = this;
    const overlay = self._draw_overlay(true);
    const download_options = [
      {
        id: 'download-png',
        label: 'PNG',
      },
      // {
      //   id: 'download-json',
      //   label: 'JSON',
      // },
    ];

    const download_ul = $(`<ul class="inchlib-download"></ul>`);

    const download_lis = download_options.map(option => {
      const open_li = `<li class="inchlib-download_item"><button type="button" class="inchlib-download_btn" data-inchlib-id="${option.id}">`;
      const close_li = '</button></li>';
      const contents = option.label;
      return `${open_li}${contents}${close_li}`;
    })
    .join('');

    download_ul.html(download_lis);
    $('.inchlib-toolbar_btn-download').parent().append(download_ul);

    $('.inchlib-download_btn').click(function() {
      if ($(this).attr('data-inchlib-id') === 'download-png') {
        self._download_png();
      }
    });

    overlay.click(function() {
      overlay.fadeOut().remove();
      $('.inchlib-download').remove();
    });
  };
  
  InCHlib.prototype._draw_navigation = function () {
    const self = this;
    self.navigation_layer = new Konva.Layer();
    // offset by 0.5 for cleaner lines
    let x = 0.5;
    let y = 5.5;

    self._draw_toolbar();

    self.stage.add(self.navigation_layer);
  };

  InCHlib.prototype._update_color_scale = function () {
    const self = this;
    const color_scale = self.navigation_layer.find(`#${self._name}_color_scale`);

    self.color_steps = [
      0,
      self._get_color_for_value(0, 0, 1, 0.5, self.options.heatmap_colors),
      0.5,
      self._get_color_for_value(0.5, 0, 1, 0.5, self.options.heatmap_colors),
      1,
      self._get_color_for_value(1, 0, 1, 0.5, self.options.heatmap_colors),
    ];

    color_scale.fillLinearGradientColorStops(self.color_steps);
    self.navigation_layer.draw();
    self._redraw_heatmap_scale();
  };

  InCHlib.prototype._highlight_path = function (path_id, color) {
    const self = this;
    const node = self.data.nodes[path_id];
    if (node.count != 1) {
      self.dendrogram_layer.find(`#${path_id}`)[0].stroke(color);
      self._highlight_path(node.left_child, color);
      self._highlight_path(node.right_child, color);
    } else {
      self.highlighted_rows_y.push(self.leaves_y_coordinates[path_id]);
      self.current_object_ids.push.apply(self.current_object_ids, node.objects);
    }
  };

  InCHlib.prototype._highlight_column_path = function (path_id, color) {
    const self = this;
    const node = self.column_dendrogram.nodes[path_id];
    if (node.count != 1) {
      self.column_dendrogram_layer.find(`#col${path_id}`)[0].stroke(color);
      self._highlight_column_path(node.left_child, color);
      self._highlight_column_path(node.right_child, color);
    } else {
      self.current_column_ids.push(self.nodes2columns[path_id]);
    }
  };

  /**
    * Unhighlight highlighted heatmap rows.
    *
    * @example
    * instance.unhighlight_rows();
    */
  InCHlib.prototype.unhighlight_rows = function () {
    const self = this;
    self.highlight_rows([]);
  };

  /**
    * Highlight heatmap rows with color defined in instance.settings.highlight_colors.
    * When the empty array is passed it unhighlights all highlighted rows.
    *
    * @param {object} [row_ids] The array of heatmap row (object) IDs.
    *
    * @example
    * instance.highlight_rows(["CHEMBL7781", "CHEMBL273658", "CHEMBL415309", "CHEMBL267231", "CHEMBL8007", "CHEMBL7987", "CHEMBL7988", "CHEMBL266282", "CHEMBL7655", "CHEMBL7817", "CHEMBL8637", "CHEMBL8639", "CHEMBL8055", "CHEMBL7843", "CHEMBL266488", "CHEMBL8329"]);
    */

  InCHlib.prototype.highlight_rows = function (row_ids) {
    const self = this;
    let row;
    let row_id;
    if (!self.options.heatmap) {
      return;
    }

    self.options.highlighted_rows = row_ids;
    self.highlighted_rows_layer.destroyChildren();

    const original_colors = self.options.heatmap_colors;
    self.options.heatmap_colors = self.options.highlight_colors;

    const done_rows = {};
    const unique_row_ids = [];

    for (var i = 0; i < row_ids.length; i++) {
      if (self.objects2leaves[row_ids[i]] !== undefined) {
        row_id = self.objects2leaves[row_ids[i]];
        if (done_rows[row_id] === undefined) {
          unique_row_ids.push(row_id);
          done_rows[row_id] = null;
        }
      }
    }

    for (var i = 0; i < unique_row_ids.length; i++) {
      row = self._draw_heatmap_row(unique_row_ids[i], self.heatmap_distance, self.leaves_y_coordinates[unique_row_ids[i]]);
      self.highlighted_rows_layer.add(row);
      row.setAttr('listening', false);
    }

    self.highlighted_rows_layer.draw();
    self.heatmap_overlay.moveToTop();

    self.options.heatmap_colors = original_colors;

    self.highlighted_rows_layer.on('click', (evt) => {
      self.heatmap_layer.fire('click');
    });
  };

  InCHlib.prototype._highlight_cluster = function (path_id) {
    const self = this;
    const previous_cluster = self.last_highlighted_cluster;

    if (previous_cluster) {
      self.unhighlight_cluster();
    }

    if (previous_cluster === path_id) {
      self._zoom_cluster(path_id);
    } else {
      self.last_highlighted_cluster = path_id;
      self._highlight_path(path_id, self.dendrogram_active_color);
      self._draw_cluster_layer(path_id);
    }
    self.dendrogram_layer.draw();
  };

  InCHlib.prototype._highlight_column_cluster = function (path_id) {
    const self = this;
    const previous_cluster = self.last_highlighted_column_cluster;
    if (previous_cluster) {
      self.unhighlight_column_cluster();
    }
    if (previous_cluster === path_id) {
      self._get_column_ids(path_id);
      self._zoom_column_cluster(path_id);
    } else {
      self.last_highlighted_column_cluster = path_id;
      self._highlight_column_path(path_id, self.dendrogram_active_color);
      self.current_column_ids.sort((a, b) => { return a - b; });
      self._draw_column_cluster_layer(path_id);
    }
    self.column_dendrogram_layer.draw();
  };

  InCHlib.prototype.unhighlight_column_cluster = function () {
    const self = this;
    if (self.last_highlighted_column_cluster) {
      self._highlight_column_path(self.last_highlighted_column_cluster, 'grey');
      self.column_dendrogram_layer.draw();
      self.column_cluster_group.destroy();
      self.cluster_layer.draw();
      self.current_column_ids = [];
      self.last_highlighted_column_cluster = null;
    }
  };

  /**
    * Highlight cluster defined by the dendrogram node ID.
    *
    * @param {string} node_id The ID of particular node in dendrogram.
    *
    * @example
    * instance.highlight_cluster("node@715");
    */

  InCHlib.prototype.highlight_cluster = function (node_id) {
    const self = this;
    return self._highlight_cluster(self._prefix(node_id));
  };

  /**
    * Highlight column cluster defined by the dendrogram node ID.
    *
    * @param {string} node_id The ID of particular node in dendrogram.
    *
    * @example
    * instance.highlight_column_cluster("node@715");
    */

  InCHlib.prototype.highlight_column_cluster = function (node_id) {
    const self = this;
    return self._highlight_column_cluster(self._prefix(node_id));
  };

  /**
    * Unhighlight highlighted dendrogram node (cluster).
    *
    * @example
    * instance.unhighlight_cluster();
    */
  InCHlib.prototype.unhighlight_cluster = function () {
    const self = this;
    if (self.last_highlighted_cluster) {
      self._highlight_path(self.last_highlighted_cluster, 'grey');
      self.dendrogram_layer.draw();
      self.row_cluster_group.destroy();
      self.cluster_layer.draw();
      self.highlighted_rows_y = [];
      self.current_object_ids = [];
      self.last_highlighted_cluster = null;
    }
  };

  InCHlib.prototype._neutralize_path = function (path_id) {
    const self = this;
    const node = self.data.nodes[path_id];

    if (node.count != 1) {
      const path = self.dendrogram_layer.find(`#${path_id}`)[0];
      if (path) {
        path.setStroke('grey');
        self._neutralize_path(node.right_child);
        self._neutralize_path(node.left_child);
      }
    }
  };

  InCHlib.prototype._draw_cluster_layer = function (path_id) {
    const self = this;
    self.row_cluster_group = new Konva.Group();
    const visible = self._get_visible_count();
    const { count } = self.data.nodes[path_id];
    let x = self.distance - 30;
    const y = self.header_height + self.column_metadata_height - 40;

    // TODO: NUMBER OF ROWS THAT WILL BE ZOOMED
    // const rows_desc = self.objects_ref.count.clone({
    //   x: x + 10,
    //   y: y - 10,
    //   text: count,
    // });

    x = self.distance + self.dendrogram_heatmap_distance;
    const width = visible * self.pixels_for_dimension + self.heatmap_distance;
    const upper_y = self.highlighted_rows_y[0] - self.pixels_for_leaf / 2;
    const lower_y = self.highlighted_rows_y[self.highlighted_rows_y.length - 1] + self.pixels_for_leaf / 2;

    const cluster_overlay_1 = self.objects_ref.cluster_overlay.clone({
      x,
      y: self.header_height + self.column_metadata_height + 10,
      width,
      height: self._hack_round(upper_y - self.header_height - self.column_metadata_height - 10),
    });

    const cluster_border_1 = self.objects_ref.cluster_border.clone({
      points: [
        0,
        upper_y,
        width,
        upper_y,
      ],
    });

    const cluster_overlay_2 = self.objects_ref.cluster_overlay.clone({
      x,
      y: lower_y,
      width,
      height: self.options.height - lower_y - self.footer_height + 10,
    });

    const cluster_border_2 = self.objects_ref.cluster_border.clone({
      points: [
        0,
        lower_y,
        width,
        lower_y,
      ],
    });

    self.row_cluster_group.add(cluster_overlay_1, cluster_overlay_2, cluster_border_1, cluster_border_2);
    self.cluster_layer.add(self.row_cluster_group);
    self.stage.add(self.cluster_layer);

    self.cluster_layer.draw();
    self.navigation_layer.moveToTop();
  };

  InCHlib.prototype._draw_column_cluster_layer = function (path_id) {
    const self = this;
    self.column_cluster_group = new Konva.Group();
    const { count } = self.column_dendrogram.nodes[path_id];
    const x = self.options.width - 85;
    const y = self.header_height - 25;

    // TODO: NUMBER OF COLUMNS THAT WILL BE ZOOMED
    // const cols_desc = self.objects_ref.count.clone({
    //   x: x + 15,
    //   y: y - 5,
    //   text: count,
    // });

    const x1 = self._hack_round((self.current_column_ids[0] - self.columns_start_index) * self.pixels_for_dimension);
    const x2 = self._hack_round((self.current_column_ids[0] + self.current_column_ids.length - self.columns_start_index) * self.pixels_for_dimension);
    const y1 = 0;
    const y2 = self.options.height + 5;
    const height = self.options.height - self.header_height + self.column_metadata_row_height;

    const cluster_border_1 = self.objects_ref.cluster_border.clone({
      points: [
        self.heatmap_distance + x1,
        y1,
        self.heatmap_distance + x1,
        y2,
      ],
    });

    const cluster_overlay_1 = self.objects_ref.cluster_overlay.clone({
      x: self.heatmap_distance,
      y: self.header_height,
      width: x1,
      height,
    });

    const cluster_border_2 = self.objects_ref.cluster_border.clone({
      points: [
        self.heatmap_distance + x2,
        y1,
        self.heatmap_distance + x2,
        y2,
      ],
    });

    const cluster_overlay_2 = self.objects_ref.cluster_overlay.clone({
      x: x2 + self.heatmap_distance,
      y: self.header_height,
      width: self.heatmap_width - x2 - (self.on_features.metadata.length + self.on_features.count_column.length) * self.pixels_for_dimension,
      height,
    });

    self.column_cluster_group.add(cluster_overlay_1, cluster_overlay_2, cluster_border_1, cluster_border_2);
    self.cluster_layer.add(self.column_cluster_group);
    self.stage.add(self.cluster_layer);
    self.cluster_layer.draw();
    self.navigation_layer.moveToTop();
  };

  InCHlib.prototype._draw_column_cluster = function (node_id) {
    const self = this;
    self.columns_start_index = self.current_column_ids[0];
    self.on_features.data = self.current_column_ids;
    const { distance } = self;
    self._adjust_horizontal_sizes();
    self._delete_layers([
      self.column_dendrogram_layer,
      self.heatmap_layer,
      self.heatmap_overlay,
      self.column_cluster_group,
      self.navigation_layer,
      self.highlighted_rows_layer,
    ], [self.dendrogram_hover_layer]);
    if (self.options.heatmap_header) {
      self._delete_layers([self.header_layer]);
    }
    self._draw_column_dendrogram(node_id);
    self._draw_heatmap();
    self._draw_heatmap_header();
    self._draw_navigation();

    if (distance !== self.distance) {
      self._delete_layers([self.dendrogram_layer, self.cluster_layer]);
      const row_node = (self.zoomed_clusters.row.length > 0) ? self.zoomed_clusters.row[self.zoomed_clusters.row.length - 1] : self.root_id;
      self._draw_row_dendrogram(row_node);
      if (self.last_highlighted_cluster !== null) {
        self._highlight_path(self.last_highlighted_cluster, self.dendrogram_active_color);
        self.dendrogram_layer.draw();
        self._draw_cluster_layer(self.last_highlighted_cluster);
      }
    } else {
      self.cluster_layer.moveToTop();
      self.cluster_layer.draw();
    }
  };

  InCHlib.prototype._zoom_column_cluster = function (node_id) {
    const self = this;
    if (node_id != self.column_root_id) {
      self.zoomed_clusters.column.push(node_id);
      self._draw_column_cluster(node_id);
      self.highlight_rows(self.options.highlighted_rows);
      self.current_column_ids = [];
      self.last_highlighted_column_cluster = null;
    }
  };

  InCHlib.prototype._draw_cluster = function (node_id) {
    const self = this;
    self._delete_layers([
      self.dendrogram_layer,
      self.heatmap_layer,
      self.heatmap_overlay,
      self.cluster_layer,
      self.navigation_layer,
      self.header_layer,
      self.highlighted_rows_layer,
    ], [self.dendrogram_hover_layer]);
    self._draw_row_dendrogram(node_id);
    self._draw_heatmap();
    self._draw_heatmap_header();
    self._draw_navigation();
    if (self.options.column_dendrogram && self.last_highlighted_column_cluster !== null) {
      self._draw_column_cluster_layer(self.last_highlighted_column_cluster);
    }
  };

  InCHlib.prototype._zoom_cluster = function (node_id) {
    const self = this;
    if (node_id !== self.root_id) {
      self.zoomed_clusters.row.push(node_id);
      self._draw_cluster(node_id);
      self.highlight_rows(self.options.highlighted_rows);
      self.highlighted_rows_y = [];
      self.current_object_ids = [];
      self.last_highlighted_cluster = null;
    }
  };

  InCHlib.prototype._get_node_neighbourhood = function (node, nodes) {
    const self = this;
    const node_neighbourhood = {
      left_node: {
        left_node: {
          left_count: 0,
          right_count: 0,
        },
        right_node: {
          left_count: 0,
          right_count: 0,
        },
        left_count: 0.5,
        right_count: 0.5,
      },
      right_node: {
        left_node: {
          left_count: 0,
          right_count: 0,
        },
        right_node: {
          left_count: 0,
          right_count: 0,
        },
        left_count: 0.5,
        right_count: 0.5,
      },
      left_count: nodes[node.left_child].count,
      right_count: nodes[node.right_child].count,
    };

    const left_child = nodes[node.left_child];
    const right_child = nodes[node.right_child];

    const left_child_left_child = nodes[left_child.left_child];
    const left_child_right_child = nodes[left_child.right_child];

    const right_child_left_child = nodes[right_child.left_child];
    const right_child_right_child = nodes[right_child.right_child];

    if (left_child.count != 1) {
      node_neighbourhood.left_node.left_count = nodes[left_child.left_child].count;
      node_neighbourhood.left_node.right_count = nodes[left_child.right_child].count;

      if (left_child_left_child.count != 1) {
        node_neighbourhood.left_node.left_node.left_count = nodes[left_child_left_child.left_child].count;
        node_neighbourhood.left_node.left_node.right_count = nodes[left_child_left_child.right_child].count;
      } else {
        node_neighbourhood.left_node.left_node.left_count = 0.5;
        node_neighbourhood.left_node.left_node.right_count = 0.5;
      }

      if (left_child_right_child.count != 1) {
        node_neighbourhood.left_node.right_node.left_count = nodes[left_child_right_child.left_child].count;
        node_neighbourhood.left_node.right_node.right_count = nodes[left_child_right_child.right_child].count;
      } else {
        node_neighbourhood.left_node.right_node.left_count = 0.5;
        node_neighbourhood.left_node.right_node.right_count = 0.5;
      }
    }

    if (right_child.count != 1) {
      node_neighbourhood.right_node.left_count = nodes[right_child.left_child].count;
      node_neighbourhood.right_node.right_count = nodes[right_child.right_child].count;

      if (right_child_left_child.count != 1) {
        node_neighbourhood.right_node.left_node.left_count = nodes[right_child_left_child.left_child].count;
        node_neighbourhood.right_node.left_node.right_count = nodes[right_child_left_child.right_child].count;
      } else {
        node_neighbourhood.right_node.left_node.left_count = 0.5;
        node_neighbourhood.right_node.left_node.right_count = 0.5;
      }

      if (right_child_right_child.count != 1) {
        node_neighbourhood.right_node.right_node.left_count = nodes[right_child_right_child.left_child].count;
        node_neighbourhood.right_node.right_node.right_count = nodes[right_child_right_child.right_child].count;
      } else {
        node_neighbourhood.right_node.right_node.left_count = 0.5;
        node_neighbourhood.right_node.right_node.right_count = 0.5;
      }
    }
    return node_neighbourhood;
  };

  InCHlib.prototype._draw_column_dendrogram_node = function (node_id, node, current_left_count, current_right_count, x, y) {
    const self = this;

    if (node.count > 1) {
      const node_neighbourhood = self._get_node_neighbourhood(node, self.column_dendrogram.nodes);
      const right_child = self.column_dendrogram.nodes[node.right_child];
      const left_child = self.column_dendrogram.nodes[node.left_child];
      const x1 = self._get_x1(node_neighbourhood, current_left_count, current_right_count);
      let x2 = self._get_x2(node_neighbourhood, current_left_count, current_right_count);
      let y1 = self._hack_round(self.vertical_distance - self.vertical_distance_step * node.distance);
      y1 = (y1 == 0) ? 2 : y1;
      const y2 = y1;

      if (right_child.count == 1) {
        x2 -= self.pixels_for_dimension / 2;
      }

      const left_distance = self.vertical_distance - self.vertical_distance_step * self.column_dendrogram.nodes[node.left_child].distance;
      const right_distance = self.vertical_distance - self.vertical_distance_step * self.column_dendrogram.nodes[node.right_child].distance;

      self.column_dendrogram_layer.add(self._draw_vertical_path(node_id, x1, y1, x2, y2, left_distance, right_distance));
      self._draw_column_dendrogram_node(node.left_child, left_child, current_left_count - node_neighbourhood.left_node.right_count, current_right_count + node_neighbourhood.left_node.right_count, left_distance, y1);
      self._draw_column_dendrogram_node(node.right_child, right_child, current_left_count + node_neighbourhood.right_node.left_count, current_right_count - node_neighbourhood.right_node.left_count, right_distance, y2);
    } else {
      self.column_x_coordinates[node_id] = current_right_count * self.pixels_for_dimension;
    }
  };

  InCHlib.prototype._get_y1 = function (node_neighbourhood, current_left_count, current_right_count) {
    const self = this;
    current_left_count = current_left_count - node_neighbourhood.left_node.right_count - node_neighbourhood.left_node.left_node.right_count;
    const y = (current_left_count + (node_neighbourhood.left_node.left_node.right_count + node_neighbourhood.left_node.right_node.left_count) / 2) * self.pixels_for_leaf;
    return y + self.top_heatmap_distance;
  };

  InCHlib.prototype._get_y2 = function (node_neighbourhood, current_left_count, current_right_count) {
    const self = this;
    current_left_count += node_neighbourhood.right_node.left_node.left_count;
    const y = (current_left_count + (node_neighbourhood.right_node.left_node.right_count + node_neighbourhood.right_node.right_node.left_count) / 2) * self.pixels_for_leaf;
    return y + self.top_heatmap_distance;
  };

  InCHlib.prototype._get_x1 = function (node_neighbourhood, current_left_count, current_right_count) {
    const self = this;
    current_left_count = current_left_count - node_neighbourhood.left_node.right_count - node_neighbourhood.left_node.left_node.right_count;
    const x = (current_left_count + (node_neighbourhood.left_node.left_node.right_count + node_neighbourhood.left_node.right_node.left_count) / 2) * self.pixels_for_dimension;
    return (self.heatmap_distance + self.on_features.data.length * self.pixels_for_dimension) - x;
  };

  InCHlib.prototype._get_x2 = function (node_neighbourhood, current_left_count, current_right_count) {
    const self = this;
    current_left_count += node_neighbourhood.right_node.left_node.left_count;
    const x = (current_left_count + (node_neighbourhood.right_node.left_node.right_count + node_neighbourhood.right_node.right_node.left_count) / 2) * self.pixels_for_dimension;
    return (self.heatmap_distance + self.on_features.data.length * self.pixels_for_dimension) - x;
  };

  InCHlib.prototype._draw_vertical_path = function (path_id, x1, y1, x2, y2, left_distance, right_distance) {
    const self = this;
    const path_group = new Konva.Group({});
    const path = self.objects_ref.node.clone({
      points: [
        x1,
        left_distance,
        x1,
        y1,
        x2,
        y2,
        x2,
        right_distance,
      ],
      id: `col${path_id}`,
    });
    const path_rect = self.objects_ref.node_rect.clone({
      x: x2 - 1,
      y: y1 - 1,
      width: x1 - x2 + 2,
      height: self.header_height - y1,
      id: `col_rect${path_id}`,
      path,
      path_id,
    });

    path_group.add(path, path_rect);
    return path_group;
  };

  InCHlib.prototype._draw_horizontal_path = function (path_id, x1, y1, x2, y2, left_distance, right_distance) {
    const self = this;
    const path_group = new Konva.Group({});
    const path = self.objects_ref.node.clone({
      points: [
        left_distance,
        y1,
        x1,
        y1,
        x2,
        y2,
        right_distance,
        y2,
      ],
      id: path_id,
    });

    const path_rect = self.objects_ref.node_rect.clone({
      x: x1 - 1,
      y: y1 - 1,
      width: self.distance - x1,
      height: y2 - y1,
      id: [path_id, 'rect'].join('_'),
      path,
      path_id,
    });
    path_group.add(path, path_rect);
    return path_group;
  };

  InCHlib.prototype._draw_overlay = function (invisible = false) {
    const self = this;
    let overlay = self.$element.find('.inchlib-overlay');

    if (overlay.length === 1) {
      overlay.trigger('click');
    }

    overlay = $(`<div class="inchlib-overlay${invisible
      ? ' inchlib-overlay_invisible' 
      : ''}"></div>`);
    self.$element.append(overlay);

    return overlay;
  };

  InCHlib.prototype._download_png = function () {
    const self = this;
    const overlay = self._draw_overlay();
    const zoom = 3;
    const width = self.stage.width();
    const height = self.stage.height();
    const { png_padding } = self.options;

    overlay.click(function() {
      overlay.fadeOut().remove();
    });

    const loading_div = $(`<div style="width: ${width}px; height: ${height}px; display: flex; align-items: center; justify-content: center;"></div>`).html('<i class="fa fa-spinner fa-pulse" style="font-size: 32px"></i>');
    self.$element.after(loading_div);
    self.$element.hide();

    self._draw_legend_for_png();

    // setup height
    const min_height = 600;
    // labels on the bottom get cut off without this
    const bottom_padding = 50;
    const height_full = height + bottom_padding;
    const get_height = height_full < min_height
      ? min_height
      : height_full;

    const padding = png_padding * 2;

    const png_height = (get_height + padding) * zoom;
    const png_width = (width + png_padding) * zoom;

    self.stage.width(png_width);
    self.stage.height(png_height);
    self.stage.scale({
      x: zoom,
      y: zoom,
    });
    self.stage.x(padding);
    self.stage.y(padding);
    self.stage.draw();
    self.navigation_layer.hide();
    self.stage.toDataURL({
      quality: 1,
      callback(dataUrl) {
        downloadURI(dataUrl, 'gene-expression.png');
        self.stage.width(width);
        self.stage.height(height);
        self.stage.scale({
          x: 1,
          y: 1,
        });
        self.stage.x(0);
        self.stage.y(0);
        self.stage.draw();
        loading_div.fadeOut().remove();
        self.$element.show();
        self.navigation_layer.show();
        self.navigation_layer.draw();
        self._delete_layers([
          self.legend_png_layer,
        ]);
        overlay.trigger('click');
      },
    });

    // function from https://stackoverflow.com/a/15832662/512042
    function downloadURI(uri, name) {
      var link = document.createElement('a');
      link.download = name;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  InCHlib.prototype._draw_legend_for_screen = function() {
    const self = this;
    const legend_div = $(`<div class="inchlib-legend" id='${self.legend_id}'></div>`);
    const options = ['<ul class="inchlib-legend_list">']
      .concat(self.legend_headings
        .map(name => {
          if (self.legend_continuous_categories.includes(name)) {
            return `<li class="inchlib-legend_list-item"><strong>${name}</strong>
            <ul class="inchlib-legend_sublist"><li class="inchlib-legend_list-item">0 <span class="inchlib-legend_gradient inchlib-legend_gradient-${name.toLowerCase().split(' ')[0]}"></span> ${self.legend_gradient_upper_value(name)}</li></ul></li>`
          } else {
            const legend_list = Object.keys(self.options.categories.colors[name])
              .map(value => `<li class="inchlib-legend_sublist-item${
                self.legend_horizontal_categories
                  .includes(name) 
                    ? ' inchlib-legend_sublist-item-horizontal'
                    : ''
                }"><span class='inchlib-legend_square' style='background: ${self.options.categories.colors[name][value]}'></span> ${value.split('_').join(' ')}</li>`)
              .join('');
            return `<li class="inchlib-legend_list-item"><strong>${name}</strong><ul class="inchlib-legend_sublist">${legend_list}</ul></li>`;
          }
        })
      )
      .concat('</ul>')
      .join('');

    legend_div.html(options);
    self.$element.append(legend_div);

    $(`#${self.legend_id} .inchlib-legend_gradient-age`).css({
      background: `linear-gradient(90deg, ${self.legend_gradients.age.min} 0%, ${self.legend_gradients.age.max} 100%)`
    });
    $(`#${self.legend_id} .inchlib-legend_gradient-days`).css({
      background: `linear-gradient(90deg, ${self.legend_gradients.days.min} 0%, ${self.legend_gradients.days.max} 100%)`
    });
  };

  InCHlib.prototype._draw_heatmap_scale = function() {
    const self = this;
    self.heatmap_scale_layer = self.objects_ref.layer_below_toolbar.clone({x: 5 })
    self.stage.add(self.heatmap_scale_layer);

    // add heatmap scale to PNG

    const scale_group = new Konva.Group({
      x: 5,
      y: 5,
    });

    let scale_x = 0;
    let scale_y = 0;

    const scale_height = 125;

    const scale_heading = new Konva.Text({
      fill: self.hover_fill,
      fontFamily: self.options.font.family,
      fontStyle: '500',
      text: 'Expression',
      x: scale_x,
      y: scale_y,
    });

    scale_y += 25;

    const scale_width = 20;

    const scale_gradient = new Konva.Rect({
      fillLinearGradientColorStops: self.color_steps,
      fillLinearGradientEndPoint: {
        x: scale_x,
        y: scale_y + 90,
      },
      fillLinearGradientStartPoint: {
        x: scale_x,
        y: scale_y,
      },
      linecap: 'square',
      height: scale_height,
      stroke: 'grey',
      strokeWidth: 2,
      width: scale_width,
      x: scale_x,
      y: scale_y,
    });
    scale_group.add(scale_gradient, scale_heading);

    // add ticks to heatmap scale

    scale_x += scale_width;

    for (var i = 0, ticks_count = 5; i < ticks_count; i++) {
      const tick = new Konva.Rect({
        stroke: 'grey',
        strokeWidth: 1,
        width: 10,
        x: scale_x,
        y: Math.round(scale_y + (scale_height * (0.25 * i))),
      });
      scale_group.add(tick);
    }

    // add values to heatmap scale

    scale_x += 15;

    const scale_values = self.get_scale_values();

    scale_y -= 5;
    const scaleY_int = Math.floor(scale_height / scale_values.length) + 6;

    for (let i = 0; i < scale_values.length; i++) {
      const text = scale_values[i];
      const scale_text = new Konva.Text({
        fill: self.hover_fill,
        fontFamily: self.options.font.family,
        fontStyle: '500', 
        text,
        x: scale_x,
        y: scale_y,
      });
      scale_group.add(scale_text);
      scale_y += scaleY_int;
    }

    self.heatmap_scale_layer.add(scale_group);
    self.heatmap_scale_layer.draw();
  }

  InCHlib.prototype._draw_legend_for_png = function() {
    const self = this;
    self.legend_png_layer = self.objects_ref.layer_below_toolbar.clone();
    self.stage.add(self.legend_png_layer);

    const legend_width = 150;
    const legend_y = -20;
    const legend_x = self.stage.width() - (legend_width + 5);

    // create legend

    const legend_title = new Konva.Text({
      fill: self.hover_fill,
      fontFamily: 'franklin_gothic_fsbook',
      fontSize: 18,
      text: 'Legend',
      x: legend_x + 10,
      y: legend_y + 10,
    });

    const legend_group = new Konva.Group({
      x: legend_x + 10,
      y: legend_y + 40,
    });

    let y = 0;
    let x = 0;

    for (let i = 0; i < self.legend_headings.length; i++) {
      const heading = self.legend_headings[i];
      const legend_heading = new Konva.Text({
        fill: self.hover_fill,
        fontFamily: self.options.font.family,
        fontStyle: '500',
        text: heading,
        x,
        y,
      });
      y += 20;
      legend_group.add(legend_heading);

      if (self.legend_continuous_categories.includes(heading)) {
        const zero = new Konva.Text({
          fill: self.hover_fill,
          text: '0',
          x,
          y,
        });

        const gradient = new Konva.Rect({
          fillLinearGradientColorStops: heading === 'Age at Diagnosis'
            ? [0, self.legend_gradients.age.min, 1, self.legend_gradients.age.max]
            : [0, self.legend_gradients.days.min, 1, self.legend_gradients.days.max],
          fillLinearGradientEndPoint: {
            x: x + 85,
            y,
          },
          fillLinearGradientStartPoint: {
            x: x + 10,
            y,
          },
          height: 12,
          width: 75,
          x: x + 15,
          y,
        });

        const max = new Konva.Text({
          fill: self.hover_fill,
          text: self.legend_gradient_upper_value(heading),
          x: x + 95,
          y,
        });

        legend_group.add(zero, gradient, max);
        y += 25;
      } else {
        const legend_list = Object.keys(self.options.categories.colors[heading]);
        
        for (let n = 0; n < legend_list.length; n++) {
          const value = legend_list[n];
          const text = value.split('_').join(' ');
          const legend_square = new Konva.Rect({
            fill: self.options.categories.colors[heading][value],
            height: 12,
            width: 12,
            x, 
            y, 
          });
          const legend_text = new Konva.Text({
            fill: self.hover_fill,
            lineHeight: 1.2,
            text,
            width: 100,
            x: x + 17,
            y,
          });
          legend_group.add(legend_square, legend_text);
          y += legend_text.height() + 5;
        }
        y += 5;
      }
    }
    const legend = new Konva.Rect({
      cornerRadius: 5,
      fill: '#fff',
      height: y + 40,
      stroke: '#D2D2D2',
      strokeWidth: 2,
      width: legend_width,
      x: legend_x,
      y: legend_y,
    })

    self.legend_png_layer.add(legend, legend_title, legend_group);
    self.legend_png_layer.draw();
  };

  InCHlib.prototype._redraw_heatmap_scale = function() {
    const self = this;
    self._delete_layers([
      self.heatmap_scale_layer,
    ]);
    self._draw_heatmap_scale();
  };

  InCHlib.prototype._dendrogram_layers_click = function (layer, evt) {
    const self = this;
    const { path_id } = evt.target.attrs;
    console.log('clicked on', path_id)
    layer.fire('mouseout', layer, evt);
    self._highlight_cluster(path_id);
  };

  InCHlib.prototype._column_dendrogram_layers_click = function (layer, evt) {
    const self = this;
    const { path_id } = evt.target.attrs;
    console.log('clicked on', path_id)
    layer.fire('mouseout', layer, evt);
    self._highlight_column_cluster(path_id);
  };

  InCHlib.prototype._dendrogram_layers_mousedown = function (layer, evt) {
    const self = this;
    const node_id = evt.target.attrs.path_id;
  };

  InCHlib.prototype._column_dendrogram_layers_mousedown = function (layer, evt) {
    const self = this;
    const node_id = evt.target.attrs.path_id;
  };

  InCHlib.prototype._dendrogram_layers_mouseup = function (layer, evt) {
    const self = this;
  };

  InCHlib.prototype._dendrogram_layers_mouseout = function (layer, evt) {
    const self = this;
    self.path_overlay.destroy();
    // remove tooltip
    self.dendrogram_hover_layer.destroyChildren();
    self.dendrogram_hover_layer.draw();
  };

  InCHlib.prototype._dendrogram_layers_mouseover = function (layer, evt) {
    const self = this;
    self.path_overlay = evt.target.attrs.path.clone({ strokeWidth: 4 });
    self.dendrogram_hover_layer.add(self.path_overlay);
    self._draw_dendrogram_label(evt);
    self.dendrogram_hover_layer.draw();
  };

  InCHlib.prototype._get_color_for_value = function (value, min, max, middle, color_scale) {
    const self = this;
    const color = self.colors[color_scale];
    let c1 = color.start;
    let c2 = color.end;

    if (value > max) {
      return `rgb(${c2.r},${c2.g},${c2.b})`;
    }

    if (min == max || value < min) {
      return `rgb(${c1.r},${c1.g},${c1.b})`;
    }

    if (color.middle !== undefined) {
      if (value >= middle) {
        min = middle;
        c1 = color.middle;
        c2 = color.end;
      } else {
        max = middle;
        c1 = color.start;
        c2 = color.middle;
      }
    }

    const position = (value - min) / (max - min);
    const r = self._hack_round(c1.r + (position * (c2.r - c1.r)));
    const g = self._hack_round(c1.g + (position * (c2.g - c1.g)));
    const b = self._hack_round(c1.b + (position * (c2.b - c1.b)));
    return `rgb(${r},${g},${b})`;
  };

  InCHlib.prototype._get_font_size = function (text_length, width, height, max_font_size) {
    const max_possible_size = height - 2;
    let font_size = max_possible_size;

    if (font_size / 2 * text_length > width - 10) {
      font_size /= (font_size / 2 * text_length / (width - 10));
    }
    font_size = (font_size > max_possible_size)
      ? max_possible_size
      : font_size;
    font_size = (font_size > max_font_size)
      ? max_font_size
      : font_size;
    return font_size;
  };

  InCHlib.prototype._get_object_ids = function (node_id) {
    const self = this;
    self.current_object_ids = [];
    self._collect_object_ids(node_id);
  };

  InCHlib.prototype._collect_object_ids = function (node_id) {
    const self = this;
    if (self.data.nodes[node_id].left_child !== undefined) {
      self._collect_object_ids(self.data.nodes[node_id].left_child);
      self._collect_object_ids(self.data.nodes[node_id].right_child);
    } else {
      self.current_object_ids.push.apply(self.current_object_ids, self.data.nodes[node_id].objects);
    }
  };

  InCHlib.prototype._get_column_ids = function (node_id) {
    const self = this;
    self.current_column_ids = [];
    self._collect_column_ids(node_id);
    self.current_column_ids.sort((a, b) => { return a - b; });
  };

  InCHlib.prototype._collect_column_ids = function (node_id) {
    const self = this;
    if (self.column_dendrogram.nodes[node_id].left_child !== undefined) {
      self._collect_column_ids(self.column_dendrogram.nodes[node_id].left_child);
      self._collect_column_ids(self.column_dendrogram.nodes[node_id].right_child);
    } else {
      self.current_column_ids.push(self.nodes2columns[node_id]);
    }
  };

  InCHlib.prototype._hack_size = function (obj) {
    return Object.keys(obj).length;
  };

  InCHlib.prototype._hack_round = function (value) {
    return (0.5 + value) >> 0;
  };

  InCHlib.prototype._is_number = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  InCHlib.prototype._row_mouseenter = function (evt) {
    const self = this;
    const row_id = evt.target.parent.getAttr('id');

    if (evt.target.parent.attrs.class !== 'column_metadata') {
      self.highlighted_row = row_id;
      const y = self.leaves_y_coordinates[row_id];
      const x = self.heatmap_distance;

      self.row_overlay = self.objects_ref.heatmap_line.clone({
        points: [
          x,
          y,
          x + self.heatmap_width - (self.pixels_for_dimension * 2),
          y,
        ],
        strokeWidth: self.pixels_for_leaf,
        stroke: '#fff',
        opacity: 0.3,
        listening: false,
      });

      self.heatmap_overlay.add(self.row_overlay);
      self.heatmap_overlay.draw();
    }
  };

  InCHlib.prototype._row_mouseleave = function (evt) {
    const self = this;
    self.row_overlay.destroy();
    self.heatmap_overlay.draw();
  };

  InCHlib.prototype._draw_dendrogram_label = function ({ target: { attrs }}) {
    const self = this;
    const { id, path, path_id, width, x, y } = attrs;

    const is_outer_line = attrs.id === self.dendrogram_layer.children[0].children[0].attrs.id;
    console.log(attrs.id)
    console.log('testing', self.dendrogram_layer.children[0].children[0].attrs.id)

    const is_column = id.split('_')[0] === 'col';

    const { count } = is_column
      ? self.column_dendrogram.nodes[path_id]
      : self.data.nodes[path_id];

    const is_featured = is_column
      ? path_id === self.last_highlighted_column_cluster
      : path_id === self.last_highlighted_cluster;

    const genes_or_cases = is_column
      ? 'cases'
      : 'genes';

    const clicks = is_featured
      ? 'Click'
      : 'Double-click';

    let tooltip_x = x + (width / 2);

    const tooltip = self.objects_ref.tooltip_label.clone({
      x: x + (width / 2),
      y,
      id: 'dendrogram_label',
      opacity: is_outer_line ? 0 : 1,
    });

    // leave space for the zoom icon
    const tooltip_text = `        ${clicks} to zoom ${count} ${genes_or_cases}`;

    tooltip.add(
      self.objects_ref.tooltip_tag.clone({ pointerDirection: 'down' }),
      self.objects_ref.tooltip_text.clone({ text: tooltip_text }),
    );

    // if the row dendrogram tooltip is cut off on the left
    // move it over to the right
    const half_width = tooltip.width() / 2;
    if (!is_column) {
      const current_tooltip_x = tooltip.x();
      const half_width = tooltip.width() / 2;
      const difference = half_width - current_tooltip_x;
      if (difference > 0) {
        tooltip_x = current_tooltip_x + difference + 5;
        tooltip.x(tooltip_x);
      }
    }

    const zoom_x = tooltip_x - half_width - 3;
    const zoom_y = y - 39;

    const zoom_icon = self.objects_ref.zoom_icon.clone({
      x: zoom_x,
      y: zoom_y,
    });

    self.dendrogram_hover_layer.moveToTop();
    self.dendrogram_hover_layer.add(tooltip, zoom_icon);
  };

  InCHlib.prototype._draw_col_label = function (evt) {
    const self = this;
    let line;
    const { attrs } = evt.target;
    const { column: original_column, points } = attrs;
    const is_gene_symbol_column = original_column === 'm_1';
    const x = self._hack_round((points[0] + points[2]) / 2);
    const y = points[1] - 0.5 * self.pixels_for_leaf;
    const column = original_column.split('_');
    const header_type2value = {
      d: self.heatmap_header[column[1]],
      m: self.metadata_header[column[1]],
      Count: 'Count',
    };

    if (self.column_metadata_header !== undefined) {
      header_type2value.cm = self.column_metadata_header[column[1]];
    }

    const header_value = header_type2value[column[0]];

    if (header_value !== self.active_column) {
      self.column_overlay.destroy();
      self.active_column = attrs.column;
      self.column_overlay = self.objects_ref.heatmap_line.clone({
        points: [
          x,
          self.header_height,
          x,
          self.header_height + 10 + self.column_metadata_height + (self.heatmap_array.length) * self.pixels_for_leaf,
        ],
        strokeWidth: self.pixels_for_dimension,
        stroke: '#fff',
        opacity: 0.3 * !is_gene_symbol_column,
        listening: false,
        id: 'column_overlay',
      });
      self.heatmap_overlay.add(self.column_overlay);
    }

    const { name, value } = attrs;

    const header_text = self.heatmap_header.includes(header_value)
      ? `Case: ${header_value.split('_')[0]}, Gene: ${attrs.gene_symbol}`
      : header_value;

    const tooltip_value = typeof value === 'undefined'
      ? name.split('_').join(' ')
      : value;

    const tooltip_text = [header_text, tooltip_value].join('\n');

    const tooltip = self.objects_ref.tooltip_label.clone({
      x,
      y,
      id: 'col_label',
      opacity: + !is_gene_symbol_column,
    });

    tooltip.add(self.objects_ref.tooltip_tag.clone({ pointerDirection: 'down' }), self.objects_ref.tooltip_text.clone({ text: tooltip_text }));

    if (is_gene_symbol_column) {
      self._cursor_mouseover();
    }

    self.heatmap_overlay.add(tooltip);
    self.heatmap_overlay.moveToTop();
    self.heatmap_overlay.draw();
  };

  InCHlib.prototype._unprefix = function (prefixed) {
    const self = this;
    return prefixed.split(`${self._name}#`)[1];
  };

  InCHlib.prototype._prefix = function (nonprefixed) {
    const self = this;
    return `${self._name}#${nonprefixed}`;
  };

  /**
    * Returns array of features for object by its ID. When sent object ID is not present, false is returned
    */
  InCHlib.prototype.get_features_for_object = function (object_id) {
    const self = this;
    if (self.objects2leaves[object_id] !== undefined) {
      const row_id = self.objects2leaves[object_id];
      return self.data.nodes[row_id].features;
    }
    return false;
  };

  InCHlib.prototype._get_visible_count = function () {
    const self = this;
    return self.on_features.data.length + self.on_features.metadata.length + self.on_features.count_column.length;
  };

  /**
    * Update cluster heatmap settings
    */
  InCHlib.prototype.update_settings = function (settings_object) {
    const self = this;
    $.extend(self.options, settings_object);
  };

  /**
    * Redraw cluster heatmap
    */
  InCHlib.prototype.redraw = function () {
    const self = this;
    self._delete_all_layers();
    self.draw();
  };

  /**
    * Redraw heatmap only
    */
  InCHlib.prototype.redraw_heatmap = function () {
    const self = this;
    self._delete_layers([
      self.heatmap_layer,
      self.heatmap_overlay,
      self.highlighted_rows_layer,
      self.header_layer,
    ]);
    self._set_color_settings();
    self._draw_heatmap();
    self._draw_heatmap_header();
    self.heatmap_layer.moveToBottom();
    self.heatmap_layer.moveUp();
  };

  /**
    * Hover - change to hand cursor & back again
    */
  InCHlib.prototype._cursor_mouseover = function() {
    document.body.style.cursor = 'pointer';
  }

  InCHlib.prototype._cursor_mouseout = function() {
    document.body.style.cursor = 'default';
  }

  /**
    * Initiate InCHlib
    */
  InCHlib.prototype.init = function () {
    const self = this;
    // setTimeout is used to force synchronicity in canvas
    const loading_div = $('<div style="width: 300px; height: 300px; display: flex; align-items: center; justify-content: center;"></div>').html('<i class="fa fa-spinner fa-pulse" style="font-size: 32px"></i>');
    self.$element.after(loading_div);
    self.$element.hide();

    setTimeout(function () {
      self.read_data(self.options.data);
      self.draw();
    }, 50);

    setTimeout(function () {
      loading_div.fadeOut().remove();
      self.$element.show();
    }, 50);
  };

  $.fn[plugin_name] = function (options) {
    // note: this plugin only supports ONE instance
    return this.each(function () {
      if ($.data(this, 'plugin_' + plugin_name)) {
        $.removeData(this, 'plugin_' + plugin_name);
      }
      $.data(this, 'plugin_' + plugin_name, new InCHlib(this, options));
    })
  };
})(jQuery);
