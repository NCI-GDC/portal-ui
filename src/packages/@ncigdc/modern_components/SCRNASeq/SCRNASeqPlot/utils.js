import { theme } from '@ncigdc/theme';

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
