import React, { Component } from 'react';
// import Konva from 'konva';
// import inchlib from '@inchlib/inchlib';

interface IProps {
  [x:string] :any,
}
interface IState {
  [x:string] :any,
}

// const inchlibOptions = {

// };

class GeneExpressionChart extends Component<IProps, IState> {
  $el: any;
  el: any;
  // [x:string] :any,
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.somePlugin();
  }
  componentWillUnmount() {
    // if inchlib doesn't have cleanup methods, 
    // we have to add our own.
    // TODO remove event listeners
    this.$el.somePlugin('destroy');
  }
  render() {
    return <div ref={el => this.el = el} />;
  }
}

export default GeneExpressionChart;