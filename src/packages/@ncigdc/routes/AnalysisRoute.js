import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  compose,
  lifecycle,
  pure,
  setDisplayName,
} from 'recompose';

import TabbedLinks from '@ncigdc/components/TabbedLinks';
import CreateAnalysis from '@ncigdc/components/analysis/CreateAnalysis';
import AnalysisResult from '@ncigdc/components/analysis/AnalysisResult';

const AnalysisRoute = ({ hasAnalysis }) => (
  <TabbedLinks
    links={[
      {
        component: <CreateAnalysis />,
        id: 'launch',
        text: 'Launch Analysis',
      },
    ].concat(hasAnalysis
    ? {
      component: <AnalysisResult />,
      id: 'result',
      text: 'Results',
    }
    : [])}
    queryParam="analysisTableTab"
    style={{ padding: '2rem 2.5rem' }}
    />
);

const EnhancedAnalysisRoute = compose(
  setDisplayName('EnhancedAnalysisRoute'),
  connect(state => ({ hasAnalysis: state.analysis.saved.length > 0 })),
  pure,
  lifecycle({
    shouldComponentUpdate({ hasAnalysis: nextHasAnalysis }) {
      const { hasAnalysis } = this.props;

      return nextHasAnalysis !== hasAnalysis;
    },
  }),
)(AnalysisRoute);

export default (
  <Route
    component={EnhancedAnalysisRoute}
    path="/analysis"
    />
);
