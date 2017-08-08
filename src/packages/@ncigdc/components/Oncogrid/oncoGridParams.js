/* @flow */
import { insertRule } from 'glamor';
import { uniq } from 'lodash';

import {
  clinicalDonorTracks,
  dataTypeTracks,
  geneTracks,
  geneSetTracks,
  gdcTracks,
  getColorValue,
} from '@ncigdc/components/Oncogrid/tracks';
import { mapDonors, mapGenes, buildOccurrences } from './dataMapping';
import type { TDonorInput, TGeneInput, TOccurrenceInput } from './dataMapping';

const donorTracks = [...clinicalDonorTracks, ...dataTypeTracks];

const trackColorMap = [...donorTracks, ...geneTracks].reduce(
  (acc, t) => ({ ...acc, [t.fieldName]: t.color }),
  {},
);

const fillFunc = (track: { fieldName: string, value?: mixed }) =>
  getColorValue({
    color: trackColorMap[track.fieldName] || '',
    value: track.value,
  });

function dataTypeLegend(): string {
  return `<div><b>Available Data Types:</b></div><div>${dataTypeTracks
    .map(t => (t.legend ? t.legend(t) : ''))
    .filter(Boolean)
    .join('</div><div>')}</div>`;
}

function gdcLegend(max: number): string {
  return `<div><b># of Cases Affected:</b></div><div>${gdcTracks
    .map(t => (t.legend ? t.legend({ ...t, max }) : ''))
    .filter(Boolean)
    .join('</div><div>')}`;
}

function geneSetLegend(): string {
  return `<div><b>Gene Sets:</b></div><div>${geneSetTracks
    .map(t => (t.legend ? t.legend(t) : ''))
    .filter(Boolean)
    .join('</div><div>')}</div>`;
}

export default function({
  donorData,
  geneData,
  occurrencesData,
  colorMap,
  element,
  height = 150,
  width = 680,
  trackPadding,
  consequenceTypes,
  impacts,
  grid = true,
}: {
  donorData: Array<TDonorInput>,
  geneData: Array<TGeneInput>,
  occurrencesData: Array<TOccurrenceInput>,
  colorMap: { [key: string]: string },
  element: string,
  height: number,
  width: number,
  trackPadding: number,
  consequenceTypes: Array<string>,
  impacts: Array<string>,
  grid?: boolean,
}): ?Object {
  const { observations, donorIds, geneIds } = buildOccurrences(
    occurrencesData,
    donorData,
    geneData,
    consequenceTypes,
    impacts,
  );
  if (observations.length === 0) return null;
  const donors = mapDonors(donorData, donorIds);
  const genes = mapGenes(geneData, geneIds);

  const maxDaysToDeath = Math.max(...donors.map(d => d.daysToDeath));
  const maxAgeAtDiagnosis = Math.max(...donors.map(d => d.age));
  const maxDonorsAffected = Math.max(...genes.map(g => g.totalDonors));

  const donorOpacityFunc = ({
    type,
    value,
  }: {
    type: string,
    value: number,
  }) => {
    switch (type) {
      case 'int':
        return value / 100;
      case 'vital':
        return !value || value === 'not reported' ? 0 : 1;
      case 'gender':
      case 'ethnicity':
      case 'race':
      case 'primary_diagnosi':
        return 1;
      case 'bool':
        return value ? 1 : 0;
      case 'days_to_death':
        return value / maxDaysToDeath;
      case 'age':
        return value / maxAgeAtDiagnosis;
      default:
        return 0;
    }
  };

  const geneOpacity = ({ type, value }: { type: string, value: number }) => {
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
    grid,
    minCellHeight: 8,
    trackHeight: 12,
    trackLegends: {
      Clinical: `<div><b>Clinical Data:</b></div><div>${clinicalDonorTracks
        .map(
          t =>
            t.legend
              ? t.legend({
                  ...t,
                  maxDaysToDeath,
                  values: uniq(donors.map(d => d[t.fieldName])),
                })
              : '',
        )
        .filter(Boolean)
        .join('</div><div>')}</div>`,
      'Data Types': dataTypeLegend(),
      GDC: gdcLegend(maxDonorsAffected),
      'Gene Sets': geneSetLegend(),
    },
    trackLegendLabel:
      '<i style="font-size: 13px; margin-left: 5px" class="fa fa-question-circle"></i>',
    donorTracks,
    donorOpacityFunc,
    donorFillFunc: fillFunc,
    geneTracks,
    geneOpacityFunc: geneOpacity,
    geneFillFunc: fillFunc,
    expandableGroups: ['Clinical'],
    margin: { top: 20, right: 5, bottom: 20, left: 0 },
    leftTextWidth: 120,
    trackPadding,
  };
}

/*----------------------------------------------------------------------------*/

insertRule(`
  .onco-track-legend {
    margin-right: 5px;
    display: inline-block;
    width: 12px;
    height: 12px;
  }
`);
