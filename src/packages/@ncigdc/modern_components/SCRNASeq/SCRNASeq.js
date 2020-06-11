/* tslint:disable */
/* eslint-disable camelcase */

import React from 'react';
import {
  compose,
  withHandlers,
  pure,
  setDisplayName,
} from 'recompose';

import { Row, Column } from '@ncigdc/uikit/Flex';
import SCRNASeqPlot from './SCRNASeqPlot';
import { buttonList } from './SCRNASeqPlot/utils';
import './styles.scss';
import { DownloadButton } from './toolbar';

// temporarily importing data
import stubData from './stubData';

const dataTypes = Object.keys(stubData);

const enhance = compose(
  setDisplayName('EnhancedSCRNASeq'),
  pure,
  withHandlers({
    handleAnalysisClick: () => {
      console.log('clicked analysis dropdown item');
    },
  }),
);

const SCRNASeq = ({ handleAnalysisClick }) => (
  <Row
    style={{
      margin: '10px 0',
      padding: '2rem 3rem',
    }}
    >
    <Column
      style={{
        flex: '1 100%',
      }}
      >
      <Row
        style={{
          borderBottom: '1px solid #ccc',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
        >
        <h1
          style={{
            margin: '0 0 10px 0',
          }}
          >
          Single Cell RNA Sequencing
        </h1>
        <DownloadButton
          onAnalysisClick={handleAnalysisClick}
          {...buttonList.downloadAnalysis}
          />
      </Row>
      <div className="scrnaseq-row">
        {dataTypes.map(dType => (
          <div
            className="scrnaseq-column"
            key={stubData[dType].name}
            >
            <div className="scrnaseq-card">
              <SCRNASeqPlot
                data={stubData[dType].data}
                dataType={stubData[dType].name}
                />
            </div>
          </div>
        ))}
      </div>
    </Column>
  </Row>
);

export default enhance(SCRNASeq);
