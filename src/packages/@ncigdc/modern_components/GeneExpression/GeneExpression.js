/* tslint:disable */
/* eslint-disable camelcase */

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { Row, Column } from '@ncigdc/uikit/Flex';

import GeneExpressionChart from './GeneExpressionChart';

import dataObj from './inchlib/data';

const dataSizes = Object.keys(dataObj);

const showDataButtons = localStorage.REACT_APP_DISPLAY_GENE_EXPRESSION_BUTTONS;

export class GeneExpression extends Component {
  state = {
    case_uuid: '',
    data: dataObj.data3x2,
    gene_ensembl: '',
    toCase: false,
    toGene: false,
    // data: showDataButtons
    //   ? null
    //   : dataObj.data100x100,
  };

  handleInchlibClick = (
    { detail: { case_uuid = '', gene_ensembl = '' } },
  ) => {
    this.setState({
      case_uuid,
      gene_ensembl,
      toCase: case_uuid !== '',
      toGene: gene_ensembl !== '',
    });
  }

  handleDataButton = size => {
    const data = dataObj[size];
    this.setState({ data });
  };

  render() {
    const {
      case_uuid, data, gene_ensembl, toCase, toGene,
    } = this.state;

    return toCase
      ? <Redirect to={`/cases/${case_uuid}`} />
      : toGene
        ? <Redirect to={`/genes/${gene_ensembl}`} />
        : (
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
                    handleInchlibClick={this.handleInchlibClick}
                    />
                )}
              </Column>
            </Row>
          </Column>
        );
  }
}

export default GeneExpression;
