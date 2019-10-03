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

// const maxKeyNameLength = (
//   maxBy(histogramData
//     .map(d => d.fullLabel), (item) => item.length) || ''
// ).length;

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

export const getHistogramDownload = (fieldName, slug) => {
  const selector = `#${fieldName}-chart-container .test-bar-chart svg`;
  const labelElements = [...document.querySelectorAll(`${selector} .svgDownload .tick text`)];
  const labels = labelElements.map(el => el.textContent);
  const maxKeyNameLength = getMaxKeyNameLength(labels);
  // const maxKeyNameLength = 100;
  // const human = humanify(s
  console.log('labels', labels);
  console.log('maxKeyNameLength', maxKeyNameLength)
  return ({
    bottomBuffer: maxKeyNameLength * 3,
    rightBuffer: maxKeyNameLength * 2,
    selector,
    title: humanify({term: fieldName}),
  });
};

export const getDownloadSlugs = displayVariables =>
  Object.keys(displayVariables).sort()
    .map(dVar => {
      const fieldName = dVar.split('.')[1];
      const chartType = displayVariables[dVar].active_chart;
      // return [];
      return chartType === 'box'
        ? []
        // ? [`${fieldName}-qq-plot`, `${fieldName}-box-plot`]
        : chartType === 'histogram'
          ? `${fieldName}-bar-chart`
          : chartType === 'survival'
            ? `${fieldName}-survival-plot`
            : [];
    })
    .reduce((acc, curr) => acc.concat(curr), [OVERALL_SURVIVAL_SLUG]);