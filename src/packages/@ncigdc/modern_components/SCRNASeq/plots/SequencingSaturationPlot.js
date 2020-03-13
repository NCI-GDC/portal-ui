import React from 'react';
import Plotly from 'plotly.js/lib/index-basic';
import createPlotlyComponent from 'react-plotly.js/factory';

// setup plotly

const Plot = createPlotlyComponent(Plotly);

const config = {
  displaylogo: false,
  displayModeBar: true,
  modeBarButtons: [['toImage', 'resetScale2d']],
  scrollZoom: false,
  showAxisDragHandles: true,
  staticPlot: false,
};

const data = [
  {
    line: {
      width: 3,
    },
    mode: 'lines',
    name: '',
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
      0.09450769010047018,
      0.15377258533207913,
      0.1740928348556821,
      0.24186995018330684,
      0.3000755711056219,
      0.35039722540721835,
      0.3943605279659034,
      0.4298859268029742,
      0.4328746658010797,
      0.46693992783118726,
      0.49726807871181444,
      0.5243126238631172,
    ],
  },
];

const layout = {
  hovermode: 'closest',
  shapes: [
    {
      line: {
        color: 'rgb(128, 128, 128)',
        dash: 'dot',
        width: 4,
      },
      type: 'line',
      x0: 0,
      x1: 28918,
      y0: 0.9,
      y1: 0.9,
    },
  ],
  showlegend: false,
  width: 460,
  xaxis: {
    fixedrange: false,
    title: 'Mean Reads per Cell',
  },
  yaxis: {
    fixedrange: false,
    range: [0, 1],
    title: 'Sequencing Saturation',
  },
};

const style = { height: '380px' };

const SequencingSaturationPlot = () => (
  <Plot config={config} data={data} layout={layout} style={style} />
);

export default SequencingSaturationPlot;
