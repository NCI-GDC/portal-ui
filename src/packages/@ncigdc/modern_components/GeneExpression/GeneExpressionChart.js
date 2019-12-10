/* eslint-disable camelcase */

import React, { Component } from 'react';
import { isEqual } from 'lodash';

import { theme } from '@ncigdc/theme';
import './inchlib';

const category_colors = {
  Age: 'RdBu',
  Smoking: 'PuOr',
  // Gender: 'Purples2',
};

class GeneExpressionChart extends Component {
  componentDidMount() {
    const { data } = this.props;
    this.options = {
      button_color: theme.primary,
      category_colors,
      data,
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
    // this doesn't work if jquery is imported
    // in this file
    this.$el = $(this.el);
    this.$el.InCHlib(this.options);
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;
    if (!isEqual(data, prevProps.data)) {
      const nextOptions = {
        ...this.options,
        ...{ data },
      };
      this.$el.InCHlib(nextOptions);
    }
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    // this.$el.InCHlib.destroy();
    // this.$el.InCHlib('destroy');
  }

  render() {
    return (
      <div ref={el => this.el = el} />
    );
  }
}

export default GeneExpressionChart;
