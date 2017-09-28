import { scaleOrdinal, schemeCategory10 } from 'd3';

import formatFileSize from '@ncigdc/utils/formatFileSize';
import { DATA_CATEGORIES } from '@ncigdc/utils/constants';

const colors = scaleOrdinal(schemeCategory10);
var colorGroups = {
  file_count: colors(0),
  file_size: colors(1),
  case_count: colors(2),
};

const onClickDefault = d => console.log('clicked', d);

export default function columns(params) {
  var results = [
    {
      id: 'project_id',
      displayName: ['Project', 'ID'],
      scale: 'ordinal',
      onClick: params.onProjectClick || onClickDefault,
      sortKey: 'case_count',
    },
    {
      id: 'case_count',
      displayName: ['Case', 'Count'],
      scale: 'ordinal',
      color: colorGroups['case_count'],
      onClick: params.onCaseCountClick || onClickDefault,
    },
  ];

  results = results.concat(
    Object.keys(DATA_CATEGORIES).map(key => ({
      id: DATA_CATEGORIES[key].full,
      displayName: [DATA_CATEGORIES[key].abbr],
      scale: 'ordinal',
      isSubtype: true,
      color: colorGroups['case_count'],
      onClick: params.onDataTypeClick || onClickDefault,
    })),
  );

  results = results.concat([
    {
      id: 'file_count',
      displayName: ['File', 'Count'],
      scale: 'ordinal',
      color: colorGroups['file_count'],
      onClick: params.onFileCountClick || onClickDefault,
    },
    {
      id: 'file_size',
      displayName: ['File', 'Size'],
      scale: 'ordinal',
      color: colorGroups['file_size'],
      format: formatFileSize,
    },
    {
      id: 'primary_site',
      displayName: ['Major', 'Primary', 'Sites'],
      scale: 'linear',
    },
  ]);

  return results;
}
