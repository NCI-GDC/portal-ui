/* tslint:disable */
/* eslint-disable camelcase */

import React, { Component } from 'react';
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
import SCRNASeqChart from './SCRNASeqChart';
import dataObj from './data';

// start - for viz demo
// import pre-made clustered data,
// and use buttons to switch between datasets

const dataTypes = Object.keys(dataObj);
// const showDataButtons = localStorage.REACT_APP_DISPLAY_SCRNA_SEQ_BUTTONS || false;
const showDataButtons = true;
// end - for viz demo

const styleData = (input = []) => input.map(row => ({
  ...row,
  marker: {
    opacity: 0.75,
    size: 10,
  },
}));

const enhance = compose(
  setDisplayName('EnhancedSCRNASeq'),
  withRouter,
  pure,
  withState('activeTab', 'setActiveTab', 0),
  withState('data', 'setData', styleData(dataObj.umap)),
  withState('dataType', 'setDataType', 'umap'),
  withHandlers({
    handleSetData: ({ setData, setDataType }) => dataType => {
      const data = styleData(dataObj[dataType]);
      setDataType(dataType);
      setData(data);
    },
  }),

);

const SCRNASeq = ({
  activeTab, data, dataType, handleSetData, setActiveTab,
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
          }}
          onTabClick={i => setActiveTab(i)}
          tabs={[<p key="Analysis">Analysis</p>, <p key="Summary">Summary</p>]}
          >
          {dataTypes.length > 0 && (
            // for viz demo
            <Row>
              {dataTypes.map(dType => (
                <button
                  key={dType}
                  onClick={() => handleSetData(dType)}
                  type="button"
                  >
                  {dType}
                </button>
              ))}
            </Row>
          )}
          {activeTab === 0 && data.length > 0 && (
            <SCRNASeqChart
              data={data}
              dataType={dataType}
              />
          )}
        </Tabs>
      </Column>
    </Row>
  </Column>
);

export default enhance(SCRNASeq);
