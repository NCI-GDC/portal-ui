/* @flow */

import React from 'react';
import { compose } from 'recompose';
import DownloadButton from '@ncigdc/components/DownloadButton';
import { makeFilter } from '@ncigdc/utils/filters';
import { withTheme } from '@ncigdc/theme';
import timestamp from '@ncigdc/utils/timestamp';

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
      activeText="Processing"
      className="test-download-biospecimen"
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
      disabled={!biospecimenCount}
      endpoint="cases"
      fields={['case_id']}
      filename={`biospecimen.project-${projectId}.${timestamp()}.json`}
      filters={dataExportFilters}
      inactiveText={
        biospecimenCount ? 'Download Biospecimen' : 'No Biospecimen Data'
      } />
  );
});
