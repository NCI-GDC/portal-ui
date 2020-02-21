/* eslint-disable camelcase */

import React, { Component } from 'react';
import ModeBarButtons from 'plotly.js/src/components/modebar/buttons';
import Plotly from 'plotly.js';
import createPlotlyComponent from 'react-plotly.js/factory';

import { Row } from '@ncigdc/uikit/Flex';
import './style.css';

import ToolbarButton from './ToolbarButton';
import DownloadButton from './DownloadButton';

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

const toolbarButtons = [
  // https://github.com/plotly/plotly.js/blob/master/src/components/modebar/buttons.js
  {
    attr: 'zoom',
    faClass: 'fa-undo',
    label: 'Reset Axes',
    name: 'resetScale2d',
    val: 'reset',
  },
  {
    attr: 'dragmode',
    faClass: 'fa-arrows',
    label: 'Pan',
    name: 'pan2d',
    val: 'pan',
  },
  {
    attr: 'dragmode',
    faClass: 'fa-search',
    label: 'Zoom',
    name: 'zoom2d',
    val: 'zoom',
  },
  {
    attr: 'zoom',
    faClass: 'fa-search-plus',
    label: 'Zoom In',
    name: 'zoomIn2d',
    val: 'in',
  },
  {
    attr: 'zoom',
    faClass: 'fa-search-minus',
    label: 'Zoom Out',
    name: 'zoomOut2d',
    val: 'out',
  },
  {
    faClass: 'fa-download',
    label: 'Download',
    name: 'download',
  },
];

export default class SCRNASeqChart extends Component {
  state = { graphDiv: '' };

  onInitialized = (figure, graphDiv) => {
    this.setState({ graphDiv });
  };

  handleToolbarClick = e => {
    const { graphDiv } = this.state;
    e.persist();
    const name = e.target.getAttribute('data-name');
    ModeBarButtons[name].click(graphDiv, e);
  };

  render() {
    const { data, dataType } = this.props;

    return (
      <React.Fragment>
        <Row
          style={{
            justifyContent: 'flex-end',
            maxWidth: 700,
          }}
          >
          {toolbarButtons.map(btn => (btn.name === 'download'
            ? (
              <DownloadButton
                {...btn}
                onToolbarClick={this.handleToolbarClick}
                />
            )
            : (
              <ToolbarButton
                {...btn}
                key={btn.label}
                onToolbarClick={this.handleToolbarClick}
                />
            )))}
        </Row>
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
