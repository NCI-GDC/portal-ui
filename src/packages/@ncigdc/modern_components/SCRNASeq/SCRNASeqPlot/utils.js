import { theme } from '@ncigdc/theme';
import { isFullScreen } from '@ncigdc/utils/fullscreen';

export const config = {
  displaylogo: false,
  displayModeBar: false,
  showLink: false,
};

export const layout = {
  hovermode: 'closest',
  margin: {
    b: 70,
    l: 70,
    r: 20,
    t: 60,
  },
};

export const layoutDefaults = {
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

export const toolbarButtons = {
  // https://github.com/plotly/plotly.js/blob/master/src/components/modebar/buttons.js
  download: {
    faClass: 'fa-download',
    label: 'Download',
    name: 'download',
  },
  fullscreen: {
    label: 'Fullscreen',
    name: 'fullscreen',
  },
  pan: {
    attr: 'dragmode',
    faClass: 'fa-arrows',
    label: 'Pan',
    name: 'pan2d',
    val: 'pan',
  },
  reset: {
    faClass: 'fa-undo',
    label: 'Reset',
    name: 'react',
  },
  zoom: {
    attr: 'dragmode',
    faClass: 'fa-search',
    label: 'Zoom',
    name: 'zoom2d',
    val: 'zoom',
  },
  zoomIn: {
    attr: 'zoom',
    faClass: 'fa-search-plus',
    label: 'Zoom In',
    name: 'zoomIn2d',
    val: 'in',
  },
  zoomOut: {
    attr: 'zoom',
    faClass: 'fa-search-minus',
    label: 'Zoom Out',
    name: 'zoomOut2d',
    val: 'out',
  },
};

export const getToolbarButtons = () => {
  const {
    download, fullscreen, pan, reset, zoom, zoomIn, zoomOut,
  } = toolbarButtons;
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

export const width = 460;

export const getLayout = (dataType, isFullScreen = false) => {
  const dataTypeCaps = dataType.toUpperCase();
  const { axisFont, axisStyles, font } = layoutDefaults;
  return {
    ...layout,
    height: isFullScreen ? 800 : 350,
    legend: {
      ...font,
      ...axisFont,
    },
    name: 'scrna_seq',
    title: {
      font,
      text: `${dataTypeCaps} Projection of<br>Cells Colored by Automated Clustering`,
    },
    width: isFullScreen ? 800 : width,
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

export const styles = {
  fullscreen: {
    background: '#fff',
    height: '100%',
    marginLeft: 0,
    maxWidth: '100%',
    overflow: 'scroll',
    padding: '100px 100px 0',
    width: '100%',
  },
};

export const getDataWithMarkers = (input = []) => input.map(row => ({
  ...row,
  marker: {
    opacity: 0.75,
    size: 4,
  },
}));
