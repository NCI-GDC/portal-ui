import React from 'react';
import { compose, withState, branch, renderComponent } from 'recompose';
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

const defaultVariables = {
  'demographic.ethnicity': {
    type: 'Demographic',
    active_chart: 'histogram',
    active_calculation: 'number',
    active_survival: 'overall',
    plotTypes: 'categorical',
    bins: [],
  },

  'demographic.gender': {
    type: 'Demographic',
    active_chart: 'histogram',
    active_calculation: 'number',
    active_survival: 'overall',
    plotTypes: 'categorical',
    bins: [],
  },

  'demographic.race': {
    type: 'Demographic',
    active_chart: 'histogram',
    active_calculation: 'number',
    active_survival: 'overall',
    plotTypes: 'categorical',
    bins: [],
  },
  'diagnoses.age_at_diagnosis': {
    type: 'Diagnosis',
    active_chart: 'histogram',
    active_calculation: 'number',
    active_survival: 'overall',
    plotTypes: 'continuous',
    bins: [],
  },

  'diagnoses.age_at_diagnosis': {
    type: 'Diagnosis',
    active_chart: 'histogram',
    active_calculation: 'number',
    active_survival: 'overall',
    plotTypes: 'continuous',
    bins: [],
  },
  'diagnoses.cause_of_death': {
    type: 'Diagnosis',
    active_chart: 'histogram',
    active_calculation: 'number',
    active_survival: 'overall',
    plotTypes: 'categorical',
    bins: [],
  },
};

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
  connect(),
  withRouter
);

const CreateAnalysis = ({ analysis, setAnalysis, dispatch, push }) => {
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

        dispatch(
          addAnalysis({
            id,
            type: analysis.type,
            created,
            sets,
            ...(analysis.type === 'clinical_data'
              ? {
                  name: Object.values(sets.case)[0],
                  displayVariables: defaultVariables,
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
                {/* disabling demo button until demo data is ready */}
                <DemoButton
                  demoData={analysis.demoData}
                  type={analysis.type}
                  disabled={analysis.type === 'clinical_data'}
                />
              </Row>
            </div>
          </Row>
        );
      })}
    </Row>
  );
};

export default enhance(CreateAnalysis);
