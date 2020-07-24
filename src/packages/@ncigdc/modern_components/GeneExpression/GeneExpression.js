/* eslint-disable camelcase */

import React, { Component } from 'react';
import {
  compose,
  lifecycle,
  pure,
  setDisplayName,
  withHandlers,
  withState,
} from 'recompose';

import { Row, Column } from '@ncigdc/uikit/Flex';
import { fetchApi } from '@ncigdc/utils/ajax';
import withRouter from '@ncigdc/utils/withRouter';

import GeneExpressionChart from './GeneExpressionChart';

import dataObj from './inchlib/data';
import * as helper from './helpers';

export default compose(
  setDisplayName('EnhancedGeneExpression'),
  withState('visualizationData', 'setVisualizationData', null),
  withHandlers({
    fetchVisualizationData: ({ setVisualizationData }) => () => {
      fetchApi('gene-expression/visualize', {
        method: 'POST'
      })
        .then(data => {
          data && data.inchlib && setVisualizationData(data.inchlib);
        })
        .catch(error => console.error(error));
    },
  }),
  lifecycle({
    componentDidMount() {
      const { fetchVisualizationData } = this.props;
      fetchVisualizationData();
    }
  }),
  withRouter,
  pure,
)(({ visualizationData }) => (
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
        <h1 style={{ margin: '0 0 20px' }}>Gene Expression</h1>
        {visualizationData && (
          <GeneExpressionChart
            data={visualizationData}
            handleClickInchlibLink={helper.handleClickInchlibLink}
            />
        )}
      </Column>
    </Row>
  </Column>
));
