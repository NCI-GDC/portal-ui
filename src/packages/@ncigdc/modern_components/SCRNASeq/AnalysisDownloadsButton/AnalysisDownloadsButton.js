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

import { buttonList } from '../SCRNASeqPlot/utils';
import { DownloadButton } from '../toolbar';

const enhance = compose(
  setDisplayName('EnhancedAnalysisDownloadsButton'),
  pure,
  withHandlers({
    handleAnalysisClick: ({
      case_id,
      tsvIds,
    }) => (data_type) => {
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
    <DownloadButton
      onAnalysisClick={handleAnalysisClick}
      {...buttonList.downloadAnalysis}
      />
  )
};

export default enhance(AnalysisDownloadsButton);