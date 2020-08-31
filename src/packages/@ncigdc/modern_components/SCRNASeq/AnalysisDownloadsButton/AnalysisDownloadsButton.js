import React from 'react';
import {
  compose,
  pure,
  setDisplayName,
  withHandlers,
  withProps,
} from 'recompose';
import { find } from 'lodash';

import DropDown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import Button from '@ncigdc/uikit/Button';
import { Tooltip } from '@ncigdc/uikit/Tooltip';

const enhance = compose(
  setDisplayName('EnhancedAnalysisDownloadsButton'),
  pure,
  withProps(({
    viewer: { repository: { files: { hits: { edges = [] }}}}
  }) => ({
    analysisFiles: edges.map(({ node: { data_type, file_id }}) => ({
      data_type,
      file_id,
      label: data_type === 'Single Cell Analysis'
        ? 'Cell Counts'
        : data_type
    }))
  })),
  withHandlers({
    handleAnalysisClick: ({
      analysisFiles,
      case_id,
    }) => (data_type) => () => {
      const analysisFile = find(analysisFiles, file => file.data_type === data_type);
      const file_id = analysisFile && analysisFile.file_id;
      console.log({analysisFile, data_type, file_id})
      // TODO: call download() util (see DownloadFile.js & DownloadButton.js)
    },
  }),
);

const AnalysisDownloadsButton = ({ analysisFiles, handleAnalysisClick, viewer: { repository: { files: { hits: { edges = [] }}}} }) => {
  console.log({analysisFiles});
  console.log({edges})
  return (
    <DropDown
      button={(
        <Tooltip
          Component={<div>Analysis Downloads</div>}
          >
          <Button>
            <i
              aria-hidden="true"
              className="fa fa-download"
              />
            <span style={{ marginLeft: 6 }}>Analysis Downloads</span>
          </Button>
        </Tooltip>
      )}
      dropdownStyle={{ 
        // move to the right to compensate for
        // div added by relay component
        right: -172,
        width: 200,
      }}
      isDisabled={analysisFiles.length === 0}
      >
      {analysisFiles.map(file => (
        <DropdownItem
          key={file.label}
          onClick={handleAnalysisClick(file.data_type)}
          style={{
            cursor: 'pointer',
            width: 'auto',
          }}
          >
          {file.label}
        </DropdownItem>
      ))}
    </DropDown>
  )
};

export default enhance(AnalysisDownloadsButton);
