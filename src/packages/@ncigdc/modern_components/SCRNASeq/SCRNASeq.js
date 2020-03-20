/* tslint:disable */
/* eslint-disable camelcase */

import React from 'react';
import {
  compose,
  pure,
  setDisplayName,
  withPropsOnChange,
  withState,
} from 'recompose';

import { Row, Column } from '@ncigdc/uikit/Flex';
import withRouter from '@ncigdc/utils/withRouter';
import Tabs from '@ncigdc/uikit/Tabs';

import ScrnaDevSettings from './ScrnaDevSettings';
import { MedianGenesPlot, SCRNASeqPlot, SequencingSaturationPlot } from './plots';
import { ClusterTable } from './tables';
import './style.css';
import Counter from './Counter';

// temporarily importing data
import stubData from './stubData';

const dataTypes = Object.keys(stubData);

const containerStyle = {
  alignItems: 'center',
  boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: '0 10px 10px',
  padding: 20,
};

const enhance = compose(
  setDisplayName('EnhancedSCRNASeq'),
  withRouter,
  pure,
  withState('activeTab', 'setActiveTab', 1),
  withState('dataType', 'setDataType', 'umap'),
  withPropsOnChange(['dataType'], ({ dataType }) => ({
    data: stubData[dataType],
  })),
);

const SCRNASeq = ({
  activeTab,
  data,
  dataType,
  setActiveTab,
  setDataType,
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
            padding: '20px 0 0',
          }}
          onTabClick={i => setActiveTab(i)}
          tabs={[<span key="Analysis">Analysis</span>, <span key="Summary">Summary</span>]}
          >
          {/* <ScrnaDevSettings
            dataType={dataType}
            dataTypes={dataTypes}
            handleDataButton={setDataType}
            /> */}
          {data.length > 0 &&
            (activeTab === 0
              ? (
                <div>
                  <div
                    style={containerStyle}
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
                        ...containerStyle,
                        flexGrow: 1,
                        marginRight: 10,
                      }}
                      >
                      <SequencingSaturationPlot />
                    </div>
                    <div
                      style={{
                        ...containerStyle,
                        flexGrow: 1,
                        marginLeft: 10,
                      }}
                      >
                      <MedianGenesPlot />
                    </div>
                  </Row>
                </div>
            ) : (
              <Row>
                <Column
                  style={{
                    margin: -10,
                  }}
                  >
                  <div style={containerStyle}>
                    <Counter
                      metric="5,247"
                      name="Estimated Number of Cells"
                      threshold="pass"
                      />
                  </div>
                  <div style={containerStyle}>
                    <Row>
                      <Counter
                        metric="28,918"
                        name="Mean Reads per Cell"
                        threshold="pass"
                        />
                      <Counter
                        metric="1,644"
                        name="Median Genes per Cell"
                        threshold="pass"
                        />
                    </Row>
                  </div>
                </Column>
              </Row>
            ))}
        </Tabs>
      </Column>
    </Row>
  </Column>
);

export default enhance(SCRNASeq);
