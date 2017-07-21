/* @flow */
import { scaleOrdinal, schemeCategory20 } from 'd3';
import Color from 'color';

import { sortInt, sortByString, sortBool } from './sort';

const colors = scaleOrdinal(schemeCategory20);

function random({ value }: { value: string | number }): string {
  return colors(`${value}`.split('').reduce((h, c) => h + c.charCodeAt(0), 0));
}

const fadeSteps = [0.05, 0.4, 0.7, 1];

export const getColorValue = (track: { color: any, value?: mixed }) => {
  switch (typeof track.color) {
    case 'string':
      return track.color;
    case 'function':
      return track.color(track);
    default:
      return track.color[track.value];
  }
};

function getSquare(track: Object): string {
  const opacity = typeof track.opacity === 'number' ? track.opacity : 1;
  const color = Color(getColorValue(track)).lighten(1 - opacity).rgbString();
  return `<div class="onco-track-legend" style="background: ${color}"></div>`;
}

function legendGradient(track): string {
  return `
    <b>${track.name}: </b> ${track.min || 0} ${fadeSteps.reduce(
    (html, opacity) => html + getSquare({ ...track, opacity }),
    '',
  )} ${track.max}
  `;
}

function legendMulti(track): string {
  const joinCharacter = track.joinCharacter || '<div></div>&nbsp;&nbsp;';
  const values = typeof track.color === 'object'
    ? Object.keys(track.color)
    : track.values;

  return `
    <b>${track.name}:</b>${joinCharacter}${values
    .map(
      value => `
        ${value}: ${getSquare({ ...track, value })}
      `,
    )
    .join(joinCharacter)}
  `;
}

function legendBoolean(track): string {
  return legendMulti({ ...track, joinCharacter: ' ' });
}

function legendSingle(track): string {
  return `${getSquare(track)}${track.longName}`;
}
export const clinicalDonorTracks = [
  {
    name: 'Gender',
    fieldName: 'gender',
    type: 'gender',
    sort: sortByString,
    group: 'Clinical',
    color: {
      male: '#420692',
      female: 'rgb(220, 96, 156)',
    },
    collapsed: true,
    legend: legendBoolean,
  },
  {
    name: 'Race',
    fieldName: 'race',
    type: 'race',
    sort: sortByString,
    group: 'Clinical',
    color: random,
    legend: legendMulti,
  },
  {
    name: 'Ethnicity',
    fieldName: 'ethnicity',
    type: 'ethnicity',
    sort: sortByString,
    group: 'Clinical',
    color: random,
    collapsed: true,
    legend: legendMulti,
  },
  {
    name: 'Age at Diagnosis',
    fieldName: 'age',
    type: 'age',
    sort: sortInt,
    group: 'Clinical',
    color: '#638f56',
    template:
      '<div>{{displayId}}</div>{{displayName}}: {{displayValue}}{{#notNullSentinel}} days{{/notNullSentinel}}',
    legend: track => legendGradient({ ...track, max: '100+' }),
  },
  {
    name: 'Vital Status',
    fieldName: 'vitalStatus',
    type: 'vital',
    sort: sortByString,
    group: 'Clinical',
    color: {
      alive: '#1693c0',
      dead: 'darkred',
    },
    legend: legendBoolean,
  },
  {
    name: 'Days To Death',
    fieldName: 'daysToDeath',
    type: 'days_to_death',
    sort: sortInt,
    group: 'Clinical',
    color: 'blue',
    legend: track => legendGradient({ ...track, max: track.maxDaysToDeath }),
  },
];

const dataTypeTemplate = `
  <div>{{displayId}}</div>
  {{displayName}}: {{displayValue}}{{#notNullSentinel}} files{{/notNullSentinel}}
`;

export const dataTypeTracks = [
  {
    name: 'Clinical',
    fieldName: 'Clinical',
    type: 'bool',
    sort: sortInt,
    group: 'Data Types',
    longName: 'Clinical',
    color: 'darkkhaki',
    template: dataTypeTemplate,
    legend: legendSingle,
  },
  {
    name: 'Biospecimen',
    fieldName: 'Biospecimen',
    type: 'bool',
    sort: sortInt,
    group: 'Data Types',
    longName: 'Biospecimen',
    color: 'darkslategrey',
    template: dataTypeTemplate,
    legend: legendSingle,
  },
  {
    name: 'Raw Sequencing Data',
    fieldName: 'Raw Sequencing Data',
    type: 'bool',
    sort: sortInt,
    group: 'Data Types',
    longName: 'Raw Sequencing Data',
    color: 'cyan',
    template: dataTypeTemplate,
    legend: legendSingle,
  },
  {
    name: 'Simple Nucleotide Variation',
    fieldName: 'Simple Nucleotide Variation',
    type: 'bool',
    sort: sortInt,
    group: 'Data Types',
    longName: 'Simple Nucleotide Variation',
    color: 'darkkhaki',
    template: dataTypeTemplate,
    legend: legendSingle,
  },
  {
    name: 'Copy Number Variation',
    fieldName: 'Copy Number Variation',
    type: 'bool',
    sort: sortInt,
    group: 'Data Types',
    longName: 'Copy Number Variation',
    color: 'darksalmon',
    template: dataTypeTemplate,
    legend: legendSingle,
  },
  {
    name: 'Transcriptome Profiling',
    fieldName: 'Transcriptome Profiling',
    type: 'bool',
    sort: sortInt,
    group: 'Data Types',
    longName: 'Transcriptome Profiling',
    color: 'mediumseagreen',
    template: dataTypeTemplate,
    legend: legendSingle,
  },
];

export const gdcTracks = [
  {
    name: '# Cases affected',
    fieldName: 'totalDonors',
    type: 'int',
    sort: sortInt,
    group: 'GDC',
    color: 'mediumpurple',
    legend: legendGradient,
  },
];

export const geneSetTracks = [
  {
    name: 'Cancer Gene Census',
    longName: 'Gene belongs to Cancer Gene Census',
    fieldName: 'cgc',
    type: 'bool',
    sort: sortBool,
    group: 'Gene Sets',
    color: 'darkgreen',
    legend: legendSingle,
  },
];

export const geneTracks = [...gdcTracks, ...geneSetTracks];

export default {
  clinicalDonorTracks,
  dataTypeTracks,
  geneTracks,
};
