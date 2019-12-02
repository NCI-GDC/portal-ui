import React, { Component } from 'react';

import { Row, Column } from '@ncigdc/uikit/Flex';

import GeneExpressionChart from './GeneExpressionChart';

export class GeneExpression extends Component {
  render() {
    return (
      <Column style={{ marginBottom: '1rem' }}>
        <Row
          style={{
            margin: '20px 0',
            padding: '2rem 3rem',
          }}
          >
          <Column>
            <h1 style={{ margin: 0 }}>Gene Expression</h1>
            <GeneExpressionChart />
          </Column>
        </Row>
      </Column>
    );
  };
};

export default GeneExpression;