import React from 'react';
// import Loader from '@ncigdc/uikit/Loaders/Loader';
import { renderBoxPlot } from '@oncojs/boxplot';

class BoxPlotWrapper extends React.Component {
  state = {
    svgWrapper: null,
  }

  componentDidUpdate = ({ data }, { svgWrapper: prevSvgWrapper }) => {
    const { svgWrapper } = this.state;
    if (prevSvgWrapper !== svgWrapper) {
      const {
        height,
        width,
      } = svgWrapper.getBoundingClientRect();

      renderBoxPlot({
        container: svgWrapper,
        data: Object.keys(data).reduce((acc, key) => Object.assign(
          acc,
          [
            'Max',
            'Median',
            'Min',
            'IQR',
            'q1',
            'q3',
          ].includes(key) && { [key.toLowerCase()]: data[key] },
        ), {}),
        height,
        width,
      });
    }
  }

  setSvgWrapper = r => {
    const { svgWrapper } = this.state;
    r && !svgWrapper && this.setState({ svgWrapper: r });
  }

  render = () => (
    <figure
      ref={this.setSvgWrapper}
      style={{
        height: '100%',
        width: '100%',
      }}
      />
  );

/* <Loader
  className={uniqueClass}
  height={height}
  loading={PlotLoading}
  > */
/* </Loader> */
}

export default BoxPlotWrapper;
