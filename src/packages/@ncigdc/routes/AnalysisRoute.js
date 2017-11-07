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

const AnalysisRoute = enhance(({ hasAnalysis, query }) => {
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
        ...(hasAnalysis
          ? [
              {
                id: 'result',
                text: 'Results',
                component: <AnalysisResult />,
              },
            ]
          : []),
      ]}
    />
  );
});

export default <Route path="/analysis" component={AnalysisRoute} />;
