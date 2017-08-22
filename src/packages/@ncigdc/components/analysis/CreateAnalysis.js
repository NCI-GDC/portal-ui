import React from 'react';
import { compose, withState, branch, renderComponent } from 'recompose';
import { connect } from 'react-redux';

import { addAnalysis } from '@ncigdc/dux/analysis';
import withRouter from '@ncigdc/utils/withRouter';
import Button from '@ncigdc/uikit/Button';
import { Row } from '@ncigdc/uikit/Flex';

import availableAnalysis from './availableAnalysis';
import SelectSet from './SelectSet';

const enhance = compose(
  branch(
    () => !availableAnalysis.length,
    renderComponent(() =>
      <div style={{ padding: '2rem 2.5rem' }}>
        No analysis currently available
      </div>,
    ),
  ),
  withState('analysis', 'setAnalysis', null),
  connect(),
  withRouter,
);

const CreateAnalysis = ({ analysis, setAnalysis, dispatch, push }) => {
  const onDemo = type => {
    push({
      query: {
        analysisTableTab: 'result',
        analysisId: `demo-${type}`,
      },
    });
  };

  return analysis
    ? <SelectSet
        {...analysis}
        onDemo={() => onDemo(analysis.type)}
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
    : <div style={{ padding: '2rem 2.5rem' }}>
        {availableAnalysis.map(analysis => {
          return (
            <Row
              style={{ width: '50%', alignItems: 'center' }}
              key={analysis.type}
            >
              <analysis.Icon style={{ fontSize: 40, marginRight: 25 }} />
              <div>
                <h1 style={{ fontSize: '2rem' }}>{analysis.label}</h1>
                <div style={{ marginBottom: 10 }}>{analysis.description}</div>
                <Row spacing={5}>
                  <Button onClick={() => setAnalysis(analysis)}>
                    Select
                  </Button>
                  <Button onClick={() => onDemo(analysis.type)}>Demo</Button>
                </Row>
              </div>
            </Row>
          );
        })}
      </div>;
};

export default enhance(CreateAnalysis);
