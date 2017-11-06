import React from 'react';
import { compose, withState, branch, renderComponent } from 'recompose';
import { connect } from 'react-redux';

import { addAnalysis } from '@ncigdc/dux/analysis';
import withRouter from '@ncigdc/utils/withRouter';
import Button from '@ncigdc/uikit/Button';
import { Row } from '@ncigdc/uikit/Flex';

import availableAnalysis from './availableAnalysis';
import SelectSet from './SelectSet';

import DemoButton from './DemoButton';

const enhance = compose(
  branch(
    () => !availableAnalysis.length,
    renderComponent(() => (
      <div style={{ padding: '2rem 2.5rem' }}>
        No analysis currently available
      </div>
    )),
  ),
  withState('analysis', 'setAnalysis', null),
  connect(),
  withRouter,
);

const CreateAnalysis = ({ analysis, setAnalysis, dispatch, push }) => {
  return analysis ? (
    <SelectSet
      {...analysis}
      onCancel={() => setAnalysis(null)}
      onRun={sets => {
        const created = new Date().toISOString();
        const id = created;

        dispatch(
          addAnalysis({
            id,
            sets,
            type: analysis.type,
            created,
          }),
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
    <Row>
      <div style={{ padding: '2rem 2.5rem', flex: 1 }}>
        {availableAnalysis.map(analysis => {
          return (
            <Row key={analysis.type}>
              <div style={{ width: 80, margin: 20 }}>
                <analysis.Icon style={{ width: 80, margin: 20 }} />
              </div>
              <div>
                <h1 style={{ fontSize: '2rem' }}>{analysis.label}</h1>
                <div style={{ marginBottom: 10 }}>{analysis.description}</div>
                <Row spacing={5}>
                  <Button onClick={() => setAnalysis(analysis)}>Select</Button>
                  <DemoButton
                    demoData={analysis.demoData}
                    type={analysis.type}
                  />
                </Row>
              </div>
            </Row>
          );
        })}
      </div>
      <div
        // for a second column of analysis when the time comes
        style={{ flex: 1 }}
      />
    </Row>
  );
};

export default enhance(CreateAnalysis);
