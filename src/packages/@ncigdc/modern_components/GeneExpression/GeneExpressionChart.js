/* eslint-disable camelcase */

import React, { Component } from 'react';
import { isEqual } from 'lodash';

import { theme } from '@ncigdc/theme';
import './inchlib';
import { CATEGORY_COLORS } from '@ncigdc/utils/constants';

import './inchlib/style.css';

const options = {
  button_color: theme.primary,
  categories: {
    colors: CATEGORY_COLORS,
  },
  max_width: 800,
  tooltip: {
    fill: '#fff',
    stroke: theme.greyScale5,
    text_fill: theme.greyScale2,
  },
};

const handleOverlayClickOut = ({ target }) => {
  const id = 'InCHlib';
  if (target.id !== id && target.closest(`#${id}`) === null) {
    const overlay = document.querySelector(`#${id} .target_overlay`);
    if (overlay !== null) {
      overlay.click();
    }
    const download_menu = document.querySelector(`#${id} .inchlib-download`);
    if (download_menu !== null) {
      download_menu.remove();
    }
  }
};

class GeneExpressionChart extends Component {
  componentDidMount() {
    const { data, handleClickInchlibLink } = this.props;
    this.options = {
      ...options,
      data,
    };
    // this doesn't work if jquery is imported
    // in this file. ignore the eslint error
    this.$el = $(this.el);
    this.$el.InCHlib(this.options);
    this.el.addEventListener('clickInchlibLink', handleClickInchlibLink);
    document.addEventListener('click', handleOverlayClickOut);
  }

  componentDidUpdate(prevProps) {
    // for viz demo
    // unsure if data will update in final version
    const { data, handleClickInchlibLink } = this.props;
    if (!isEqual(data, prevProps.data)) {
      // destroy inchlib
      this.el.removeEventListener('clickInchlibLink', handleClickInchlibLink);
      this.$el.children().remove();

      const nextOptions = {
        ...this.options,
        data,
      };
      this.$el.InCHlib(nextOptions);
      this.el.addEventListener('clickInchlibLink', handleClickInchlibLink);
    }
  }

  componentWillUnmount() {
    const { handleClickInchlibLink } = this.props;
    // destroy inchlib
    this.el.removeEventListener('clickInchlibLink', handleClickInchlibLink);
    document.removeEventListener('click', handleOverlayClickOut);
    this.$el.children().remove();
  }

  render() {
    return (
      <div className="inchlib-container" ref={el => this.el = el} />
    );
  }
}

export default GeneExpressionChart;
