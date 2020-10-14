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
import Chip from '@ncigdc/uikit/Chip';
import { Row } from '@ncigdc/uikit/Flex';
import { zDepth1 } from '@ncigdc/theme/mixins';
import Tooltip from '@ncigdc/uikit/Tooltip/Tooltip';
import availableAnalysis from './availableAnalysis';
import SelectSet from './SelectSet';
import DemoButton from './DemoButton';
import defaultVariables from './defaultCDAVEvariables';
import SelectScrnaSeq from './SelectScrnaSeq';

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
  connect(state => ({
    numAnalysis: state.analysis.saved.filter(analysis => analysis.type === 'clinical_data').length,
  })),
  withRouter,
);

const CreateAnalysis = ({
  analysis,
  dispatch,
  numAnalysis,
  push,
  setAnalysis,
}) => {
  return analysis
    ? analysis.type === 'scrna_seq'
      ? (
        <SelectScrnaSeq
          analysisProps={analysis}
          onCancel={() => setAnalysis(null)}
          onRun={(selectedCase, selectedFile) => {
            const created = new Date().toISOString();
            const id = created;

            dispatch(
              addAnalysis({
                analysisInfo: {
                  ...selectedCase,
                  ...selectedFile,
                },
                created,
                id,
                type: analysis.type,
              }),
            );

            push({
              query: {
                analysisId: id,
                analysisTableTab: 'result',
              },
            });
          }}
          />
        )
      : (
        <SelectSet
          analysisProps={analysis}
          onCancel={() => setAnalysis(null)}
          onRun={sets => {
            const created = new Date().toISOString();
            const id = created;

            dispatch(
              addAnalysis({
                created,
                id,
                sets,
                type: analysis.type,
                ...analysis.type === 'clinical_data' && {
                  displayVariables: defaultVariables,
                  name: `Custom Analysis ${numAnalysis + 1}`,
                },
              }),
            );

            push({
              query: {
                analysisId: id,
                analysisTableTab: 'result',
              },
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
        {availableAnalysis.map(item => {
          return (
            <Row
              key={item.type}
              style={{
                ...zDepth1,
                margin: '2rem',
                padding: '2rem',
                width: '45%',
              }}
              >
              <div style={{ margin: 20 }}>
                <item.Icon />
              </div>
              <div>
                <h1
                  style={{
                    alignItems: 'center',
                    display: 'flex',
                    fontSize: '2rem',
                  }}
                  >
                  {item.label}
                  {item.isBeta && (
                    <Chip
                      label="BETA"
                      style={{
                        marginLeft: '0.5rem',
                      }}
                      />
                  )}
                </h1>
                <div style={{ marginBottom: 10 }}>{item.description}</div>
                {item.type === 'scrna_seq'
                // TEMP: scrnaseq only has a demo button,
                // and it goes to the select page
                  ? (
                    <Tooltip
                      Component={<div style={{ maxWidth: 240 }}>{item.demoData.message}</div>}
                      >
                      <Button onClick={() => setAnalysis(item)}>Demo</Button>
                    </Tooltip>
                  )
                  : (
                    <Row spacing={5}>
                      <Button onClick={() => setAnalysis(item)}>Select</Button>
                      <DemoButton demoData={item.demoData} type={item.type} />
                    </Row>
                  )}
              </div>
            </Row>
          );
        })}
      </Row>
    );
};

export default enhance(CreateAnalysis);
