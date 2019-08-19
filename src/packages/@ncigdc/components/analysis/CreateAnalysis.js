import React from 'react';
import {
  branch,
  compose,
  renderComponent,
  withState,
} from 'recompose';
import { connect } from 'react-redux';

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
  analysis,
  dispatch,
  numAnalysis,
  push,
  setAnalysis,
}) => {
  const SelectSetComponent = analysis && analysis.type === 'clinical_data'
    ? ClinicalAnalysisLaunch
    : SelectSet;

  return analysis
    ? (
      <SelectSetComponent
        {...analysis}
        onCancel={() => setAnalysis(null)}
        onRun={sets => {
          const created = new Date().toISOString();
          const id = created;

          dispatch(
            addAnalysis(Object.assign(
              {
                created,
                id,
                sets,
                type: analysis.type,
              },
              analysis.type === 'clinical_data' && {
                displayVariables: defaultVariables,
                name: `Custom Analysis ${numAnalysis + 1}`,
              },
            ))
          ).then(() => {
            push({
              query: {
                analysisId: id,
                analysisTableTab: 'result',
              },
            });
          });
        }}
        />
    )
    : (
      <Row
        style={{
          flexFlow: 'row wrap',
          justifyContent: 'space-between',
          margin: '0 2rem',
          padding: '2rem 2.5rem',
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
