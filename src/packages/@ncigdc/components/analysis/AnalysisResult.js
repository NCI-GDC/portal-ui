import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { omit } from 'lodash';

import withRouter from '@ncigdc/utils/withRouter';
import UnstyledButton from '@ncigdc/uikit/UnstyledButton';
import {
  addAnalysis,
  removeAnalysis,
  removeAllAnalysis,
} from '@ncigdc/dux/analysis';
import { notify, closeNotification } from '@ncigdc/dux/notification';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { TrashIcon } from '@ncigdc/theme/icons';
import TabbedLinks from '@ncigdc/components/TabbedLinks';

import availableAnalysis from './availableAnalysis';

const enhance = compose(
  connect(state => ({ analysis: state.analysis.saved })),
  withRouter,
);

function undoNotification(dispatch, analysis) {
  dispatch(
    notify({
      id: `${new Date().getTime()}`,
      component: (
        <Column>
          Deleted
          {analysis.length === 1 ? (
            <span>
              {' '}
              Analysis{' '}
              <strong>
                {availableAnalysis.find(a => analysis[0].type === a.type).label}
              </strong>
            </span>
          ) : (
            <span>
              <strong>{analysis.length}</strong> Analyses
            </span>
          )}
          <strong>
            <i
              className="fa fa-undo"
              style={{
                marginRight: '0.3rem',
              }}
            />
            <UnstyledButton
              style={{ textDecoration: 'underline' }}
              onClick={() => {
                analysis.map(set => dispatch(addAnalysis(set)));
                dispatch(closeNotification(true));
              }}
            >
              Undo
            </UnstyledButton>
          </strong>
        </Column>
      ),
    }),
  );
}

const AnalysisResult = ({ analysis, query, dispatch, push }) => {
  const analysisId = query.analysisId || '';
  const currentIndex = analysis.findIndex(a => a.id === analysisId);

  return (
    <TabbedLinks
      side
      style={{ padding: '2rem 2.5rem' }}
      queryParam="analysisId"
      defaultIndex={Math.max(currentIndex, 0)}
      tabToolbar={
        <Button
          style={{ margin: '5px 5px 0 0' }}
          onClick={() => {
            dispatch(removeAllAnalysis());
            push({
              query: omit(query, 'analysisId'),
            });
            undoNotification(dispatch, analysis);
          }}
        >
          <TrashIcon /> Delete All
        </Button>
      }
      linkStyle={{
        width: '100%',
      }}
      links={analysis
        .map(savedAnalysis => {
          const analysis = availableAnalysis.find(
            a => a.type === savedAnalysis.type,
          );
          return {
            id: savedAnalysis.id,
            text: (
              <Row>
                <div style={{ marginRight: 15 }}>
                  {analysis.label}
                  <div style={{ fontSize: '1rem' }}>
                    {new Date(savedAnalysis.created).toLocaleDateString()}
                  </div>
                </div>
                <UnstyledButton
                  style={{ marginLeft: 'auto' }}
                  onClick={e => {
                    e.preventDefault();
                    dispatch(removeAnalysis(savedAnalysis));
                    undoNotification(dispatch, [savedAnalysis]);
                  }}
                >
                  x
                </UnstyledButton>
              </Row>
            ),
            component: <analysis.ResultComponent {...savedAnalysis} />,
          };
        })
        .filter(Boolean)}
    />
  );
};

export default enhance(AnalysisResult);
