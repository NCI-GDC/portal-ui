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

import GeneExpressionChart from './GeneExpressionChart';

// start - for viz demo
// import pre-made clustered data,
// and use buttons to switch between datasets
import dataObj from './inchlib/data';

const dataSizes = Object.keys(dataObj);
const showDataButtons = localStorage.REACT_APP_DISPLAY_GENE_EXPRESSION_BUTTONS || false;
// end - for viz demo

const enhance = compose(
  setDisplayName('EnhancedGeneExpression'),
  withRouter,
  pure,
);

class GeneExpression extends Component {
  state = {
    data: dataObj.data50x50, // for viz demo
  };

  handleClickInchlibLink = (
    {
      detail: {
        case_uuid = '',
        gene_ensembl = '',
      },
    },
  ) => {
    const nextPage = gene_ensembl === ''
      ? `/cases/${case_uuid}`
      : `/genes/${gene_ensembl}`;
    // This opens the link in a new tab
    Object.assign(document.createElement('a'), {
      href: nextPage,
      target: '_blank',
    }).click();
  }

  handleDataButton = size => {
    // for viz demo
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
              // for viz demo
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
                handleClickInchlibLink={this.handleClickInchlibLink}
                />
            )}
          </Column>
        </Row>
      </Column>
    );
  }
}

export default enhance(GeneExpression);
