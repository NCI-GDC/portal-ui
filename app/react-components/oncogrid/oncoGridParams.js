/* @flow */
import { mapDonors, mapGenes, mapOccurences } from './dataMapping';
import type { TDonor, TGene, TOccurence, TDonorInput, TGeneInput, TOccurenceInput } from './dataMapping';
import { clinicalDonorTracks, dataTypeTracks, geneTracks } from './tracks';

const fadeSteps = [0.05, 0.4, 0.7, 1];

const donorTracks = [
  ...clinicalDonorTracks,
  ...dataTypeTracks,
];

const trackColorMap = [
  ...donorTracks,
  ...geneTracks,
].reduce((acc, t) => ({ ...acc, [t.fieldName]: t.color }), {});

const fillFunc = (track: {fieldName: string, value?: mixed}) => {
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
  const opacityStyle = typeof field.opacity === 'number' ? `; opacity: ${field.opacity}` : '';
  return `<div class="onco-track-legend" style="background: ${fillFunc(field)}${opacityStyle}"></div>`;
}

function clinicalLegend(maxDaysToDeath) {
  return `
    <b>Clinical Data:</b><br>

    <b>gender:</b> Male: ${
      getSquare({ fieldName: 'gender', value: 'male' })
    } Female: ${
      getSquare({ fieldName: 'gender', value: 'female' })
    }<br>

    <b>age (years): </b> 0 ${
      fadeSteps.reduce((html, opacity) => html + getSquare({ fieldName: 'age', opacity }), '')
    } 100+<br>

    <b>vitalStatus:</b> Deceased: ${
      getSquare({ fieldName: 'vitalStatus', value: false })
    } Alive: ${
      getSquare({ fieldName: 'vitalStatus', value: true })
    }<br>

    <b>days to death: </b> 0 ${
      fadeSteps.reduce((html, opacity) => html + getSquare({ fieldName: 'daysToDeath', opacity }), '')
    } ${
      maxDaysToDeath
    }<br>
  `;
}

function dataTypeLegend() {
  return `<b>Available Data Types:</b><br>${
    dataTypeTracks.map(({ fieldName, longName }) => `${getSquare({ fieldName })}${longName}`).join('<br>')
  }`;
}

function gdcLegend(maxValue) {
  return `<b># of Cases Affected:</b><br>${
    fadeSteps.map((opacity) => getSquare({ fieldName: 'totalDonors', opacity })).join('')
  }${maxValue}`;
}

function geneSetLegend() {
  return `<b> Gene Sets: </b><br>${getSquare({ fieldName: 'cgc' })} Gene belongs to Cancer Gene Census`;
}

export default function ({
  donorData,
  geneData,
  occurencesData,
  colorMap,
  element,
  height = 150,
  width = 680,
  addTrackFunc,
  consequenceTypes,
}: {
  donorData: Array<TDonorInput>,
  geneData: Array<TGeneInput>,
  occurencesData: Array<TOccurenceInput>,
  colorMap: {[key: string]: string},
  element: string,
  height: number,
  width: number,
  addTrackFunc: (trackOptions: Array<{name: string}>, callback: (t: Array<{name: string}>) => void) => void,
  consequenceTypes: Array<string>,
}) {
  let donors: Array<TDonor> = mapDonors(donorData);
  let genes: Array<TGene> = mapGenes(geneData);
  const observations: Array<TOccurence> = mapOccurences(occurencesData, donors, genes, consequenceTypes);

  if (observations.length === 0) return null;

  // Clean gene & donor data before using for oncogrid.
  const donorObs = observations.map(o => o.donorId);
  const geneObs = observations.map(o => o.geneId);
  donors = donors.filter(d => donorObs.indexOf(d.id) >= 0);
  genes = genes.filter(g => geneObs.indexOf(g.id) >= 0);

  const maxDaysToDeath = Math.max(...donors.map((d) => d.daysToDeath));
  const maxDonorsAffected = Math.max(...genes.map(g => g.totalDonors));

  const dataTypeMax = dataTypeTracks.reduce(
    (maxValues, { fieldName }) => (
      {
        ...maxValues,
        [fieldName]: Math.max(0, ...donors.map(d => d[fieldName])),
      }
    )
  );

  const donorOpacityFunc = ({ type, value, fieldName }: { type: string, value: number, fieldName: string }) => {
    switch (type) {
      case 'int':
        return value / 100;
      case 'vital':
      case 'gender':
      case 'ethnicity':
      case 'race':
      case 'primary_diagnosi':
        return 1;
      case 'bool':
        return value ? 1 : 0;
      case 'days_to_death':
        return value / maxDaysToDeath;
      case 'dataType':
        return value / dataTypeMax[fieldName];
      default:
        return 0;
    }
  };

  const geneOpacity = ({ type, value }: {type: string, value: number}) => {
    switch (type) {
      case 'int':
        return value / maxDonorsAffected;
      case 'bool':
        return value ? 1 : 0;
      default:
        return 1;
    }
  };

  return {
    donors,
    genes,
    observations,
    height,
    width,
    element,
    colorMap,
    scaleToFit: true,
    heatMap: false,
    grid: true,
    minCellHeight: 8,
    trackHeight: 12,
    trackLegends: {
      GDC: gdcLegend(maxDonorsAffected),
      'Gene Sets': geneSetLegend(),

      Clinical: clinicalLegend(maxDaysToDeath),
      'Data Types': dataTypeLegend(),
    },
    trackLegendLabel: '<i style="font-size: 13px; margin-left: 5px" class="fa fa-question-circle"></i>',
    donorTracks,
    donorOpacityFunc,
    donorFillFunc: fillFunc,
    geneTracks,
    geneOpacityFunc: geneOpacity,
    geneFillFunc: fillFunc,
    expandableGroups: ['Clinical'],
    margin: { top: 20, right: 5, bottom: 20, left: 0 },
    leftTextWidth: 120,
    addTrackFunc,
    donorHistogramClick: (d: {}) => console.log('donorHistogramClick: ', d),
    gridClick: (o: {}) => console.log('gridClick: ', o),
    geneHistogramClick: (g: {}) => console.log('geneHistogramClick: ', g),
    geneClick: ({ id }: { id: string}) => { window.location = `/genes/${id}`; },
    donorClick: ({ id }: { id: string }) => { window.location = `/cases/${id}`; },
  };
}
