import {
  isEqual,
  map,
  mapKeys,
  maxBy,
  trim,
} from 'lodash';
import { humanify } from '@ncigdc/utils/string';

export const PLOT_TYPES = {
  categorical: ['histogram', 'survival'],
  continuous: [
    'histogram',
    'survival',
    'box',
  ],
};

// helpers for downloading SVGs/PNGs

export const OVERALL_SURVIVAL_SLUG = 'clinical-overall-survival-plot';

const getMaxKeyNameLength = bins => (
  maxBy(bins, item => item.length) || ''
).length;

export const getDownloadSlug = (chart, fieldName) => 
  chart === 'box'
    ? [`${fieldName}-box-plot`, `${fieldName}-qq-plot`]
    : chart === 'histogram'
      ? `${fieldName}-bar-chart`
      : chart === 'survival'
        ? `${fieldName}-survival-plot`
        : [];

export const getDownloadSlugArray = obj => obj
  .reduce((acc, { slug }) => 
    acc.concat(slug),
    [OVERALL_SURVIVAL_SLUG]
  );

export const getBoxQQDownload = (fieldName, plot, type) => {
  console.log('getBoxQQDownload', fieldName, type);
  return ({
    className: `${plot === 'Box' 
      ? type.toLowerCase() + '-' 
      : ''}${plot.toLowerCase()}-plot`,
    selector: `#${fieldName}-${plot.toLowerCase()}-plot-container ${
      plot === 'Box' ? 'figure' : '.qq-plot'
    } svg`,
    title: `${humanify({ term: fieldName })} ${plot} Plot`,
  });
};

export const getHistogramDownload = fieldName => {
  const selector = `#${fieldName}-chart-container .test-bar-chart svg`;
  const labelElements = [...document.querySelectorAll(`${selector} .svgDownload .tick text`)];
  const labels = labelElements.map(el => el.textContent);
  const maxKeyNameLength = getMaxKeyNameLength(labels);
  return ({
    bottomBuffer: maxKeyNameLength * 3,
    rightBuffer: maxKeyNameLength * 2,
    selector,
    title: humanify({term: fieldName}),
  });
};

export const getSurvivalDownload = slug => {
  const legend = [...document.querySelectorAll(`.${slug} .legend-item`)];
  return ({
    className: 'survival-plot',
    selector: `.${slug} .survival-plot svg`,
    slug,
    title: '',
    embed: {
      top: {
        elements: legend.map((l, i) => {
          const legendItem = document.querySelector(
            `.${slug} .legend-${i}`
          ).cloneNode(true);
          const legendTitle = legendItem.querySelector('span.print-only.inline');
          if (legendTitle !== null) legendTitle.className = '';
          return legendItem;
        })
        .concat(document.querySelector(`.${slug} .p-value`) || []),
      },
    },
  });
};