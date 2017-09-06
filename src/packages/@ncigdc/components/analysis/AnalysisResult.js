import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { omit } from 'lodash';

import withRouter from '@ncigdc/utils/withRouter';
import UnstyledButton from '@ncigdc/uikit/UnstyledButton';
import { removeAnalysis, removeAllAnalysis } from '@ncigdc/dux/analysis';
import { Row } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { TrashIcon } from '@ncigdc/theme/icons';
import TabbedLinks from '@ncigdc/components/TabbedLinks';

import availableAnalysis from './availableAnalysis';

const enhance = compose(
  connect(state => ({ analysis: state.analysis.saved })),
  withRouter,
);

const AnalysisResult = ({ analysis, query, dispatch, push }) => {
  const analysisId = query.analysisId || '';
  const currentIndex = analysis.findIndex(a => a.id === analysisId);
  const demoType =
    currentIndex === -1 && (analysisId.match(/^demo-(.*)/) || [])[1];
  const demoAnalysis = availableAnalysis.find(a => a.type === demoType);

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
          }}
        >
          <TrashIcon /> Delete All
        </Button>
      }
      linkStyle={{
        width: '100%',
      }}
      links={[
        ...(demoAnalysis
          ? [
              {
                onClose: e => {
                  e.preventDefault();
                  push({
                    query: omit(query, 'analysisId'),
                  });
                },
                ...demoAnalysis.demoData,
              },
            ]
          : []),
        ...analysis.map(savedAnalysis => ({
          onClose: e => {
            e.preventDefault();
            dispatch(removeAnalysis(savedAnalysis));
          },
          ...savedAnalysis,
        })),
      ]
        .map(savedAnalysis => {
          const analysis = availableAnalysis.find(
            a => a.type === savedAnalysis.type,
          );

          return (
            analysis && {
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
                    onClick={savedAnalysis.onClose}
                  >
                    x
                  </UnstyledButton>
                </Row>
              ),
              component: <analysis.ResultComponent {...savedAnalysis} />,
            }
          );
        })
        .filter(Boolean)}
    />
  );
};

export default enhance(AnalysisResult);
