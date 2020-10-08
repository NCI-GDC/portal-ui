/* eslint-disable camelcase */

import React, { Component } from 'react';
// import { isEqual } from 'lodash';

import { theme } from '@ncigdc/theme';
import { CATEGORY_COLORS } from '@ncigdc/utils/constants';

import './inchlib';
import './inchlib/style.css';

const options = {
  button_color: theme.primary,
  case_metadata_fields: ['case_id', 'submitter_id'],
  categories: {
    colors: CATEGORY_COLORS,
  },
  centering: 'geneExpression',
  max_width: 1200,
  tooltip: {
    fill: '#fff',
    stroke: theme.greyScale5,
    text_fill: theme.greyScale2,
  },
};

const handleOverlayClickOut = ({ target }) => {
  const id = 'InCHlib';
  if (target.id !== id && $(target).closest(`#${id}`).length === 0) {
    const overlay = $(`#${id} .inchlib-overlay`);
    if (overlay.length === 1) {
      overlay.trigger('click');
    }
  }
};

class GeneExpressionChart extends Component {
  handlers = {}

  componentDidMount() {
    const {
      handleClickInchlibLink,
      handleFileDownloads,
      handleLoading,
      visualizationData,
    } = this.props;
    this.handlers = {
      handleFileDownloads,
      handleLoading,
    };
    this.options = {
      ...options,
      data: visualizationData,
    };
    this.$el = $(this.el);
    this.$el.InCHlib(this.options, this.handlers);
    this.el.addEventListener('clickInchlibLink', handleClickInchlibLink);
    document.addEventListener('click', handleOverlayClickOut);
  }

  // not used currently.
  // on analysis switch, component unmounts & mounts again.
  // componentDidUpdate(prevProps) {
  //   const { handleClickInchlibLink, visualizationData } = this.props;
  //   if (!isEqual(visualizationData, prevProps.visualizationData)) {
  //     this.destroyInchlib();

  //     const nextOptions = {
  //       ...this.options,
  //       data: visualizationData,
  //     };
  //     this.$el.InCHlib(nextOptions, this.handlers);
  //     this.el.addEventListener('clickInchlibLink', handleClickInchlibLink);
  //   }
  // }

  componentWillUnmount() {
    this.destroyInchlib();
  }

  destroyInchlib() {
    const { handleClickInchlibLink } = this.props;
    this.$el.trigger('destroy.inchlib');
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
