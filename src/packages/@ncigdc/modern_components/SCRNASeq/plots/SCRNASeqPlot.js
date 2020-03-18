/* eslint-disable camelcase */

import React, { Component } from 'react';
import ModeBarButtons from 'plotly.js/src/components/modebar/buttons';
import Plotly from 'plotly.js/lib/index-basic';
import createPlotlyComponent from 'react-plotly.js/factory';

import { Column, Row } from '@ncigdc/uikit/Flex';

import { DownloadButton, ToolbarButton } from '../toolbar';
import * as common from './common';

// setup Plotly layout & config

const Plot = createPlotlyComponent(Plotly);

const getLayout = dataType => {
  const dataTypeCaps = dataType.toUpperCase();
  const { axisFont, axisStyles, font } = common.layoutDefaults;
  return {
    ...common.layout,
    height: 500,
    legend: {
      ...font,
      ...axisFont,
    },
    name: 'scrna_seq',
    title: {
      font,
      text: `${dataTypeCaps} projection of Cells Colored by Automated Clustering`,
    },
    width: 700,
    xaxis: {
      ...axisStyles,
      title: `${dataTypeCaps}_1`,
    },
    yaxis: {
      ...axisStyles,
      title: `${dataTypeCaps}_2`,
    },
  };
};

// setup custom toolbar

const getToolbarButtons = () => {
  const {
    download, pan, reset, zoom, zoomIn, zoomOut,
  } = common.toolbarButtons;
  return [
    reset,
    pan,
    zoom,
    zoomIn,
    zoomOut,
    download,
  ];
};

const toolbarButtons = getToolbarButtons();

const getDataWithMarkers = (input = []) => input.map(row => ({
  ...row,
  marker: {
    opacity: 0.75,
    size: 10,
  },
}));

export default class SCRNASeqChart extends Component {
  state = {
    graphDiv: '',
  };

  onInitialized = (figure, graphDiv) => {
    this.setState({
      graphDiv,
    });
  };

  handleToolbarClick = e => {
    const { graphDiv } = this.state;
    e.persist();
    const name = e.target.getAttribute('data-name');
    if (name === 'downloadImage') {
      const format = e.target.getAttribute('data-format');
      const scale = e.target.getAttribute('data-scale');
      Plotly.downloadImage(graphDiv, {
        filename: 'scrnaseq',
        format,
        scale,
      });
    } else {
      ModeBarButtons[name].click(graphDiv, e);
    }
  };

  render() {
    const { data, dataType } = this.props;

    const dataWithMarkers = getDataWithMarkers(data);

    return (
      <Column>
        <Row
          style={{
            justifyContent: 'flex-end',
            maxWidth: 700,
            position: 'relative',
            width: 700,
          }}
          >
          {toolbarButtons.map(btn => (btn.name === 'download'
            ? (
              <DownloadButton
                {...btn}
                key="download"
                onToolbarClick={this.handleToolbarClick}
                />
            )
            : (
              <ToolbarButton
                {...btn}
                key={btn.name}
                onToolbarClick={this.handleToolbarClick}
                />
            )))}
        </Row>
        <Plot
          config={common.config}
          data={dataWithMarkers}
          layout={getLayout(dataType)}
          onInitialized={this.onInitialized}
          />
      </Column>
    );
  }
}
