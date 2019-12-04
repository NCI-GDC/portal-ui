/* eslint-disable camelcase */

import React, { Component } from 'react';

import { theme } from '@ncigdc/theme';
import data from './inchlib/data';
import './inchlib';

class GeneExpressionChart extends Component {
  componentDidMount() {
    const options = {
      button_color: theme.primary,
      data,
      font: {
        color: '#767676',
        family: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        size: 12,
      },
      max_width: 800,
    };
    // this doesn't work if jquery is imported
    // in this file
    this.$el = $(this.el);
    this.$el.InCHlib(options);
  }

  componentWillUnmount() {
    // if inchlib doesn't have cleanup methods,
    // we have to add our own.
    // TODO remove event listeners added in componentDidMount
    // and destroy the inchlib chart
  }

  render() {
    return (
      <div ref={el => this.el = el} />
    );
  }
}

export default GeneExpressionChart;
