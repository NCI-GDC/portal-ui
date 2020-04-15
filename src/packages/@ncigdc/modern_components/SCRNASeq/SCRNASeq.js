/* tslint:disable */
/* eslint-disable camelcase */

import React from 'react';
import {
  compose,
  pure,
  setDisplayName,
} from 'recompose';

import { Row, Column } from '@ncigdc/uikit/Flex';
import { SCRNASeqPlot } from './plots';
import './styles.scss';
import { toolbarButtons } from './plots/common';
import { DownloadButton } from './toolbar';

// temporarily importing data
import stubData from './stubData';

const dataTypes = Object.keys(stubData);

const enhance = compose(
  setDisplayName('EnhancedSCRNASeq'),
  pure,
);

const SCRNASeq = () => (
  <Row
    style={{
      margin: '10px 0',
      padding: '2rem 3rem',
    }}
    >
    <Column
      style={{
        flex: '1 0 auto',
      }}
      >
      <h1 style={{ margin: '0 0 20px' }}>Single Cell RNA Sequencing</h1>
      <div className="scrnaseq-row">
        {dataTypes.map(dType => (
          <div
            className="scrnaseq-column"
            key={stubData[dType].name}
            >
            <div className="scrnaseq-card">
              <SCRNASeqPlot
                className="scrnaseq-cluster-plot"
                data={stubData[dType].data}
                dataType={stubData[dType].name}
                />
            </div>
          </div>
        ))}
        <div className="scrnaseq-column">
          <div className="scrnaseq-card">
            <Row
              style={{
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
                width: '100%',
              }}
              >
              <h3
                style={{
                  margin: 0,
                  textAlign: 'left',
                  width: '100%',
                }}
                >
                      Read and Gene Counts Per Cell
              </h3>
              <DownloadButton
                      // TODO: this button is for display purposes only
                {...toolbarButtons.download}
                downloadOptions={[{ label: 'TSV' }]}
                />
            </Row>
          </div>
        </div>
      </div>
    </Column>
  </Row>
);

export default enhance(SCRNASeq);
