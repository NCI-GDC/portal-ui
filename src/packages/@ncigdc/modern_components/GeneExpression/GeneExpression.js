/* eslint-disable react/state-in-constructor */
/* tslint:disable */

import React, { Component } from 'react';

import { Row, Column } from '@ncigdc/uikit/Flex';

import GeneExpressionChart from './GeneExpressionChart';

import dataObj from './inchlib/data';

const dataSizes = Object.keys(dataObj);

const showDataButtons = localStorage.REACT_APP_DISPLAY_GENE_EXPRESSION_BUTTONS;

export class GeneExpression extends Component {
  state = {
    data: dataObj.data3x2,
    // data: showDataButtons
    //   ? null
    //   : dataObj.data100x100,
  };

  handleDataButton = size => {
    const data = dataObj[size];
    this.setState({ data });
  };

  render() {
    const { data } = this.state;

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
                    onClick={() => this.handleDataButton(size)}
                    type="button"
                    >
                    {size.split('data')[1]}
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
