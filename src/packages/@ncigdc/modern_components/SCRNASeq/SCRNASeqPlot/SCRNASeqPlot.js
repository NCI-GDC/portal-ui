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
import moment from 'moment';

import { Row } from '@ncigdc/uikit/Flex';
import {
  exitFullScreen,
  enterFullScreen,
  isFullScreen,
} from '@ncigdc/utils/fullscreen';
import { GlobalTooltip } from '@ncigdc/uikit/Tooltip';

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
  isReloading,
  size: { height, width },
  uniqueGridClass,
}) => {
  const checkFullScreen = !!isFullScreen();
  const layoutParams = {
    dataType,
    fullscreen: checkFullScreen,
    height,
    width,
  };
  return (
    <div
      className={`scrnaseq-plot${isReloading ? ' reloading' : ''}`}
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
        {checkFullScreen && <GlobalTooltip />}
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
  withState('isReloading', 'setIsReloading', false),
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
      setIsReloading,
      size: { height, width },
      uniqueGridClass,
    }) => e => {
      e.persist();
      const name = e.target.getAttribute('data-name');
      const checkFullScreen = !!isFullScreen();
      const layoutParams = {
        dataType,
        fullscreen: checkFullScreen,
        height,
        width,
      };
      if (name === 'downloadImage') {
        const format = e.target.getAttribute('data-format');
        const scale = e.target.getAttribute('data-scale');
        Plotly.downloadImage(graphDiv, {
          filename: `scrnaseq-${dataType.toLowerCase().replace('-', '')}-${moment().format('YYYY-MM-DD-HHmmss')}`,
          format,
          scale,
        });
      } else if (name === 'fullscreen') {
        if (checkFullScreen) {
          exitFullScreen();
        } else {
          enterFullScreen(containerRefs[uniqueGridClass]);
        }
        Plotly.react(graphDiv, data, utils.getLayout(layoutParams));
      } else if (name === 'react') {
        setIsReloading(true, () => setIsReloading(false));
      } else {
        // use Plotly's built-in button functions
        ModeBarButtons[name].click(graphDiv, e);
      }
    },
  }),
  pure,
)(SCRNASeqPlot);
