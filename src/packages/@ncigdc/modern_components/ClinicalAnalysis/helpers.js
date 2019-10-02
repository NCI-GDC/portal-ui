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

const getSurvivalDownload = slug => ({
  className: 'survival-plot', // for print styling
  selector: `.${slug} .survival-plot svg`,
  slug,
  title: '', // hide title
  embed: {
    top: {
      elements: Array.prototype.map.call(document.querySelectorAll(`.${slug} .legend-item`), (l, i) => {
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

export const getDownloadSlugs = displayVariables => Object.keys(displayVariables)
.map(dVar => {
  const fieldName = dVar.split('.')[1];
  const chart = displayVariables[dVar].active_chart;
  return [];
  // return chart === 'histogram'
  //   ? `${fieldName}-bar-chart`
  //   : chart === 'survival'
  //     ? `${fieldName}-survival-plot`
  //     : [`${fieldName}-qq-plot`, `${fieldName}-box-plot`];
}).reduce((acc, curr) => acc.concat(curr), [OVERALL_SURVIVAL_SLUG]);

export const getDownloadSvgs = displayVariables => Object.keys(displayVariables)
.reduce((acc, curr) => {
  const fieldName = curr.split('.')[1];
  const chart = displayVariables[curr].active_chart;

  if (chart === 'histogram') {
    return acc;
    // const bins = Object.keys(displayVariables[curr].bins);
    // const maxKeyNameLength = getMaxKeyNameLength(bins);
    // return acc.concat({
    //   bottomBuffer: maxKeyNameLength * 3,
    //   rightBuffer: maxKeyNameLength * 2, 
    //   selector: `#${fieldName}-chart-container .test-bar-chart svg`,
    //   title: humanify({ term: fieldName }),
    // });
  } else if (chart === 'survival') {
    return acc;
  } else if (chart === 'box') {
    return acc;
  }
}, 
// []
[getSurvivalDownload(OVERALL_SURVIVAL_SLUG)]
);