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
  initialHeight,
  // setInitialHeight,
  size: { height, width },
  uniqueGridClass,
}) => {
  // if (initialHeight === 0) {
  //   setInitialHeight(height);
  // }
  const layoutParams = {
    dataType,
    height: isFullScreen() ? height : initialHeight,
    width,
  };
  console.log({
    dataType,
    height,
    initialHeight,
    type: 'render',
    width,
  });
  return (
    <div
      className="scrnaseq-plot"
      ref={r => {
        containerRefs[uniqueGridClass] = r;
      }}
      >
      <Row className="scrnaseq-toolbar">
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
  withState('initialHeight', 'setInitialHeight', null),
  withProps(({ data }) => ({
    dataWithMarkers: utils.getDataWithMarkers(data),
  })),
  withSize({ monitorHeight: true }),
  withHandlers({
    handleInitialize: ({
      setGraphDiv,
      // setInitialHeight,
      setUniqueGridClass,
      // size: { height },
    }) => (figure, graphDiv) => {
      setGraphDiv(graphDiv);
      setUniqueGridClass(GRID_CLASS + uniqueId());
      // setInitialHeight(height);
    },
    handleToolbarClick: ({
      data,
      dataType,
      graphDiv,
      initialHeight,
      setInitialHeight,
      size: { height, width },
      uniqueGridClass,
    }) => e => {
      console.log({
        dataType,
        height,
        initialHeight,
        type: 'toolbarClick',
        width,
      });
      e.persist();
      const name = e.target.getAttribute('data-name');
      const layoutParams = {
        dataType,
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
        // button works
        if (isFullScreen()) {
          Plotly.react(graphDiv, data, utils.getLayout({
            ...layoutParams,
            height,
          }));
          exitFullScreen();
        } else {
          enterFullScreen(containerRefs[uniqueGridClass]);
          Plotly.react(graphDiv, data, utils.getLayout({
            ...layoutParams,
            // height,
          }));
          if (initialHeight === null) {
            // set initialHeight for the first time
            // TODO: change initialHeight on resize IF not fullscreen!
            setInitialHeight(height);
          }
        }
      } else if (name === 'react') {
        // button works
        Plotly.react(graphDiv, data, utils.getLayout(layoutParams));
      } else {
        // use Plotly button functions
        ModeBarButtons[name].click(graphDiv, e);
      }
    },
  }),
  pure,
)(SCRNASeqPlot);
