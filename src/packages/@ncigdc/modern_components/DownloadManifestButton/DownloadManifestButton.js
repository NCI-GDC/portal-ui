import React from 'react';
import { compose, branch, renderComponent } from 'recompose';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import DownloadButton from '@ncigdc/components/DownloadButton';
import { makeFilter } from '@ncigdc/utils/filters';

export default compose(
  branch(
    ({ viewer }) => !viewer.projects.hits.edges[0],
    renderComponent(() => <div>No project found.</div>),
  ),
)(({ projectId, viewer }) => {
  const fileCount = viewer.projects.hits.edges[0].node.summary.file_count;
  const projectFilter = [
    {
      field: 'cases.project.project_id',
      value: projectId,
    },
  ];
  return (
    <Tooltip
      Component={
        <div style={{ maxWidth: 250 }}>
          Download a manifest for use with the GDC Data Transfer Tool.
          The GDC Data Transfer Tool is recommended for transferring
          large
          volumes of data.
        </div>
      }
    >
      <DownloadButton
        className="test-download-manifest"
        disabled={!fileCount}
        endpoint="files"
        activeText="Downloading"
        inactiveText="Download Manifest"
        returnType="manifest"
        filters={makeFilter(projectFilter)}
      />
    </Tooltip>
  );
});
