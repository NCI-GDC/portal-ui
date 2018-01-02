// @flow

const theme = {
  /*
   *  Colors
   */

  primary: 'rgb(0, 80, 131)',
  primaryLight1: 'rgb(187,14,61)',

  success: '#255425',
  error: 'rgb(187,14,61)',

  secondary: 'rgb(23, 132, 172)',
  secondaryHighContrast: '#005b7c',

  textShadow: '0 0 7px rgba(144, 144, 144, 0.62)',
  white: '#fff',

  // greyscale

  greyScale7: 'rgb(107,98,98)',
  greyScale6: 'rgb(245,245,245)',
  greyScale5: 'rgb(222,222,222)',
  greyScale4: 'rgb(200, 200, 200)',
  greyScale3: 'rgb(144,144,144)', // not enough contrast on white background
  greyScale2: 'rgb(61,61,61)',
  greyScale1: 'rgb(36,36,36)',

  // impacts
  vep: {
    high: 'rgb(185, 36, 36)',
    moderate: '#87500D',
    modifier: '#87500D',
    low: '#015c0a',
  },
  sift: {
    deleterious: 'rgb(185, 36, 36)',
    deleterious_low_confidence: '#87500D',
    tolerated: '#87500D',
    tolerated_low_confidence: '#015c0a',
  },
  polyphen: {
    benign: '#015c0a',
    possibly_damaging: '#634d0c',
    probably_damaging: 'rgb(185, 36, 36)',
    unknown: '#737373',
  },

  // alerts

  alertInfo: 'rgb(237, 248, 251)',

  // table

  tableStripe: 'rgb(236, 243, 246)',
  tableHighlight: '#ffffbe',
  /*
   *  Dimensions
   */

  facetsPanelWidth: '35rem',

  headerPosition: 'fixed',

  spacing: '2rem',
};

export const globalRules = `
  a:link {
    color: ${theme.primary};
  }
`;

export default theme;
