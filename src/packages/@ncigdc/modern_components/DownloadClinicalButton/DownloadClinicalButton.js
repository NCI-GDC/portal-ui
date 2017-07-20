import React from 'react';
import DownloadButton from '@ncigdc/components/DownloadButton';
import { makeFilter } from '@ncigdc/utils/filters';
export default ({ projectId, viewer }) => {
  const projectFilter = [
    {
      field: 'cases.project.project_id',
      value: projectId,
    },
  ];

  const dataExportFilters = makeFilter(projectFilter);
  const clinicalCount = viewer.repository.cases.hits.total;

  return (
    <DownloadButton
      className="data-download-clinical"
      disabled={!clinicalCount}
      filename={`clinical.project-${projectId}`}
      endpoint="cases"
      activeText="Processing"
      inactiveText={clinicalCount ? 'Download Clinical' : 'No Clinical Data'}
      fields={['case_id']}
      dataExportExpands={[
        'demographic',
        'diagnoses',
        'family_histories',
        'exposures',
      ]}
      filters={dataExportFilters}
    />
  );
};
