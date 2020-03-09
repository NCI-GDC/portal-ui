/* eslint-disable camelcase */

import React, { Component } from 'react';
import ModeBarButtons from 'plotly.js/src/components/modebar/buttons';
import Plotly from 'plotly.js/lib/index-basic';
import createPlotlyComponent from 'react-plotly.js/factory';

import { Row } from '@ncigdc/uikit/Flex';
import { theme } from '@ncigdc/theme';
import './style.css';

import ToolbarButton from './ToolbarButton';
import DownloadButton from './DownloadButton';

const Plot = createPlotlyComponent(Plotly);

const getLayout = dataType => {
  const dataTypeCaps = dataType.toUpperCase();
  const font = {
    color: theme.greyScale2,
    family: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  };
  const axisFont = {
    ...font,
    color: '#767676',
  };
  const axisStyles = {
    autorange: true,
    gridcolor: theme.greyScale6,
    gridwidth: 2,
    linecolor: 'gray',
    linewidth: 2,
    tickfont: axisFont,
    titlefont: axisFont,
    type: 'linear',
    zerolinecolor: theme.greyScale4,
    zerolinewidth: 2,
  };
  return {
    height: 500,
    hovermode: 'closest',
    legend: { axisFont },
    margin: {
      b: 70,
      l: 70,
      r: 20,
      t: 60,
    },
    name: 'scrna_seq',
    title: {
      font,
      text: `${dataTypeCaps} Sample Data`,
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

const config = {
  displaylogo: false,
  displayModeBar: false,
  showLink: false,
  toImageButtonOptions: {
    filename: 'scrna_seq',
    format: 'svg', // one of png, svg, jpeg, webp
  },
};

const toolbarButtons = [
  // https://github.com/plotly/plotly.js/blob/master/src/components/modebar/buttons.js
  {
    // attr: 'zoom',
    faClass: 'fa-undo',
    label: 'Reset',
    name: 'reset',
    // val: 'reset',
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
    } else if (name === 'reset') {
      const { data, dataType } = this.props;
      Plotly.react(graphDiv, data, getLayout(dataType));
    } else {
      ModeBarButtons[name].click(graphDiv, e);
    }
  };

  render() {
    const { data, dataType } = this.props;

    return (
      <React.Fragment>
        <Row
          style={{
            justifyContent: 'flex-end',
            maxWidth: 700,
            position: 'relative',
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
          config={config}
          data={data}
          layout={getLayout(dataType)}
          onInitialized={this.onInitialized}
          />
      </React.Fragment>
    );
  }
}
