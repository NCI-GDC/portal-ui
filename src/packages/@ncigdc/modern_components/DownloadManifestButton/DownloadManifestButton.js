import React from 'react';
import { compose, branch, renderComponent } from 'recompose';
import DownloadManifestButton from '@ncigdc/components/DownloadManifestButton';

export default compose(
  branch(
    ({ viewer }) => !viewer.projects.hits.edges[0],
    renderComponent(() => <div>No project found.</div>),
  ),
)(({ projectId, viewer }) => {
  return (
    <DownloadManifestButton
      fileCount={viewer.projects.hits.edges[0].node.summary.file_count}
      filters={{
        op: 'IN',
        content: {
          field: 'cases.project.project_id',
          value: [projectId],
        },
      }} />
  );
});
