/* @flow */

import React from 'react';
import { compose } from 'recompose';
import DownloadButton from '@ncigdc/components/DownloadButton';
import { makeFilter } from '@ncigdc/utils/filters';
import { withTheme } from '@ncigdc/theme';

export default compose(withTheme)(({ isLoading, projectId, viewer }) => {
  const projectFilter = [
    {
      field: 'cases.project.project_id',
      value: projectId,
    },
  ];

  const dataExportFilters = makeFilter(projectFilter);
  const biospecimenCount = viewer.repository.cases.hits.total;

  return (
    <DownloadButton
      className="test-download-biospecimen"
      disabled={!biospecimenCount}
      filename={`biospecimen.project-${projectId}`}
      endpoint="cases"
      activeText="Processing"
      inactiveText={
        biospecimenCount ? 'Download Biospecimen' : 'No Biospecimen Data'
      }
      fields={['case_id']}
      dataExportExpands={[
        'samples',
        'samples.portions',
        'samples.portions.analytes',
        'samples.portions.analytes.aliquots',
        'samples.portions.analytes.aliquots.annotations',
        'samples.portions.analytes.annotations',
        'samples.portions.submitter_id',
        'samples.portions.slides',
        'samples.portions.annotations',
        'samples.portions.center',
      ]}
      filters={dataExportFilters}
    />
  );
});
