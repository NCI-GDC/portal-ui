/* @flow */

import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import TabbedLinks from '@ncigdc/components/TabbedLinks';
import CreateAnalysis from '@ncigdc/components/analysis/CreateAnalysis';
import AnalysisResult from '@ncigdc/components/analysis/AnalysisResult';
import withRouter from '@ncigdc/utils/withRouter';

const enhance = compose(
  connect(state => ({ hasAnalysis: !!state.analysis.saved.length })),
  withRouter,
);

const AnalysisRoute = ({ hasAnalysis, query }) => {
  const isDemo = ((query.analysisId || '').match(/^demo-(.*)/) || [])[1];

  return (
    <Route
      path="/analysis"
      component={() => {
        return (
          <TabbedLinks
            style={{ padding: '2rem 2.5rem' }}
            queryParam="analysisTableTab"
            links={[
              {
                id: 'launch',
                text: 'Launch Analysis',
                component: <CreateAnalysis />,
              },
              ...(hasAnalysis || isDemo
                ? [
                    {
                      id: 'result',
                      text: 'Result',
                      component: <AnalysisResult />,
                    },
                  ]
                : []),
            ]}
          />
        );
      }}
    />
  );
};

export default enhance(AnalysisRoute);
