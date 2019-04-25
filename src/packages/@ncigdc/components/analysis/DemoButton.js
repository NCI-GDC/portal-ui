import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import {
  addAnalysis,
  updateClinicalAnalysisProperty,
} from '@ncigdc/dux/analysis';
import { Tooltip } from '@ncigdc/uikit/Tooltip/index';
import Button from '@ncigdc/uikit/Button';
import withRouter from '@ncigdc/utils/withRouter';

const enhance = compose(
  withRouter,
  connect(state => ({ analysis: state.analysis.saved })),
);

const DemoButton = ({
  demoData,
  type,
  push,
  dispatch,
  analysis,
  style,
  disabled = false,
}) => {
  const pushToResultTab = id => push({
    query: {
      analysisTableTab: 'result',
      analysisId: id,
    },
  });
  const onDemo = type => {
    const id = `demo-${type}`;
    const existingDemo = analysis.find(a => a.id === id);
    if (existingDemo) {
      if (type === 'clinical_data') {
        dispatch(
          updateClinicalAnalysisProperty({
            value: demoData.displayVariables,
            property: 'displayVariables',
            id,
          })
        );
      }
      pushToResultTab(id);
    } else {
      dispatch(
        addAnalysis({
          id,
          type,
          created: new Date().toISOString(),
          ...demoData,
        }),
      ).then(() => {
        pushToResultTab(id);
      });
    }
  };

  return (
    <Tooltip
      Component={
        demoData && <div style={{ maxWidth: 240 }}>{demoData.message}</div>
      }
      style={style}>
      <Button disabled={disabled} onClick={() => demoData && onDemo(type)}>
        Demo
      </Button>
    </Tooltip>
  );
};

export default enhance(DemoButton);
