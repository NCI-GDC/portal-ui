import _ from 'lodash';

import { mapDonors, mapGenes, mapOccurences } from './dataMapping';
import { clinicalDonorTracks, dataTypeTracks, geneTracks } from './tracks';

const fadeSteps = [0.05, 0.4, 0.7, 1];

const donorTracks = [
  ...clinicalDonorTracks,
  ...dataTypeTracks,
];

function clinicalLegend(maxDaysToDeath) {
  return '<b>Clinical Data:</b><br>' +

    '<b>gender:</b> ' +
    'Male: ' + getSquare({fieldName: 'gender', value: 'male'}) +
    ' Female: ' + getSquare({fieldName: 'gender', value: 'female'}) + '<br>' +

    '<b>age (years): </b> 0 ' +
    fadeSteps.reduce((html, opacity) => html + getSquare({fieldName: 'age', opacity: opacity}), '') +
    ' 100+ <br>' +

    '<b>vitalStatus:</b> ' +
    'Deceased: ' + getSquare({fieldName: 'vitalStatus', value: false}) + ' ' +
    'Alive: ' + getSquare({fieldName: 'vitalStatus', value: true}) + '<br>' +

    '<b>days to death: </b> 0 ' +
    fadeSteps.reduce((html, opacity) => html + getSquare({fieldName: 'daysToDeath', opacity: opacity}), '') +
    ' ' + maxDaysToDeath + '<br>';
}

function dataTypeLegend() {
  return dataTypeTracks.reduce((html, track) => (
    html + getSquare({fieldName: track.fieldName}) + track.longName + ' <br>'
  ), '<b>Available Data Types:</b><br>');
}

function gdcLegend(max) {
  return fadeSteps.reduce(
    (html, opacity) => html + getSquare({fieldName: 'totalDonors', opacity: opacity}),
    '<b># of Cases Affected:</b><br>'
  ) + max;
}

function geneSetLegend() {
  return '<b> Gene Sets: </b> <br>' + 
    getSquare({fieldName: 'cgc'}) +
    ' Gene belongs to Cancer Gene Census';
}

// rollover templates
const mainGridRollover = `
  {{#observation}}
    {{observation.id}}<br>
    {{observation.geneSymbol}}<br>
    {{observation.donorId}}<br>
    {{observation.consequence}}<br>
  {{/observation}}
`;

const trackColorMap = [
  ...donorTracks,
  ...geneTracks,
].reduce((map, t) => ({ ...map, [t.fieldName]: t.color }), {});

const fillFunc = (track) => {
  const color = trackColorMap[track.fieldName] || '';

  switch (typeof color) {
    case 'string':
      return color;
    case 'function':
      return color(track);
    default:
      return color[track.value];
  }
};

function getSquare(field) {
  const opacityStyle = typeof field.opacity === 'number' ? '; opacity: ' + field.opacity : '';
  return '<div class="onco-track-legend" style="background: ' + fillFunc(field) + opacityStyle + '"></div>';
}

export default function ({
  donorData,
  geneData,
  occurencesData,
  colorMap,
  element,
  clickHandlers = {},
  height = 150,
  width = 680,
  addTrackFunc,
}) {
  let donors = mapDonors(donorData);
  let genes = mapGenes(geneData);
  const observations = mapOccurences(occurencesData, donors, genes);

  if (observations.length === 0) {
    return null;
  }

  // Clean gene & donor data before using for oncogrid. 
  const donorObs = _.map(observations, 'donorId');
  const geneObs = _.map(observations, 'geneId');
  donors = _.filter(donors, function(d) { return donorObs.indexOf(d.id) >= 0;});
  genes = _.filter(genes, function(g) { return geneObs.indexOf(g.id) >= 0;});

  const maxDaysToDeath = _.max(_.map(donors, function(d) { return d.daysToDeath; } ));
  const maxDonorsAffected = _.max(genes, function (g) { return g.totalDonors; }).totalDonors;

  const dataTypeMax = dataTypeTracks.reduce(
    (maxValues, track) => (
      {
        ...maxValues,
        [track.fieldName]: donors.reduce(
          (max, d) => (
            Math.max(max, d[track.fieldName])
          ), 0
        ),
      }
    )
  );

  const donorOpacityFunc = function (d) {
    switch (d.type) {
      case 'int':
        return d.value / 100;
      case 'vital':
      case 'gender':
      case 'ethnicity':
      case 'race':
      case 'primary_diagnosi':
        return 1;
      case 'bool':
        return d.value ? 1 : 0;
      case 'days_to_death':
        return d.value / maxDaysToDeath;
      case 'dataType':
        return d.value / dataTypeMax[d.fieldName];
      default:
        return 0;
    }
  };

  const geneOpacity = function (g) {
    switch (g.type) {
      case 'int':
        return g.value / maxDonorsAffected;
      case 'bool':
        return g.value ? 1 : 0;
      default:
        return 1;
    }
  };

  return {
    donors: donors,
    genes: genes,
    observations: observations,
    height: height,
    width: width,
    element: element,
    colorMap: colorMap,
    scaleToFit: true,

    heatMap: false,
    grid: true,
    minCellHeight: 8,
    trackHeight: 12,
    trackLegends: {
      'GDC': gdcLegend(maxDonorsAffected),
      'Gene Sets': geneSetLegend(),

      'Clinical': clinicalLegend(maxDaysToDeath),
      'Data Types': dataTypeLegend(),
    },
    templates: {
      mainGridCrosshair: mainGridRollover,
      mainGrid: mainGridRollover,
    },
    trackLegendLabel: '<i style="font-size: 13px; margin-left: 5px" class="fa fa-question-circle"></i>',

    donorTracks: donorTracks,
    donorOpacityFunc: donorOpacityFunc,
    donorFillFunc: fillFunc,

    geneTracks: geneTracks,
    geneOpacityFunc: geneOpacity,
    geneFillFunc: fillFunc,
    expandableGroups: [
      'Clinical',
    ],

    margin: { top: 20, right: 0, bottom: 20, left: 0 },
    leftTextWidth: 120,
    addTrackFunc,

    ...clickHandlers,
  };
}
