import React from 'react';
import { compose, withState, branch, renderComponent } from 'recompose';
import { connect } from 'react-redux';

import { addAnalysis } from '@ncigdc/dux/analysis';
import withRouter from '@ncigdc/utils/withRouter';
import Button from '@ncigdc/uikit/Button';
import { Row } from '@ncigdc/uikit/Flex';
import { zDepth1 } from '@ncigdc/theme/mixins';

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
    <Row
      style={{
        padding: '2rem 2.5rem',
        flexFlow: 'row wrap',
        margin: '0 2rem',
        justifyContent: 'space-between',
      }}
    >
      {/* <div
        style={{

          flex: 1,
          flexWrap: 'wrap',
        }}
      > */}
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
      {/* </div> */}
      {/* <div
        // for a second column of analysis when the time comes
        style={{ flex: 1 }}
      /> */}
    </Row>
  );
};

export default enhance(CreateAnalysis);
