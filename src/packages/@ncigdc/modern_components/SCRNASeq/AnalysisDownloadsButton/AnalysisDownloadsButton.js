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

import DropDown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';

import { buttonList } from '../SCRNASeqPlot/utils';
import { ToolbarButton } from '../toolbar';

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
      tsvIds,
    }) => (data_type) => () => {
      console.log(data_type)
      // TODO: call download() util (see DownloadFile.js & DownloadButton.js)
      // pseudo code:
      // const file_id = tsvIds[data_type]
      console.log('clicked analysis dropdown item', case_id, data_type)
    },
  }),
);

const AnalysisDownloadsButton = ({ handleAnalysisClick }) => {
  return (
    <DropDown
      button={(
        <ToolbarButton
          {...buttonList.downloadAnalysis}
          />
      )}
      dropdownStyle={{ width: 200 }}
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