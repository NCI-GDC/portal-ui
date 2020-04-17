/* eslint-disable camelcase */

import React, { Component } from 'react';
import ModeBarButtons from 'plotly.js/src/components/modebar/buttons';
import Plotly from 'plotly.js/lib/index-basic';
import createPlotlyComponent from 'react-plotly.js/factory';
import { uniqueId } from 'lodash';

import { Column, Row } from '@ncigdc/uikit/Flex';
import {
  exitFullScreen,
  enterFullScreen,
  isFullScreen,
} from '@ncigdc/utils/fullscreen';

import { DownloadButton, ToolbarButton } from '../toolbar';
import * as utils from './utils';

const Plot = createPlotlyComponent(Plotly);
const toolbarButtons = utils.getToolbarButtons();
const containerRefs = {};
const GRID_CLASS = 'scrnaseq-wrapper';

export default class SCRNASeqPlot extends Component {
  state = {
    graphDiv: '',
    uniqueGridClass: '',
  };

  onInitialized = (figure, graphDiv) => {
    this.setState({
      graphDiv,
      uniqueGridClass: GRID_CLASS + uniqueId(),
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
    } else if (name === 'react' || name === 'fullscreen') {
      if (name === 'fullscreen') {
        if (isFullScreen()) {
          exitFullScreen();
        } else {
          const { uniqueGridClass } = this.state;
          enterFullScreen(containerRefs[uniqueGridClass]);
        }
      }
      const { data, dataType } = this.props;
      // TODO pass fullscreen into getLayout
      Plotly.react(graphDiv, data, utils.getLayout(dataType));
    } else {
      ModeBarButtons[name].click(graphDiv, e);
    }
  };

  render() {
    const { data, dataType } = this.props;
    const { uniqueGridClass } = this.state;

    const dataWithMarkers = utils.getDataWithMarkers(data);

    console.log('render');

    return (
      <Column
        className="scrnaseq-cluster-plot"
        >
        <div
          ref={r => {
            containerRefs[uniqueGridClass] = r;
          }}
          style={{
            ...isFullScreen() &&
              utils.styles.fullscreen,
          }}
          >
          <Row
            style={{
              justifyContent: 'flex-end',
              maxWidth: utils.width,
              position: 'relative',
              width: utils.width,
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
            layout={utils.getLayout(dataType)}
            onInitialized={this.onInitialized}
            />
        </div>
      </Column>
    );
  }
}
