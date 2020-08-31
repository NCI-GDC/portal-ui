import React from 'react';
import {
  compose,
  pure,
  setDisplayName,
  withHandlers,
  withProps,
} from 'recompose';
import { find } from 'lodash';
import urlJoin from 'url-join';

import DropDown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import Button from '@ncigdc/uikit/Button';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { AUTH_API } from '@ncigdc/utils/constants';
import download from '@ncigdc/utils/download';

const enhance = compose(
  setDisplayName('EnhancedAnalysisDownloadsButton'),
  pure,
  withProps(({
    viewer: { repository: { files: { hits: { edges = [] }}}}
  }) => ({
    analysisFiles: edges.map(({ node }) => ({
      ...node,
      label: node.data_type === 'Single Cell Analysis'
        ? 'Cell Counts'
        : node.data_type
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
      const params = {
        filename: analysisFile.file_name,
        ids: analysisFile.file_id,
        size: analysisFile.file_size,
      }
      download({
        params,
        url: urlJoin(AUTH_API, 'data?annotations=true&related_files=true'),
      })
    },
  }),
);

const AnalysisDownloadsButton = ({ analysisFiles, handleAnalysisClick }) => {
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
