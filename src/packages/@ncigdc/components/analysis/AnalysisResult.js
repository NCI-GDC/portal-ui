import React from 'react';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { omit } from 'lodash';
import Clipboard from 'react-copy-to-clipboard';
import withRouter from '@ncigdc/utils/withRouter';
import UnstyledButton from '@ncigdc/uikit/UnstyledButton';
import { removeAnalysis, removeAllAnalysis } from '@ncigdc/dux/analysis';
import { Row } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { TrashIcon } from '@ncigdc/theme/icons';
import TabbedLinks from '@ncigdc/components/TabbedLinks';

import availableAnalysis from './availableAnalysis';

const enhance = compose(
  connect(state => ({ analysis: state.analysis.saved, sets: state.sets })),
  withRouter,
);

const CopyButton = withState('copied', 'setCopied', false)(p =>
  <Clipboard
    text={p.text}
    onCopy={() => {
      p.setCopied(true);
      setTimeout(() => p.setCopied(false), 2000);
    }}
  >
    <Button
      style={{
        float: 'right',
        margin: 20,
        position: 'relative',
        zIndex: 100,
      }}
    >
      {p.copied ? 'Link Copied!' : 'Share'}
    </Button>
  </Clipboard>,
);

const AnalysisResult = ({ analysis, query, dispatch, push, sets }) => {
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

          console.log(savedAnalysis.sets, sets);

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
              component: (
                <div>
                  <CopyButton
                    text={
                      window.location.origin +
                      window.location.pathname +
                      '?share=true' +
                      `&data=${JSON.stringify({
                        type: savedAnalysis.type,
                        sets: savedAnalysis.sets,
                      })}`
                    }
                  />
                  <analysis.ResultComponent {...savedAnalysis} />
                </div>
              ),
            }
          );
        })
        .filter(Boolean)}
    />
  );
};

export default enhance(AnalysisResult);
