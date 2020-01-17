/* eslint-disable camelcase */

import React, { Component } from 'react';
import { isEqual } from 'lodash';

import { theme } from '@ncigdc/theme';
import './inchlib';

const category_colors = {
  'Age at Diagnosis': 'BuGn',
  'Days to Death': 'Blues',
  Ethnicity: 'PuOr',
  Gender: 'PiYG2',
  Race: 'YlOrB',
  'Vital Status': 'RdBu',
};

const options = {
  button_color: theme.primary,
  category_colors,
  font: {
    color: '#767676',
    family: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    size: 12,
  },
  max_width: 800,
  tooltip: {
    fill: '#fff',
    stroke: theme.greyScale5,
    text_fill: theme.greyScale2,
  },
};

class GeneExpressionChart extends Component {
  componentDidMount() {
    const { data, handleClickInchlibLink } = this.props;
    this.options = {
      ...options,
      data,
    };
    // this doesn't work if jquery is imported
    // in this file
    this.$el = $(this.el);
    this.$el.InCHlib(this.options);

    this.el.addEventListener('clickInchlibLink', handleClickInchlibLink);
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;
    if (!isEqual(data, prevProps.data)) {
      // for viz demo
      // unsure if data will update in final version
      const nextOptions = {
        ...this.options,
        data,
      };
      this.$el.InCHlib(nextOptions);
    }
  }

  componentWillUnmount() {
    const { handleClickInchlibLink } = this.props;
    this.el.removeEventListener('clickInchlibLink', handleClickInchlibLink);
    // TODO: destroy this properly
    // this.$el.InCHlib('destroy');
  }

  render() {
    return (
      <div ref={el => this.el = el} />
    );
  }
}

export default GeneExpressionChart;
