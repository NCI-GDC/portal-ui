import React, { Component } from 'react';

interface Props {
}
interface State {

}

class GeneExpressionChart extends Component<Props, State> {
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