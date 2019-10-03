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
export const getMaxKeyNameLength = bins => (
  maxBy(bins, item => item.length) || ''
).length;

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
})};


export const getDownloadSlugs = displayVariables => Object.keys(displayVariables)
.map(dVar => {
  const fieldName = dVar.split('.')[1];
  const chart = displayVariables[dVar].active_chart;
  // return [];
  return chart === 'histogram'
    // ? []
    ? `${fieldName}-bar-chart`
    : chart === 'survival'
      ? `${fieldName}-survival-plot`
      :[];
  //     : [`${fieldName}-qq-plot`, `${fieldName}-box-plot`];
}).reduce((acc, curr) => acc.concat(curr), [OVERALL_SURVIVAL_SLUG]);