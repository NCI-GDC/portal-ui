/* tslint:disable */
/* eslint-disable camelcase */

import React, { Component } from 'react';
import {
  compose,
  pure,
  setDisplayName,
} from 'recompose';

import { Row, Column } from '@ncigdc/uikit/Flex';
import withRouter from '@ncigdc/utils/withRouter';

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
);

class SCRNASeq extends Component {
  state = {
    data: styleData(dataObj.umap), // for viz demo
    dataType: 'umap',
  };

  handleDataButton = dataType => {
    // for viz demo
    const data = styleData(dataObj[dataType]);
    this.setState({
      data,
      dataType,
    });
  };

  render() {
    const { data, dataType } = this.state;

    return (
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
            <h1 style={{ margin: '0 0 20px' }}>SCRNA-Seq</h1>
            {showDataButtons && (
              // for viz demo
              <Row>
                {dataTypes.map(dType => (
                  <button
                    key={dType}
                    onClick={() => this.handleDataButton(dType)}
                    type="button"
                    >
                    {dType}
                  </button>
                ))}
              </Row>
            )}
            {data && (
              <SCRNASeqChart
                data={data}
                dataType={dataType}
                />
            )}
          </Column>
        </Row>
      </Column>
    );
  }
}

export default enhance(SCRNASeq);
