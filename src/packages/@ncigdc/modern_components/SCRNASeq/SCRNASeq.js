/* tslint:disable */
/* eslint-disable camelcase */

import React from 'react';
import {
  compose,
  pure,
  setDisplayName,
  withHandlers,
  withState,
} from 'recompose';

import { Row, Column } from '@ncigdc/uikit/Flex';
import withRouter from '@ncigdc/utils/withRouter';

import Tabs from '@ncigdc/uikit/Tabs';
import { MedianGenesPlot, SCRNASeqPlot, SequencingSaturationPlot } from './plots';
import { ClusterTable } from './tables';
import './style.css';

// temporarily importing data
import stubData from './stubData';

const enhance = compose(
  setDisplayName('EnhancedSCRNASeq'),
  withRouter,
  pure,
  withState('activeTab', 'setActiveTab', 0),
  withState('data', 'setData', stubData.umap),
  withState('dataType', 'setDataType', 'umap'),
  withHandlers({
    handleSetData: ({ setData, setDataType }) => dataType => {
      setDataType(dataType);
      setData(stubData[dataType]);
    },
  }),

);

const SCRNASeq = ({
  activeTab, data, dataType, setActiveTab,
}) => (
  <Column style={{ marginBottom: '1rem' }}>
    <Row
      style={{
        margin: '20px 0',
        padding: '2rem 3rem',
      }}
      >
      <Column
        style={{
          flex: '1 0 auto',
        }}
        >
        <h1 style={{ margin: '0 0 20px' }}>Single Cell RNA Sequencing</h1>
        <Tabs
          activeIndex={activeTab}
          contentStyle={{
            border: 'none',
            borderTop: '1px solid #c8c8c8',
            padding: '20px 0',
          }}
          onTabClick={i => setActiveTab(i)}
          tabs={[<span key="Analysis">Analysis</span>, <span key="Summary">Summary</span>]}
          >
          {activeTab === 0 && data.length > 0 && (
            <div>
              <div
                style={{
                  alignItems: 'center',
                  border: '1px solid #c8c8c8',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: 20,
                }}
                >
                <SCRNASeqPlot
                  data={data}
                  dataType={dataType}
                  />
                <h3>Top Features by Cluster (Log2 fold-change, p-value)</h3>
                <ClusterTable />
              </div>
              <Row style={{ marginTop: 20 }}>
                <div
                  style={{
                    border: '1px solid #c8c8c8',
                    flexGrow: 1,
                    marginRight: 10,
                    padding: 20,
                  }}
                  >
                  <SequencingSaturationPlot />
                </div>
                <div
                  style={{
                    border: '1px solid #c8c8c8',
                    flexGrow: 1,
                    marginLeft: 10,
                    padding: 20,
                  }}
                  >
                  <MedianGenesPlot />
                </div>
              </Row>
            </div>
          )}
        </Tabs>
      </Column>
    </Row>
  </Column>
);

export default enhance(SCRNASeq);
