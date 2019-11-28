import React, { Component } from 'react';
import inchlibData from './inchlib/zhenyu-10x5';

// ============================= //
// PSA: don't use inchlib_dev.js //
// it doesn't work!              //
// ============================= //

const inchlibOptions = {
  column_metadata: true,
  heatmap_colors: 'RdBkGr',
  max_height: 800,
  metadata_colors: 'BuWhRd',
  metadata: true,
  target: 'inchlib',
  width: 800,
};

class GeneExpressionChart extends Component {
  inchlib = new InCHlib(inchlibOptions);

  componentDidMount() {
    this.inchlib.read_data(inchlibData);
    this.inchlib.draw();
  }

  componentWillUnmount() {
    // if inchlib doesn't have cleanup methods,
    // we have to add our own.
    // TODO remove event listeners added in componentDidMount
    this.inchlib.destroy();
  }

  render() {
    return (
      <div id="inchlib" />
    );
  }
}

export default GeneExpressionChart;
