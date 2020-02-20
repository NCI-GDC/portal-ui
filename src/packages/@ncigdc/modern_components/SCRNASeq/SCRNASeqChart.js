/* eslint-disable camelcase */

import React, { Component } from 'react';
import ModeBarButtons from 'plotly.js/src/components/modebar/buttons';
import Plotly from 'plotly.js';
import createPlotlyComponent from 'react-plotly.js/factory';

const Plot = createPlotlyComponent(Plotly);

const getLayout = dataType => {
  const dataTypeCaps = dataType.toUpperCase();
  return {
    height: 400,
    margin: {
      b: 70,
      l: 70,
      r: 0,
      t: 30,
    },
    name: 'scrna_seq',
    title: `${dataTypeCaps} Sample Data`,
    width: 700,
    xaxis: {
      autorange: true,
      title: `${dataTypeCaps}_1`,
      type: 'linear',
    },
    yaxis: {
      autorange: true,
      title: `${dataTypeCaps}_2`,
      type: 'linear',
    },
  };
};

const config = {
  displaylogo: false,
  displayModeBar: true,
  modeBarButtonsToRemove: ['sendDataToCloud'],
  showLink: false,
  toImageButtonOptions: {
    filename: 'scrna_seq',
    format: 'svg', // one of png, svg, jpeg, webp
  },

};

export default class SCRNASeqChart extends Component {
  state = { graphDiv: '' };

  onInitialized = (figure, graphDiv) => {
    this.setState({ graphDiv });
  };

  render() {
    const { data, dataType } = this.props;
    const { graphDiv } = this.state;
    return (
      <React.Fragment>
        <button
          data-attr="zoom"
          data-val="in"
          onClick={(e) => {
            console.log('onclick button ', e.target.dataset);
            e.persist();
            ModeBarButtons.zoomIn2d.click(graphDiv, e);
          }}
          type="button"
          >
        zoom in
        </button>
        <button
          data-attr="zoom"
          data-val="out"
          onClick={(e) => {
            console.log('onclick button ', e.target.dataset);
            e.persist();
            ModeBarButtons.zoomIn2d.click(graphDiv, e);
          }}
          type="button"
          >
        zoom out
        </button>
        <Plot
          config={config}
          data={data}
          layout={getLayout(dataType)}
          onInitialized={this.onInitialized}
          />
      </React.Fragment>
    );
  }
}
