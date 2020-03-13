import React from 'react';
import Plotly from 'plotly.js/lib/index-basic';
import createPlotlyComponent from 'react-plotly.js/factory';

import * as common from './common';

const Plot = createPlotlyComponent(Plotly);

const data = [
  {
    line: {
      width: 3,
    },
    mode: 'lines',
    name: 'GRCh38',
    x: [
      0,
      2892,
      5000,
      5784,
      8675,
      11567,
      14459,
      17351,
      20000,
      20242,
      23134,
      26026,
      28918,
    ],
    y: [
      0,
      506,
      721,
      786,
      992,
      1148,
      1276,
      1380,
      1456,
      1461,
      1535,
      1593,
      1644,
    ],
  },
];

const layout = {
  ...common.layoutSmallPlots,
  legend: {
    ...common.layoutDefaults.font,
    ...common.layoutDefaults.axisFont,
  },
  name: 'median_genes',
  showlegend: true,
  title: {
    font: common.layoutDefaults.font,
    text: 'Median Genes per Cell',
  },
  xaxis: {
    ...common.layoutDefaults.axisStyles,
    fixedrange: true,
    title: 'Mean Reads per Cell',
  },
  yaxis: {
    ...common.layoutDefaults.axisStyles,
    fixedrange: true,
    title: 'Median Genes per Cell',
  },
};

const MedianGenesPlot = () => (
  <Plot
    config={common.configSmallPlots}
    data={data}
    layout={layout}
    style={common.styleSmallPlots}
    />
);

export default MedianGenesPlot;
