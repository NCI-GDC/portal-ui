/* eslint-disable camelcase */

import React, { Component } from 'react';
import ModeBarButtons from 'plotly.js/src/components/modebar/buttons';
import Plotly from 'plotly.js';
import createPlotlyComponent from 'react-plotly.js/factory';

import { Row } from '@ncigdc/uikit/Flex';
import './style.css';

import ToolbarButton from './ToolbarButton';

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

  handleToolbarClick = (e) => {
    const { graphDiv } = this.state;
    e.persist();
    const btnType = e.target.getAttribute('data-btn-type');
    ModeBarButtons[btnType].click(graphDiv, e);
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
          {toolbarButtons.map(btn => (
            <ToolbarButton
              {...btn}
              key={btn.btnType}
              onToolbarClick={this.handleToolbarClick}
              />
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
