/* eslint-disable camelcase */

import React, { Component } from 'react';
import ModeBarButtons from 'plotly.js/src/components/modebar/buttons';
import Plotly from 'plotly.js/lib/index-basic';
import createPlotlyComponent from 'react-plotly.js/factory';

import { Column, Row } from '@ncigdc/uikit/Flex';
import {
  exitFullScreen,
  enterFullScreen,
  isFullScreen,
} from '@ncigdc/utils/fullscreen';

import { DownloadButton, ToolbarButton } from '../toolbar';
import * as utils from './utils';

// setup Plotly layout & config

const Plot = createPlotlyComponent(Plotly);

const width = 460;

const getLayout = dataType => {
  const dataTypeCaps = dataType.toUpperCase();
  const { axisFont, axisStyles, font } = utils.layoutDefaults;
  return {
    ...utils.layout,
    height: 350,
    legend: {
      ...font,
      ...axisFont,
    },
    name: 'scrna_seq',
    title: {
      font,
      text: `${dataTypeCaps} Projection of<br>Cells Colored by Automated Clustering`,
    },
    width,
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
    download, fullscreen, pan, reset, zoom, zoomIn, zoomOut,
  } = utils.toolbarButtons;
  return [
    // intentionally not alphabetized
    reset,
    pan,
    zoom,
    zoomIn,
    zoomOut,
    download,
    fullscreen,
  ];
};

const toolbarButtons = getToolbarButtons();

const getDataWithMarkers = (input = []) => input.map(row => ({
  ...row,
  marker: {
    opacity: 0.75,
    size: 4,
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
    } else if (name === 'react') {
      const { data, dataType } = this.props;
      Plotly.react(graphDiv, data, getLayout(dataType));
    } else if (name === 'fullscreen') {
      if (isFullScreen()) {
        exitFullScreen();
        oncoGrid.reload();
      } else {
        enterFullScreen(containerRefs[uniqueGridClass]);
        oncoGrid.resize(
          screen.width - 400,
          screen.height - 400,
          true,
        );
      }
    } else {
      ModeBarButtons[name].click(graphDiv, e);
    }
  };

  render() {
    const {
      className, data, dataType, style = {},
    } = this.props;

    const dataWithMarkers = getDataWithMarkers(data);

    return (
      <Column className={className} style={style}>
        <Row
          style={{
            justifyContent: 'flex-end',
            maxWidth: width,
            position: 'relative',
            width,
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
          config={utils.config}
          data={dataWithMarkers}
          layout={getLayout(dataType)}
          onInitialized={this.onInitialized}
          />
      </Column>
    );
  }
}
