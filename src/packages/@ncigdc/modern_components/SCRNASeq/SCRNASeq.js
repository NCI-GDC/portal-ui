/* tslint:disable */
/* eslint-disable camelcase */

import React from 'react';
import {
  compose,
  pure,
  setDisplayName,
  withState,
} from 'recompose';

import { Row, Column } from '@ncigdc/uikit/Flex';
import Tabs from '@ncigdc/uikit/Tabs';

import { Counter } from './components';
import { MedianGenesPlot, SCRNASeqPlot, SequencingSaturationPlot } from './plots';
import { ClusterTable, summaryData, SummaryTable } from './tables';
import './styles.scss';

// temporarily importing data
import stubData from './stubData';

const dataTypes = Object.keys(stubData);

const containerStyle = {
  alignItems: 'center',
  boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  marginBottom: 10,
  padding: 20,
};

const enhance = compose(
  setDisplayName('EnhancedSCRNASeq'),
  pure,
  withState('activeTab', 'setActiveTab', 0),
);

const SCRNASeq = ({
  activeTab,
  setActiveTab,
}) => (
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
        {activeTab === 0
          ? (
            <div>
              {dataTypes.map(dType => (
                <div
                  key={stubData[dType].name}
                  style={containerStyle}
                  >
                  <h2
                    style={{
                      marginTop: 0,
                      width: '100%',
                    }}
                    >
                    {stubData[dType].name}
                  </h2>
                  <div className="scrnaseq-projection">
                    <SCRNASeqPlot
                      className="scrnaseq-cluster-plot"
                      data={stubData[dType].data}
                      dataType={stubData[dType].name}
                      />
                    <div
                      className="scrnaseq-cluster-table"
                      >
                      <h3 style={{ marginTop: 0 }}>Top Features by Cluster (Log2 fold-change, p-value)</h3>
                      <ClusterTable />
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 10 }}>
                <div
                  className="scrnaseq-column"
                  style={{
                    ...containerStyle,
                  }}
                  >
                  <SequencingSaturationPlot />
                </div>
                <div
                  className="scrnaseq-column"
                  style={{
                    ...containerStyle,
                  }}
                  >
                  <MedianGenesPlot />
                </div>
              </div>
            </div>
          )
          : (
            <Row style={{ margin: '0 -5px' }}>
              <Column
                style={{
                  padding: '0 5px',
                  width: '50%',
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
                {Object.values(summaryData.leftColumnTables).map(table => (
                  <SummaryTable
                    containerStyle={containerStyle}
                    header={table.header}
                    key={table.header}
                    rows={table.rows}
                    />
                ))}
              </Column>
              <Column
                style={{
                  padding: '0 5px',
                  width: '50%',
                }}
                >
                {Object.values(summaryData.rightColumnTables).map(table => (
                  <SummaryTable
                    containerStyle={containerStyle}
                    header={table.header}
                    key={table.header}
                    rows={table.rows}
                    />
                ))}
              </Column>
            </Row>
          )}
      </Tabs>
    </Column>
  </Row>

);

export default enhance(SCRNASeq);
