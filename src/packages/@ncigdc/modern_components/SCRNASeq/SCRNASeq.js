/* tslint:disable */
/* eslint-disable camelcase */

import React from 'react';
import {
  compose,
  pure,
  setDisplayName,
} from 'recompose';

import { Row, Column } from '@ncigdc/uikit/Flex';
import SCRNASeqPlot from './SCRNASeqPlot';
import { toolbarButtons } from './SCRNASeqPlot/utils';
import './styles.scss';
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
      <Row
        style={{
          borderBottom: '1px solid #ccc',
          justifyContent: 'space-between',
          marginBottom: 20,
          width: '100%',
        }}
        >
        <h1
          style={{
            margin: '0 0 10px 0',
          }}
          >
          Single Cell RNA Sequencing
        </h1>
        <DownloadButton {...toolbarButtons.download} />

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
