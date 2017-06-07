// @flow

const theme = {
  /*
   *  Colors
   */

  primary: 'rgb(0, 80, 131)',
  primaryLight1: 'rgb(187,14,61)',

  success: '#255425',

  secondary: 'rgb(23, 132, 172)',
  secondaryHighContrast: '#005b7c',

  textShadow: '0 0 7px rgba(144, 144, 144, 0.62)',
  white: '#fff',

  // greyscale

  greyScale7: 'rgb(107,98,98)',
  greyScale6: 'rgb(245,245,245)',
  greyScale5: 'rgb(222,222,222)',
  greyScale4: 'rgb(200, 200, 200)',
  greyScale3: 'rgb(144,144,144)',
  greyScale2: 'rgb(61,61,61)',
  greyScale1: 'rgb(36,36,36)',

  // impacts
  impacts: {
    HIGH: 'rgb(185, 36, 36)',
    MODERATE: '#634d0c',
    LOW: '#015c0a',
    MODIFIER: '#c94d18',
  },
  //
  // alerts

  alertInfo: 'rgb(237, 248, 251)',

  // table

  tableStripe: 'rgb(236, 243, 246)',

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
    text-decoration: underline;
  }
`;

export default theme;
