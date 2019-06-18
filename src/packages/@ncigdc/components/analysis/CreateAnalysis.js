import React from 'react';
import {
  compose, withState, branch, renderComponent,
} from 'recompose';
import { sampleSize, reduce } from 'lodash';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import { addAnalysis } from '@ncigdc/dux/analysis';
import withRouter from '@ncigdc/utils/withRouter';
import Button from '@ncigdc/uikit/Button';
import { Row } from '@ncigdc/uikit/Flex';
import { zDepth1 } from '@ncigdc/theme/mixins';

import ClinicalAnalysisLaunch from './ClinicalAnalysisLaunch';
import availableAnalysis from './availableAnalysis';
import SelectSet from './SelectSet';

import DemoButton from './DemoButton';
import defaultVariables from './defaultCDAVEvariables';

const enhance = compose(
  branch(
    () => !availableAnalysis.length,
    renderComponent(() => (
      <div style={{ padding: '2rem 2.5rem' }}>
        No analysis currently available
      </div>
    ))
  ),
  withState('analysis', 'setAnalysis', null),
  connect(state => ({
    numAnalysis: state.analysis.saved.filter(analysis => analysis.type === 'clinical_data').length,
  })),
  withRouter
);

const CreateAnalysis = ({
  analysis, dispatch, numAnalysis, push, setAnalysis,
}) => {
  const SelectSetComponent =
    analysis && analysis.type === 'clinical_data'
      ? ClinicalAnalysisLaunch
      : SelectSet;

  return analysis ? (
    <SelectSetComponent
      {...analysis}
      onCancel={() => setAnalysis(null)}
      onRun={sets => {
        const created = new Date().toISOString();
        const id = created;
        const colorList = sampleSize(d3.schemeCategory20, 4);
        const keys = Object.keys(defaultVariables);
        dispatch(
          addAnalysis({
            id,
            type: analysis.type,
            created,
            colorSets: colorList,
            sets,
            ...(analysis.type === 'clinical_data'
              ? {
                name: `Custom Analysis ${numAnalysis + 1}`,
                displayVariables: reduce(
                  defaultVariables,
                  (acc, variable, key) => {
                    return {
                      ...acc,
                      [key]: {
                        ...variable,
                        color: colorList[(keys.indexOf(key)) % colorList.length],
                      },
                    };
                  }, {}
                ),
              }
              : {}),
          })
        ).then(() => {
          push({
            query: {
              analysisTableTab: 'result',
              analysisId: id,
            },
          });
        });
      }}
      />
  ) : (
    <Row
        style={{
          padding: '2rem 2.5rem',
          flexFlow: 'row wrap',
          margin: '0 2rem',
          justifyContent: 'space-between',
        }}
        >
        {availableAnalysis.map(analysis => {
          return (
            <Row
              key={analysis.type}
              style={{
                ...zDepth1,
                margin: '2rem',
                padding: '2rem',
                width: '45%',
              }}
              >
              <div style={{ margin: 20 }}>
                <analysis.Icon />
              </div>
              <div>
                <h1 style={{ fontSize: '2rem' }}>{analysis.label}</h1>
                <div style={{ marginBottom: 10 }}>{analysis.description}</div>
                <Row spacing={5}>
                  <Button onClick={() => setAnalysis(analysis)}>Select</Button>
                  <DemoButton demoData={analysis.demoData} type={analysis.type} />
                </Row>
              </div>
            </Row>
          );
        })}
      </Row>
    );
};

export default enhance(CreateAnalysis);
