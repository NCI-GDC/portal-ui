import React from 'react';
import {
  compose,
  setDisplayName,
} from 'recompose';
import { connect } from 'react-redux';
import {
  omit,
  truncate,
} from 'lodash';

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
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { TrashIcon } from '@ncigdc/theme/icons';
import TabbedLinks from '@ncigdc/components/TabbedLinks';

import availableAnalysis from './availableAnalysis';

const enhance = compose(
  setDisplayName('EnhancedAnalysisResult'),
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
              Analysis
              {' '}
              <strong>
                {availableAnalysis.find(a => analysis[0].type === a.type).label}
              </strong>
            </span>
          ) : (
            <span>
              <strong>{analysis.length}</strong>
              {' '}
Analyses
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
              onClick={() => {
                analysis.map(set => dispatch(addAnalysis(set)));
                dispatch(closeNotification());
              }}
              style={{ textDecoration: 'underline' }}
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
const AnalysisResult = ({
  analysis, dispatch, push, query,
}) => {
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
      defaultIndex={currentIndex}
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
                  <Row spacing="8px" style={{ alignItems: 'center' }}>
                    <analysis.Icon style={{
                      height: 25,
                      width: 25,
                    }}
                                   />
                    <Column>
                      <Tooltip
                        Component={(
                          <span>{tabTitle}</span>
                        )}
                        >
                        <span style={{ fontSize: '1.4rem' }}>
                          {truncate(tabTitle, { length: 16 })}
                        </span>
                      </Tooltip>
                      <div style={{ fontSize: '1.2rem' }}>{analysis.label}</div>
                    </Column>
                  </Row>
                </div>
                <UnstyledButton
                  onClick={e => {
                    e.preventDefault();
                    dispatch(removeAnalysis(savedAnalysis));
                    undoNotification(dispatch, [savedAnalysis]);
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    marginLeft: 'auto',
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
      linkStyle={{
        width: '100%',
        padding: '1rem 0.8rem',
      }}
      queryParam="analysisId"
      side
      style={{
        padding: '1rem 0.7rem',
        ...tabMinWidth,
      }}
      tabToolbar={(
        <Button
          onClick={() => {
            dispatch(removeAllAnalysis());
            push({
              query: omit(query, 'analysisId'),
            });
            undoNotification(dispatch, analysis);
          }}
          style={{ margin: '5px 5px 0 0' }}
          >
          <TrashIcon />
          {' '}
Delete All
        </Button>
      )}
      />
  );
};

export default enhance(AnalysisResult);
