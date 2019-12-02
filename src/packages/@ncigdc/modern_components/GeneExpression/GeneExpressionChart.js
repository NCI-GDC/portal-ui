import React, { Component } from 'react';
import data from './inchlib/data';
import './inchlib/inchlib';

class GeneExpressionChart extends Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.InCHlib();
  }

  componentWillUnmount() {
    // if inchlib doesn't have cleanup methods,
    // we have to add our own.
    // TODO remove event listeners added in componentDidMount
  }

  render() {
    return (
      <div
        id="inchlib"
        ref={el => this.el = el}
        />
    );
  }
}

export default GeneExpressionChart;
