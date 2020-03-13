/* eslint-disable camelcase */

import React, { Component } from 'react';
import ModeBarButtons from 'plotly.js/src/components/modebar/buttons';
import Plotly from 'plotly.js/lib/index-basic';
import createPlotlyComponent from 'react-plotly.js/factory';

import { Column, Row } from '@ncigdc/uikit/Flex';
import { theme } from '@ncigdc/theme';

import { DownloadButton, ToolbarButton } from '../toolbar';

const Plot = createPlotlyComponent(Plotly);

// setup Plotly layout & config

const layoutDefaults = {
  axisFont: {
    color: '#767676',
  },
  font: {
    color: theme.greyScale2,
    family: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  },
};

layoutDefaults.axisStyles = {
  autorange: true,
  gridcolor: theme.greyScale6,
  gridwidth: 2,
  linecolor: 'gray',
  linewidth: 2,
  tickfont: layoutDefaults.axisFont,
  titlefont: layoutDefaults.axisFont,
  type: 'linear',
  zerolinecolor: theme.greyScale4,
  zerolinewidth: 2,
};

const getLayout = dataType => {
  const dataTypeCaps = dataType.toUpperCase();
  const { axisFont, axisStyles, font } = layoutDefaults;
  return {
    height: 500,
    hovermode: 'closest',
    legend: {
      ...font,
      ...axisFont,
    },
    margin: {
      b: 70,
      l: 70,
      r: 20,
      t: 60,
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

const config = {
  displaylogo: false,
  displayModeBar: false,
  showLink: false,
  toImageButtonOptions: {
    filename: 'scrna_seq',
    format: 'svg', // one of png, svg, jpeg, webp
  },
};

// setup custom toolbar

const toolbarButtons = [
  // https://github.com/plotly/plotly.js/blob/master/src/components/modebar/buttons.js
  {
    attr: 'zoom',
    faClass: 'fa-undo',
    label: 'Reset Axes',
    name: 'resetScale2d',
    val: 'reset',
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

const styleData = (input = []) => input.map(row => ({
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

    const styledData = styleData(data);

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
          config={config}
          data={styledData}
          layout={getLayout(dataType)}
          onInitialized={this.onInitialized}
          />
      </Column>
    );
  }
}
