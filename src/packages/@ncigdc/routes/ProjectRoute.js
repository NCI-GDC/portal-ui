/* @flow */
import { parse } from 'query-string';

import ProjectPage from '@ncigdc/containers/ProjectPage';
import { parseFilterParam } from '@ncigdc/utils/uri';
import { replaceFilters } from '@ncigdc/utils/filters';
import caseHasMutation from '@ncigdc/utils/filters/prepared/caseHasMutation';
import { makeEntityPage } from './utils';

const clinicalFilters = {
  op: 'AND',
  content: [
    {
      op: 'OR',
      content: [
        {
          op: 'NOT',
          content: {
            field: 'cases.demographic.demographic_id',
            value: 'MISSING',
          },
        },
        {
          op: 'NOT',
          content: {
            field: 'cases.diagnoses.diagnosis_id',
            value: 'MISSING',
          },
        },
        {
          op: 'NOT',
          content: {
            field: 'cases.family_histories.family_history_id',
            value: 'MISSING',
          },
        },
        {
          op: 'NOT',
          content: {
            field: 'cases.exposures.exposure_id',
            value: 'MISSING',
          },
        },
      ],
    },
  ],
};

const biospecimenFilters = {
  op: 'AND',
  content: [
    {
      op: 'NOT',
      content: {
        field: 'cases.samples.sample_id',
        value: 'MISSING',
      },
    },
  ],
};

export default makeEntityPage({
  entity: 'Project',
  Page: ProjectPage,
  prepareParams: ({ location: { search }, match: { params } }) => {
    const q = parse(search);
    const projectFilter = {
      op: 'AND',
      content: [
        {
          op: 'in',
          content: {
            field: 'project.project_id',
            value: [params.id],
          },
        },
      ],
    };

    const qq: Object = {
      ...q,
      clinicalFilters: replaceFilters(
        replaceFilters(projectFilter, clinicalFilters),
        parseFilterParam(q.filters, null),
      ),
      biospecimenFilters: replaceFilters(
        replaceFilters(projectFilter, biospecimenFilters),
        parseFilterParam(q.filters, null),
      ),
      mutatedFilters: replaceFilters(projectFilter, {
        op: 'AND',
        content: [caseHasMutation],
      }),
      annotationsFilters: projectFilter,
    };

    return {
      id: btoa(`Project:${params.id}`),
      ...qq,
    };
  },
});
