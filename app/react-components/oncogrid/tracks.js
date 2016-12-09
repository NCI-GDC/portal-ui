import { sortInt, sortByString, sortBool } from './sort';

const colors = d3.scale.category20();

function random(track) {
  return colors((`${track.value}`).split('').reduce((h, c) => (h + c.charCodeAt(0)), 0));
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
  },
  {
    name: 'Race',
    fieldName: 'race',
    type: 'race',
    sort: sortByString,
    group: 'Clinical',
    color: random,
  },
  {
    name: 'Ethnicity',
    fieldName: 'ethnicity',
    type: 'ethnicity',
    sort: sortByString,
    group: 'Clinical',
    color: random,
    collapsed: true,
  },
  {
    name: 'Primary diagnosis',
    fieldName: 'primaryDiagnosi',
    type: 'primary_diagnosi',
    sort: sortByString,
    group: 'Clinical',
    color: random,
    collapsed: true,
  },
  {
    name: 'Age at Diagnosis',
    fieldName: 'age',
    type: 'int',
    sort: sortInt,
    group: 'Clinical',
    color: '#638f56',
  },
  {
    name: 'Vital Status',
    fieldName: 'vitalStatus',
    type: 'vital',
    sort: sortByString,
    group: 'Clinical',
    color: {
      true: '#1693c0',
      false: 'darkred',
    },
  },
  {
    name: 'Days To Death',
    fieldName: 'daysToDeath',
    type: 'days_to_death',
    sort: sortInt,
    group: 'Clinical',
    color: 'blue',
  },
];

export const dataTypeTracks = [
  {
    name: 'Clinical',
    fieldName: 'Clinical',
    type: 'dataType',
    sort: sortInt,
    group: 'Data Types',
    longName: 'Clinical',
    color: 'darkkhaki',
  },
  {
    name: 'Biospecimen',
    fieldName: 'Biospecimen',
    type: 'dataType',
    sort: sortInt,
    group: 'Data Types',
    longName: 'Biospecimen',
    color: 'darkslategrey',
  },
  {
    name: 'Raw Sequencing Data',
    fieldName: 'Raw Sequencing Data',
    type: 'dataType',
    sort: sortInt,
    group: 'Data Types',
    longName: 'Raw Sequencing Data',
    color: 'cyan',
  },
  {
    name: 'Simple Nucleotide Variation',
    fieldName: 'Simple Nucleotide Variation',
    type: 'dataType',
    sort: sortInt,
    group: 'Data Types',
    longName: 'Simple Nucleotide Variation',
    color: 'darkkhaki',
  },
  {
    name: 'Copy Number Variation',
    fieldName: 'Copy Number Variation',
    type: 'dataType',
    sort: sortInt,
    group: 'Data Types',
    longName: 'Copy Number Variation',
    color: 'darksalmon',
  },
  {
    name: 'Transcriptome Profiling',
    fieldName: 'Transcriptome Profiling',
    type: 'dataType',
    sort: sortInt,
    group: 'Data Types',
    longName: 'Transcriptome Profiling',
    color: 'mediumseagreen',
  },
];

export const geneTracks = [
  {
    name: '# Cases affected ',
    fieldName: 'totalDonors',
    type: 'int',
    sort: sortInt,
    group: 'GDC',
    color: 'mediumpurple',
  },
  {
    name: 'Cancer Gene Census ',
    fieldName: 'cgc',
    type: 'bool',
    sort: sortBool,
    group: 'Gene Sets',
    color: 'darkgreen',
  },
];

export default {
  clinicalDonorTracks,
  dataTypeTracks,
  geneTracks,
};
