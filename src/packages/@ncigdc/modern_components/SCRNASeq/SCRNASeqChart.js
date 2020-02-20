/* eslint-disable camelcase */

import React from 'react';
import Plot from 'react-plotly.js';

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

const SCRNASeqChart = ({ data, dataType }) => (
  <Plot
    config={config}
    data={data}
    layout={getLayout(dataType)}
    />
);

export default SCRNASeqChart;
