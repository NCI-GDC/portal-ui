/* @flow */

import React from 'react';
import Route from 'react-router/Route';
import FullWidthLayout from '@ncigdc/components/Layouts/FullWidthLayout';
import ProjectSummary from '@ncigdc/modern_components/ProjectSummary';
import {
  ProjectCountsDataCategory,
  ProjectCountsExpStrategy,
} from '@ncigdc/modern_components/ProjectCounts';

import {
  EXPERIMENTAL_STRATEGIES,
  DATA_CATEGORIES,
} from '@ncigdc/utils/constants';

export default (
  <Route
    path="/projects/:id"
    component={({ match, projectId = match.params.id, filters }) => {
      return (
        <FullWidthLayout title={projectId} entityType="PR">
          <ProjectSummary projectId={projectId} />
          <ProjectCountsDataCategory projectId={projectId} />
          <ProjectCountsExpStrategy projectId={projectId} />

          {/* <div>
        <Column style={styles.card}>
          <Row style={{ padding: '1rem 1rem 2rem' }}>
            <h1 style={{ ...styles.heading }} id="mutated-genes">
              <i
                className="fa fa-bar-chart-o"
                style={{ paddingRight: '10px' }}
              />
              Most Frequently Mutated Genes
            </h1>
            <Row style={{ alignItems: 'center' }}>
              <ExploreLink
                query={{ searchTableTab: 'oncogrid', filters: fmFilters }}
                style={{ marginRight: '1.5rem' }}
              >
                <GridIcon /> OncoGrid
              </ExploreLink>
              <ExploreLink
                query={{ searchTableTab: 'genes', filters: fmFilters }}
              >
                <GdcDataIcon /> Open in Exploration
              </ExploreLink>
            </Row>
          </Row>
          <Column>
            <Row>
              <Column flex="none" style={{ width: '50%' }}>
                <GenesBarChart
                  defaultFilters={fmFilters}
                  projectId={projectId}
                  context="project"
                />
              </Column>
              <Column flex="none" style={{ width: '50%' }}>
                <SurvivalPlotWrapper
                  {...mutatedGenesSurvivalData}
                  onReset={() => setSelectedMutatedGenesSurvivalData({})}
                  height={240}
                  survivalPlotloading={loadingSurvival}
                />
              </Column>
            </Row>
            <GenesTable
              survivalData={mutatedGenesSurvivalData}
              setSelectedSurvivalData={setSelectedMutatedGenesSurvivalData}
              selectedSurvivalData={selectedMutatedGenesSurvivalData}
              hasEnoughSurvivalDataOnPrimaryCurve={enoughData(
                defaultSurvivalData.rawData,
              )}
              defaultFilters={fmFilters}
              defaultSize={10}
              context={projectId}
            />
          </Column>
        </Column>
        <Column style={{ ...styles.card, marginTop: '2rem' }}>
          <Row style={{ padding: '1rem 1rem 2rem', alignItems: 'center' }}>
            <h1 style={{ ...styles.heading }} id="frequent-mutations">
              <i
                className="fa fa-bar-chart-o"
                style={{ paddingRight: '10px' }}
              />
              Most Frequent Somatic Mutations
            </h1>
            <ExploreLink
              query={{
                searchTableTab: 'mutations',
                filters: fmFilters,
              }}
            >
              <GdcDataIcon /> Open in Exploration
            </ExploreLink>
          </Row>
          <Column>
            <Row>
              <Column flex="1">
                <SurvivalPlotWrapper
                  {...frequentMutationsSurvivalData}
                  onReset={() => setSelectedFrequentMutationsSurvivalData({})}
                  height={240}
                  survivalPlotloading={loadingSurvival}
                />
              </Column>
              <Column flex="1" />
            </Row>
            {loadingAggregation
              ? <SpinnerCentered />
              : <SsmsTable
                  defaultFilters={fmFilters}
                  selectedSurvivalData={selectedFrequentMutationsSurvivalData}
                  setSelectedSurvivalData={
                    setSelectedFrequentMutationsSurvivalData
                  }
                  hasEnoughSurvivalDataOnPrimaryCurve={enoughData(
                    defaultSurvivalData.rawData,
                  )}
                  showSurvivalPlot
                  context={projectId}
                />}
          </Column>
        </Column>
        <Column style={{ ...styles.card, marginTop: '2rem' }}>
          <Row style={{ padding: '1rem 1rem 2rem', alignItems: 'center' }}>
            <h1 style={{ ...styles.heading }}>
              <i
                className="fa fa-bar-chart-o"
                style={{ paddingRight: '10px' }}
              />
              Most Affected Cases
            </h1>
            <ExploreLink
              query={{ searchTableTab: 'cases', filters: macFilters }}
            >
              <GdcDataIcon /> Open in Exploration
            </ExploreLink>
          </Row>
          <AffectedCasesBarChart
            defaultFilters={macFilters}
            style={{ width: '50%', flexGrow: 0 }}
          />
          <AffectedCasesTable defaultFilters={macFilters} />
        </Column>
      </div> */}
        </FullWidthLayout>
      );
    }}
  />
);
