/* eslint-disable react/state-in-constructor */
/* tslint:disable */

import React, { Component } from 'react';

import { Row, Column } from '@ncigdc/uikit/Flex';

import GeneExpressionChart from './GeneExpressionChart';

import data10x5 from './inchlib/data';
import data2000x50 from './inchlib/zhenyu-2000x50';

const dataSizes = ['10x5', '2000x50'];

const showDataButtons = localStorage.REACT_APP_DISPLAY_GENE_EXPRESSION_BUTTONS;

export class GeneExpression extends Component {
  state = {
    data: showDataButtons
      ? null
      : data10x5,
  };

  handleButton = size => {
    let data;
    switch (size) {
      case '10x5':
        data = data10x5;
        break;
      case '2000x50':
        data = data2000x50;
        break;
      default:
        data = null;
    }
    this.setState({ data });
  };

  render() {
    const { data = null } = this.state;

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
            <h1 style={{ margin: '0 0 20px' }}>Gene Expression</h1>
            {showDataButtons && (
              <Row>
                {dataSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => this.handleButton(size)}
                    type="button"
                    >
                    {`Show ${size} dataset`}
                  </button>
                ))}
              </Row>
            )}
            {data && (
              <GeneExpressionChart
                data={data}
                />
            )}
          </Column>
        </Row>
      </Column>
    );
  }
}

export default GeneExpression;
