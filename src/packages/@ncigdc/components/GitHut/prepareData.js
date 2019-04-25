import { uniq } from 'lodash';
import { DATA_CATEGORIES, HUMAN_BODY_SITES_MAP } from '@ncigdc/utils/constants';

const normalize = str => str.toLowerCase().replace(/\s+/g, '');
const DEFAULT_UNKNOWN_VAL = 'Unknown';

export default function (data) {
  return data
    .map(project => {
      const types = project.summary.data_categories || [];
      return Object.values(DATA_CATEGORIES).reduce(
        (data, { full }) => {
          const target = normalize(full);
          data[full] = (types.find(
            type => normalize(type.data_category) === target,
          ) || { case_count: 0 }).case_count;
          return data;
        },
        {
          project_id: project.project_id || DEFAULT_UNKNOWN_VAL,
          name: project.name || DEFAULT_UNKNOWN_VAL,
          primary_site: uniq(
            (project.primary_site || [DEFAULT_UNKNOWN_VAL]).map(
              p => HUMAN_BODY_SITES_MAP[p.toLowerCase()] || p,
            ),
          ),
          file_count: project.summary.file_count,
          file_size: project.summary.file_size,
          case_count: project.summary.case_count,
        },
      );
    })
    .sort((a, b) => {
      return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
    });
}
