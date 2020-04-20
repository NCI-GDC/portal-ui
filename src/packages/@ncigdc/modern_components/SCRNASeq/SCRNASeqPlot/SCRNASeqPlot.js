/* eslint-disable camelcase */

import React from 'react';
import ModeBarButtons from 'plotly.js/src/components/modebar/buttons';
import Plotly from 'plotly.js/lib/index-basic';
import createPlotlyComponent from 'react-plotly.js/factory';
import { uniqueId } from 'lodash';
import {
  compose,
  setDisplayName,
  withHandlers,
  withProps,
  withState,
  lifecycle,
} from 'recompose';

import { Row } from '@ncigdc/uikit/Flex';
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

const SCRNASeqPlot = ({
  dataType,
  dataWithMarkers,
  handleInitialize,
  handleToolbarClick,
  uniqueGridClass,
}) => {
  return (
    <div
      className="scrnaseq-cluster-plot"
      ref={r => {
        containerRefs[uniqueGridClass] = r;
      }}
      style={{
        background: '#fff',
        width: '100%',
      }}
      >
      <Row
        style={{
          justifyContent: 'flex-end',
          paddingRight: 10,
          position: 'relative',
          width: '100%',
        }}
        >
        {toolbarButtons.map(btn => (btn.name === 'download'
          ? (
            <DownloadButton
              {...btn}
              key="download"
              onToolbarClick={handleToolbarClick}
              />
          )
          : (
            <ToolbarButton
              {...btn}
              key={btn.name}
              onToolbarClick={handleToolbarClick}
              />
          )))}
      </Row>
      <Plot
        config={utils.config}
        data={dataWithMarkers}
        layout={utils.getLayout(dataType, isFullScreen())}
        onInitialized={handleInitialize}
        />
    </div>
  );
};

export default compose(
  setDisplayName('EnhancedSCRNASeqPlot'),
  withState('graphDiv', 'setGraphDiv', ''),
  withState('uniqueGridClass', 'setUniqueGridClass', ''),
  withProps(({ data }) => ({
    dataWithMarkers: utils.getDataWithMarkers(data),
  })),
  withHandlers({
    resizeHandler: () => {
      this.child.resizeHandler();
      window.dispatchEvent(new Event('resize'));
    },
    handleEsc: ({ data, dataType, graphDiv }) => e => {
      if (e.keyCode === 27) {
        console.log('handle esc, pressed escape key');
        Plotly.react(graphDiv, data, utils.getLayout(dataType, false));
      }
    },
    handleInitialize: ({
      setGraphDiv,
      setUniqueGridClass,
    }) => (figure, graphDiv) => {
      setGraphDiv(graphDiv);
      setUniqueGridClass(GRID_CLASS + uniqueId());
    },
    handleToolbarClick: ({
      data,
      dataType,
      graphDiv,
      uniqueGridClass,
    }) => e => {
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
      } else if (name === 'fullscreen') {
        // button works
        if (isFullScreen()) {
          Plotly.react(graphDiv, data, utils.getLayout(dataType, false));
          exitFullScreen();
        } else {
          enterFullScreen(containerRefs[uniqueGridClass]);
          Plotly.react(graphDiv, data, utils.getLayout(dataType, true));
        }
      } else if (name === 'react') {
        // button works
        Plotly.react(graphDiv, data, utils.getLayout(dataType, isFullScreen()));
      } else {
        // use Plotly button functions
        ModeBarButtons[name].click(graphDiv, e);
      }
    },
  }),
  lifecycle({
    componentDidMount() {
      document.addEventListener('keydown', this.props.handleEsc, false);
    },
    componentWillUnmount() {
      document.removeEventListener('keydown', this.props.handleEsc, false);
    },
  }),
)(SCRNASeqPlot);
