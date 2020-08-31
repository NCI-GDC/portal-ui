import React from 'react';
import {
  compose,
  lifecycle,
  pure,
  setDisplayName,
  withHandlers,
  withProps,
  withPropsOnChange,
  withState,
} from 'recompose';
import { find } from 'lodash';

import DropDown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import Button from '@ncigdc/uikit/Button';
import { Tooltip } from '@ncigdc/uikit/Tooltip';

const downloadOptions = [
  {
    data_type: 'Single Cell Analysis',
    label: 'Cell Counts',
  },
  {
    data_type: 'Differential Gene Expression',
    label: 'Differential Gene Expression',
  },
];

const enhance = compose(
  setDisplayName('EnhancedAnalysisDownloadsButton'),
  pure,
  withHandlers({
    handleAnalysisClick: ({
      case_id,
      viewer: { repository: { files: { hits: { edges = [] }}}},
    }) => (data_type) => () => {
      const tsvFile = find(edges, edge => edge.data_type === data_type);
      const file_id = tsvFile && tsvFile.file_id;
      console.log(edges, data_type, tsvFile, file_id)
      // TODO: call download() util (see DownloadFile.js & DownloadButton.js)
    },
  }),
);

const AnalysisDownloadsButton = ({ handleAnalysisClick }) => {
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
      >
      {downloadOptions.map(dlOpt => (
        <DropdownItem
          key={dlOpt.label}
          onClick={handleAnalysisClick(dlOpt.data_type)}
          style={{
            cursor: 'pointer',
            width: 'auto',
          }}
          >
          {dlOpt.label}
        </DropdownItem>
      ))}
    </DropDown>
  )
};

export default enhance(AnalysisDownloadsButton);
