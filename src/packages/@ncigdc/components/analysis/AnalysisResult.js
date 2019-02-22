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
  withRouter
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
                dispatch(closeNotification());
              }}
            >
              Undo
            </UnstyledButton>
          </strong>
        </Column>
      ),
    })
  );
}

// analysis here is all analyses in localStorage
const AnalysisResult = ({ analysis, query, dispatch, push }) => {
  const analysisId = query.analysisId || '';
  const currentIndex = Math.max(
    analysis.findIndex(a => a.id === analysisId),
    0
  );
  const analysisType = analysis[currentIndex].type;
  const tabMinWidth =
    analysisType === 'clinical_data' ? { minWidth: 1200 } : {};
  return (
    <TabbedLinks
      side
      style={{ padding: '1rem 0.7rem', ...tabMinWidth }}
      queryParam="analysisId"
      defaultIndex={currentIndex}
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
        padding: '1rem 0.8rem',
      }}
      links={analysis
        .map(savedAnalysis => {
          const analysis = availableAnalysis.find(
            a => a.type === savedAnalysis.type
          );

          const tabTitle =
            analysis.type === 'clinical_data'
              ? savedAnalysis.name
              : new Date(savedAnalysis.created).toLocaleDateString();

          return {
            id: savedAnalysis.id,
            text: (
              <Row>
                <div style={{ marginRight: 15 }}>
                  <Row spacing={'8px'} style={{ alignItems: 'center' }}>
                    <analysis.Icon style={{ width: 25, height: 25 }} />
                    <Column>
                      <div style={{ fontSize: '1.4rem' }}>
                        {_.truncate(tabTitle, { length: 16 })}
                      </div>
                      <div style={{ fontSize: '1.2rem' }}>{analysis.label}</div>
                    </Column>
                  </Row>
                </div>
                <UnstyledButton
                  style={{ marginLeft: 'auto', backgroundColor: 'transparent' }}
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
            component: (
              <analysis.ResultComponent {...savedAnalysis} {...analysis} />
            ),
          };
        })
        .filter(Boolean)}
    />
  );
};

export default enhance(AnalysisResult);
