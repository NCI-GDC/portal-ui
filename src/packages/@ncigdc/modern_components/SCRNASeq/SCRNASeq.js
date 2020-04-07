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

import Counter from './Counter';
import { SCRNASeqPlot } from './plots';
import { ClusterTable, summaryData, SummaryTable } from './tables';
import './styles.scss';
import { toolbarButtons } from './plots/common'; 
import { DownloadButton} from './toolbar';

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
            <div
              className="scrnaseq-row"
              >
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
                  <Row style={{ alignItems: 'center', ustifyContent: 'space-between', marginBottom: 10, width: '100%' }}>
                    <h3 style={{ margin: 0, width: '100%', textAlign: 'left' }}>Read and Gene Counts Per Cell TEST</h3>
                    <DownloadButton 
                      {...toolbarButtons.download}
                      downloadOptions={[
                        { label: 'TSV' }
                      ]}
                      />
                  </Row>
                  <ClusterTable />
                </div>
              </div>
            </div>
          )
          : (
            <div className="scrnaseq-row">
              <div className="scrnaseq-column">
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
              </div>
              <div className="scrnaseq-column">
                {Object.values(summaryData.rightColumnTables).map(table => (
                  <SummaryTable
                    containerStyle={containerStyle}
                    header={table.header}
                    key={table.header}
                    rows={table.rows}
                    />
                ))}
              </div>
            </div>
          )}
      </Tabs>
    </Column>
  </Row>

);

export default enhance(SCRNASeq);
