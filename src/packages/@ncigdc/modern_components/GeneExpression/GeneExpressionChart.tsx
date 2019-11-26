import React, { Component } from 'react';

interface IProps {
  [x:string] :any,
}
interface IState {
  [x:string] :any,
}

class GeneExpressionChart extends Component<IProps, IState> {
  $el: any;
  el: any;
  // [x:string] :any,
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.somePlugin();
  }
  componentWillUnmount() {
    this.$el.somePlugin('destroy');
  }
  render() {
    return <div ref={el => this.el = el} />;
  }
}

export default GeneExpressionChart;