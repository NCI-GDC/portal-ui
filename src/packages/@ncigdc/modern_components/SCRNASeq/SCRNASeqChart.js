/* eslint-disable camelcase */

import React, { Component } from 'react';
import ModeBarButtons from 'plotly.js/src/components/modebar/buttons';
import Plotly from 'plotly.js';
import createPlotlyComponent from 'react-plotly.js/factory';

import { Row } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { visualizingButton } from '@ncigdc/theme/mixins';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import Hidden from '@ncigdc/components/Hidden';

// import ToolbarButton from './ToolbarButton';

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
  {
    btnType: 'zoomIn2d',
    dataAttr: 'zoom',
    dataVal: 'in',
    faClass: 'fa-search-plus',
    label: 'Zoom In',
  },
  {
    btnType: 'zoomOut2d',
    dataAttr: 'zoom',
    dataVal: 'out',
    faClass: 'fa-search-minus',
    label: 'Zoom Out',
  },
];

export default class SCRNASeqChart extends Component {
  state = { graphDiv: '' };

  onInitialized = (figure, graphDiv) => {
    this.setState({ graphDiv });
  };

  render() {
    const { data, dataType } = this.props;
    const { graphDiv } = this.state;
    return (
      <React.Fragment>
        <Row
          style={{
            justifyContent: 'flex-end',
            maxWidth: 700,
          }}
          >
          {toolbarButtons.map(btn => (
            <Tooltip
              Component={
                <div>{btn.label}</div>
              }
              key={btn.btnType}
              >
              <Button
                data-attr={btn.dataAttr}
                data-val={btn.dataVal}
                onClick={(e) => {
                  e.persist();
                  ModeBarButtons[btn.btnType].click(graphDiv, e);
                }}
                style={{
                  ...visualizingButton,
                  marginLeft: 6,
                }}
                >
                <i aria-hidden="true" className={`fa ${btn.faClass}`} />
                <Hidden>{btn.label}</Hidden>
              </Button>
            </Tooltip>
            // <ToolbarButton
            //   btnType={btn.btnType}
            //   data-attr={btn.dataAttr}
            //   data-val={btn.dataVal}
            //   faClass={btn.faClass}
            //   graphDiv={graphDiv}
            //   key={btn.btnType}
            //   label={btn.label}
            //   ModeBarButtons={ModeBarButtons}
            //   onClick={(e) => {
            //     e.persist();
            //     ModeBarButtons[btn.btnType].click(graphDiv, e);
            //   }}
            //   />
          ))}
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
