/* eslint-disable camelcase */

import React, { Component } from 'react';
import { isEqual } from 'lodash';

import { theme } from '@ncigdc/theme';
import './inchlib';

const category_colors = {
  Ethnicity: {
    hispanic_or_latino: 'rgb(255,150,148)', // pink
    not_hispanic_or_latino: 'rgb(215,40,40)', // red
    not_reported: 'rgb(255,189,122)', // yellow
  },
  Gender: {
    female: 'rgb(220,96,156)', // pink
    male: 'rgb(67,6,147)', // purple
  },
  Race: {
    american_indian_or_alaska_native: 'rgb(153, 223, 139)', // light green
    asian: 'rgb(30, 117, 179)', // dark blue
    black_or_african_american: 'rgb(175, 200, 233)', // light blue
    native_hawaiian_or_other_pacific_islander: 'rgb(44, 160, 44)', // dark green
    not_reported: 'rgb(255, 189, 122)', // light orange
    white: 'rgb(255, 127, 15)', // dark orange
  },
  'Vital Status': {
    alive: 'rgb(22,147,192)', // blue
    dead: 'rgb(138,0,0)', // red
  },
};

const options = {
  button_color: theme.primary,
  categories: {
    colors: category_colors,
  },
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
