import React from 'react';
import { compose, pure, setDisplayName } from 'recompose';

const enhance = compose(
  setDisplayName('SelectScrnaSeqWorkflowPresentation'),
  pure,
);

const SelectScrnaSeqWorkflow = ({
  selectedCase,
  setSelectedFile,
  viewer: { repository: { files: { hits } } },
}) => {
  const workflowTypes = hits && hits.edges;
  return (
    <div>
      {workflowTypes.map(({
        node: { analysis: { workflow_type }, file_id }
      }) => (
        <label
          key={file_id}
          style={{ display: 'block', marginBottom: 10 }}
          >
          <input
            aria-describedby="scrnaseq-select-workflow-description"
            name="scrnaseq-select-workflow"
            onChange={e => setSelectedFile(e.target.value)}
            type="radio"
            value={file_id}
            />
          {` ${workflow_type}`}
        </label>
      ))}
    </div>
  )
};

export default enhance(SelectScrnaSeqWorkflow);