import { theme } from '@ncigdc/theme';

export const config = {
  displaylogo: false,
  displayModeBar: false,
  responsive: true,
  showLink: false,
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

export const buttonList = {
  // plotly's built-in buttons:
  // https://github.com/plotly/plotly.js/blob/master/src/components/modebar/buttons.js
  downloadImage: {
    // custom button
    faClass: 'fa-download',
    label: 'Download',
    name: 'downloadImage',
  },
  fullscreen: {
    // custom button
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
    // custom button
    faClass: 'fa-undo',
    label: 'Reset',
    name: 'react',
  },
  zoom: {
    attr: 'dragmode',
    faClass: 'fa-search',
    label: 'Click and drag to zoom',
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
  // buttons for plotly toolbar replacement
  const {
    downloadImage, fullscreen, pan, reset, zoom, zoomIn, zoomOut,
  } = buttonList;
  return [
    // intentionally not alphabetized
    reset,
    pan,
    zoom,
    zoomIn,
    zoomOut,
    downloadImage,
    fullscreen,
  ];
};

export const getLayout = ({
  dataType, fullscreen = false, height = 0, width,
}) => {
  const { axisFont, axisStyles, font } = layoutDefaults;
  return {
    autosize: true,
    height: fullscreen
      // leave room for the toolbar.
      // height may be 0 while plotly loads.
      ? height - 50 || width * 0.5
      // keep height consistent before & after
      // toggling fullscreen mode
      : width * 0.7,
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
      text: `${dataType} Projection of<br>Cells Colored by Automated Clustering`,
    },
    width,
    xaxis: {
      ...axisStyles,
      title: `${dataType}_1`,
    },
    yaxis: {
      ...axisStyles,
      title: `${dataType}_2`,
    },
  };
};

export const getDataWithMarkers = (input = []) => input.map(row => ({
  ...row,
  marker: {
    opacity: 0.75,
    size: 4,
  },
}));
