import React from 'react';
import {
  compose,
  lifecycle,
  pure,
  setDisplayName,
} from 'recompose';
import { connect } from 'react-redux';
import {
  isEqual,
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

function undoNotification(dispatch, analysis) {
  dispatch(
    notify({
      component: (
        <Column>
          Deleted
          {analysis.length === 1
            ? (
              <span>
                {'Analysis '}
                <strong>
                  {availableAnalysis.find(a => analysis[0].type === a.type).label}
                </strong>
              </span>
            )
            : (
              <span>
                <strong>{analysis.length}</strong>
                {' Analyses'}
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
      id: `${new Date().getTime()}`,
    })
  );
}

// analysis here is all analyses in localStorage
const AnalysisResult = ({
  analyses,
  dispatch,
  push,
  query,
}) => {
  const analysisId = query.analysisId || '';
  const currentIndex = Math.max(
    analyses.findIndex(a => a.id === analysisId),
    0
  );
  const analysisType = analyses[currentIndex].type;
  const tabMinWidth =
    analysisType === 'clinical_data' ? { minWidth: 1200 } : {};
  return (
    <TabbedLinks
      defaultIndex={currentIndex}
      links={analyses
        .map(savedAnalysis => {
          const foundAnalysis = availableAnalysis.find(
            a => a.type === savedAnalysis.type
          );

          const tabTitle =
            foundAnalysis.type === 'clinical_data'
              ? savedAnalysis.name
              : new Date(savedAnalysis.created).toLocaleDateString();

          return {
            component: <foundAnalysis.ResultComponent {...savedAnalysis} {...foundAnalysis} />,
            id: savedAnalysis.id,
            text: (
              <Row>
                <div style={{ marginRight: 15 }}>
                  <Row spacing="8px" style={{ alignItems: 'center' }}>
                    <foundAnalysis.Icon
                      style={{
                        height: 25,
                        width: 25,
                      }}
                      title={`${savedAnalysis.id}-icon`}
                      />

                    <Column>
                      <Tooltip Component={tabTitle.length > 16 ? tabTitle : null}>
                        <span style={{ fontSize: '1.4rem' }}>
                          {truncate(tabTitle, { length: 16 })}
                        </span>
                      </Tooltip>

                      <div style={{ fontSize: '1.2rem' }}>
                        {foundAnalysis.label}
                      </div>
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
          };
        })
        .filter(Boolean)}
      linkStyle={{
        padding: '1rem 0.8rem',
        width: '100%',
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
            undoNotification(dispatch, analyses);
          }}
          style={{ margin: '5px 5px 0 0' }}
          >
          <TrashIcon style={{ marginRight: '0.3rem' }} />
          Delete All
        </Button>
      )}
      />
  );
};

export default compose(
  setDisplayName('EnhancedAnalysisResult'),
  connect(state => ({ analyses: state.analysis.saved })),
  lifecycle({
    shouldComponentUpdate({
      analyses: nextAnalyses,
    }) {
      const {
        analyses,
      } = this.props;

      return !isEqual(nextAnalyses, analyses);
    },
  }),
  withRouter
)(pure(AnalysisResult));
