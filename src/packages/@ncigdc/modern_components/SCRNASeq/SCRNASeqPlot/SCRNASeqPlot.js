/* eslint-disable camelcase */

import React from 'react';
import ModeBarButtons from 'plotly.js/src/components/modebar/buttons';
import Plotly from 'plotly.js/lib/index-basic';
import createPlotlyComponent from 'react-plotly.js/factory';
import { uniqueId } from 'lodash';
import {
  compose,
  pure,
  setDisplayName,
  withHandlers,
  withProps,
  withState,
} from 'recompose';

import { Row } from '@ncigdc/uikit/Flex';
import {
  exitFullScreen,
  enterFullScreen,
  isFullScreen,
} from '@ncigdc/utils/fullscreen';
import withSize from '@ncigdc/utils/withSize';

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
  size: { height, width },
  uniqueGridClass,
}) => {
  const layoutParams = {
    dataType,
    fullscreen: isFullScreen(),
    ...isFullScreen() && { height },
    width,
  };
  return (
    <div
      className="scrnaseq-plot"
      ref={r => {
        containerRefs[uniqueGridClass] = r;
      }}
      >
      <Row className="scrnaseq-toolbar">
        {toolbarButtons.map(btn => (btn.name === 'downloadImage'
          ? (
            <DownloadButton
              {...btn}
              key={btn.name}
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
        layout={utils.getLayout(layoutParams)}
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
  withSize({ monitorHeight: true }),
  withHandlers({
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
      size: { height, width },
      uniqueGridClass,
    }) => e => {
      e.persist();
      const name = e.target.getAttribute('data-name');
      const layoutParams = {
        dataType,
        fullscreen: isFullScreen(),
        ...isFullScreen() && { height },
        width,
      };
      if (name === 'downloadImage') {
        const format = e.target.getAttribute('data-format');
        const scale = e.target.getAttribute('data-scale');
        Plotly.downloadImage(graphDiv, {
          filename: 'scrnaseq',
          format,
          scale,
        });
      } else if (name === 'fullscreen') {
        if (isFullScreen()) {
          exitFullScreen();
        } else {
          enterFullScreen(containerRefs[uniqueGridClass]);
        }
        Plotly.react(graphDiv, data, utils.getLayout(layoutParams));
      } else if (name === 'react') {
        Plotly.react(graphDiv, data, utils.getLayout(layoutParams));
      } else {
        // use Plotly's built-in button functions
        ModeBarButtons[name].click(graphDiv, e);
      }
    },
  }),
  pure,
)(SCRNASeqPlot);
