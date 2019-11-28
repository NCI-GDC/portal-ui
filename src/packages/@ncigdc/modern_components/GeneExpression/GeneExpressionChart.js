import React, { Component } from 'react';
// import $ from 'jquery';
// import Konva from 'konva';

// import './inchlib/konva.min';
import './inchlib/inchlib.css';
// import InCHlib from './inchlib/inchlib_dev';
import inchlibData from './inchlib/zhenyu-10x5';

interface IProps {
  [x:string] :any,
}
interface IState {
  [x:string] :any,
}

const inchlibOptions = {
  column_metadata: true,
  heatmap_colors: 'RdBkGr',
  max_height: 800,
  metadata_colors: 'BuWhRd',
  metadata: true,
  target: 'inchlib',
  width: 800,
};

class GeneExpressionChart extends Component<IProps, IState> {
  // $inchlib: any;
  // inchlib: any;
  // [x:string] :any,

  // inchlib = new InCHlib(inchlibOptions);

  componentDidMount() {
    const inchlib = new InCHlib(inchlibOptions);
    inchlib.read_data(inchlibData);
    inchlib.draw();
    console.log(inchlib);

    // this.inchlib = inchlib;
  }
  // componentWillUnmount() {
    // if inchlib doesn't have cleanup methods,
    // we have to add our own.
    // TODO remove event listeners
    // this.inchlib.destroy();
  // }

  render() {
    return (
      <div
        id="inchlib"
        // ref={inchlib => this.inchlib = inchlib}
        />
    );
  }
}

export default GeneExpressionChart;
