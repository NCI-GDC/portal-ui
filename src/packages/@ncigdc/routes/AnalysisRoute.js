/* @flow */

import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import TabbedLinks from '@ncigdc/components/TabbedLinks';
import CreateAnalysis from '@ncigdc/components/analysis/CreateAnalysis';
import AnalysisResult from '@ncigdc/components/analysis/AnalysisResult';
import withRouter from '@ncigdc/utils/withRouter';
import availableAnalysis from '@ncigdc/components/analysis/availableAnalysis';
import FullWidthLayout from '@ncigdc/components/Layouts/FullWidthLayout';

const enhance = compose(
  connect(state => ({ hasAnalysis: !!state.analysis.saved.length })),
  withRouter,
);

const AnalysisRoute = enhance(({ hasAnalysis, query }) => {
  const isDemo = ((query.analysisId || '').match(/^demo-(.*)/) || [])[1];

  const data = query.share && JSON.parse(query.data);
  const analysis = data && availableAnalysis.find(a => a.type === data.type);

  return data
    ? <FullWidthLayout
        title="Shared Analysis"
        entityType={<i className="fa fa-flask" />}
        style={{ backgroundColor: 'white' }}
      >
        <analysis.ResultComponent sets={data.sets} />
      </FullWidthLayout>
    : <TabbedLinks
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
                  component: (
                    <span>
                      <AnalysisResult />
                    </span>
                  ),
                },
              ]
            : []),
        ]}
      />;
});

export default <Route path="/analysis" component={AnalysisRoute} />;
