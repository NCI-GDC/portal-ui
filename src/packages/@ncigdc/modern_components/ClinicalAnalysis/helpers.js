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

const getSurvivalDownload = slug => {
  const legend = [...document.querySelectorAll(`.${slug} .legend-item`)];
  console.log('getSurvivalDownload slug', slug);
  console.log('getSurvivalDownload legend', legend);
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
          console.log('legendItem', legendTitle, legendItem);
          return 'BOOP';
          // return legendItem;
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
    ? []
    // ? `${fieldName}-bar-chart`
    : chart === 'survival'
      ? `${fieldName}-survival-plot`
      :[];
  //     : [`${fieldName}-qq-plot`, `${fieldName}-box-plot`];
// }).reduce((acc, curr) => acc.concat(curr), [OVERALL_SURVIVAL_SLUG]);
}).reduce((acc, curr) => acc.concat(curr), []);

export const getDownloadSvgs = displayVariables => Object.keys(displayVariables)
  .reduce((acc, curr) => {
    const fieldName = curr.split('.')[1];
    const chartType = displayVariables[curr].active_chart;
    console.log('when is this firing');

    if (chartType === 'histogram') {
      return acc;
      // const bins = Object.keys(displayVariables[curr].bins);
      // const maxKeyNameLength = getMaxKeyNameLength(bins);
      // return acc.concat({
      //   bottomBuffer: maxKeyNameLength * 3,
      //   rightBuffer: maxKeyNameLength * 2, 
      //   selector: `#${fieldName}-chart-container .test-bar-chart svg`,
      //   title: humanify({ term: fieldName }),
      // });
    } else if (chartType === 'survival') {
      // const survivalSlug =`${fieldName}-survival-plot`;
      const survivalSlug = `${fieldName}-survival-plot`;
      console.log('survivalSlug', survivalSlug);
      return acc.concat(getSurvivalDownload(survivalSlug));
    } else if (chartType === 'box') {
      return acc;
    }
  // }, [getSurvivalDownload(OVERALL_SURVIVAL_SLUG)]
}, []
);