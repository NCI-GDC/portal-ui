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

// temporarily importing data
import stubData from './stubData';

const dataTypes = Object.keys(stubData);

const containerStyle = {
  alignItems: 'center',
  border: '1px solid #c8c8c8',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: 20,
};

const enhance = compose(
  setDisplayName('EnhancedSCRNASeq'),
  withRouter,
  pure,
  withState('activeTab', 'setActiveTab', 0),
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
          <ScrnaDevSettings
            dataType={dataType}
            dataTypes={dataTypes}
            handleDataButton={setDataType}
            />
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
              <div>Summary</div>
            ))}
        </Tabs>
      </Column>
    </Row>
  </Column>
);

export default enhance(SCRNASeq);
