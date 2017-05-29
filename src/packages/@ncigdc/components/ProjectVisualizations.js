// @flow

import React from 'react';
import { compose, withState, lifecycle, withPropsOnChange } from 'recompose';
import LocationSubscriber from '@ncigdc/components/LocationSubscriber';

import { parseFilterParam } from '@ncigdc/utils/uri';
import { fetchApi } from '@ncigdc/utils/ajax';
import { getDefaultCurve } from '@ncigdc/utils/survivalplot';
import { makeFilter, replaceFilters } from '@ncigdc/utils/filters';

import { Row, Column } from '@ncigdc/uikit/Flex';

import FrequentMutationsChart from '@ncigdc/containers/FrequentMutationsChart';
import SsmsTable from '@ncigdc/modern_components/SsmsTable/SsmsTable';
import MostAffectedCasesChart from '@ncigdc/containers/MostAffectedCasesChart';
import MostAffectedCasesTable from '@ncigdc/containers/MostAffectedCasesTable';
import FrequentlyMutatedGenesChart from '@ncigdc/containers/FrequentlyMutatedGenesChart';
import GenesTable from '@ncigdc/modern_components/GenesTable/GenesTable';
import OncoGridWrapper from '@ncigdc/components/Oncogrid/OncogridWrapper';
import SurvivalPlotWrapper from '@ncigdc/components/SurvivalPlotWrapper';
import SpinnerCentered from '@ncigdc/components/SpinnerCentered';
import type { TRawQuery } from '@ncigdc/utils/uri/types';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';

const styles = {
  heading: {
    flexGrow: 1,
    fontSize: '2rem',
    marginBottom: 7,
    marginTop: 7,
  },
  card: {
    backgroundColor: 'white',
  },
};

const initialState = {
  loadingSurvival: true,
  loadingAggregation: true,
  numCasesAggByProject: {},
  mutatedGenesProject: {},
  defaultSurvivalData: {},
};

const enhance = compose(
  withState('selectedMutatedGenesSurvivalData', 'setSelectedMutatedGenesSurvivalData', {}),
  withState('selectedFrequentMutationsSurvivalData', 'setSelectedFrequentMutationsSurvivalData', {}),
  withState('state', 'setState', initialState),
  withState('numCasesAggByProject', 'setNumCasesAggByProject', undefined),
  withPropsOnChange(
    ['projectId'],
    async ({ projectId, setState }) => {
      if (!projectId) return;

      const defaultSurvivalData = await getDefaultCurve({
        currentFilters: { op: '=', content: { field: 'cases.project.project_id', value: projectId } },
        slug: projectId,
      });

      setState(s => ({
        ...s,
        loadingSurvival: false,
        defaultSurvivalData,
      }));
    }
  ),
  lifecycle({
    componentWillReceiveProps(nextProps): void {
      if (nextProps.projectId !== this.props.projectId) {
        nextProps.setSelectedMutatedGenesSurvivalData({});
        nextProps.setSelectedFrequentMutationsSurvivalData({});
      }
    },
    async componentDidMount(): Promise<*> {
      const mutatedCasesCountByProject = await fetchApi(
        'analysis/mutated_cases_count_by_project?size=0',
        { headers: { 'Content-Type': 'application/json' } }
      );

      const numCasesAggByProject = mutatedCasesCountByProject.aggregations.projects.buckets.reduce((acc, b) => ({
        ...acc,
        [b.key]: b.case_summary.case_with_ssm.doc_count,
      }), {});
      this.props.setNumCasesAggByProject(numCasesAggByProject);

      this.props.setState(s => ({
        ...s,
        loadingAggregation: false,
      }));
    },
  })
);

const ProjectVisualizations = enhance(({
  state: {
    defaultSurvivalData,
    numCasesAggByProject,
    loadingSurvival,
    loadingAggregation,
  },
  selectedMutatedGenesSurvivalData,
  setSelectedMutatedGenesSurvivalData,
  selectedFrequentMutationsSurvivalData,
  setSelectedFrequentMutationsSurvivalData,
  projectId,
  viewer,
}) => {
  const mutatedGenesSurvivalData = {
    legend: selectedMutatedGenesSurvivalData.legend || defaultSurvivalData.legend,
    rawData: selectedMutatedGenesSurvivalData.rawData || defaultSurvivalData.rawData,
  };

  const frequentMutationsSurvivalData = {
    legend: selectedFrequentMutationsSurvivalData.legend || defaultSurvivalData.legend,
    rawData: selectedFrequentMutationsSurvivalData.rawData || defaultSurvivalData.rawData,
  };

  const fmFilters = makeFilter([{ field: 'cases.project.project_id', value: projectId }], false);
  const macFilters = makeFilter([{ field: 'cases.project.project_id', value: projectId }], false);

  return (
    <div>
      <Column style={styles.card}>
        <h1 style={{ ...styles.heading, padding: '1rem' }} id="mutated-genes">
          <i className="fa fa-bar-chart-o" style={{ paddingRight: '10px' }} />
          Most Frequently Mutated Genes
        </h1>
        <Column>
          <Row>
            <Column flex="none" style={{ width: '50%' }}>
              <FrequentlyMutatedGenesChart
                defaultFilters={fmFilters}
                projectId={projectId}
                explore={viewer.explore}
                numCasesAggByProject={numCasesAggByProject}
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
            defaultFilters={fmFilters}
            defaultSize={10}
            context={projectId}
            tableLink={
              <ExploreLink query={{ searchTableTab: 'genes', filters: fmFilters }}>
                Open in Exploration
              </ExploreLink>
            }
          />
        </Column>
      </Column>

      <Column style={{ ...styles.card, marginTop: '2rem', position: 'static' }}>
        <h1 style={{ ...styles.heading, padding: '1rem' }} id="oncogrid">
          <i className="fa fa-th" style={{ paddingRight: '10px' }} />
          OncoGrid
        </h1>
        <LocationSubscriber>{(ctx: {| pathname: string, query: TRawQuery |}) => {
          const { filters } = ctx.query || {};
          const currentFilters = parseFilterParam(filters, null);
          const componentFilters = replaceFilters(
            makeFilter([
              { field: 'cases.project.project_id', value: projectId },
            ], false),
            currentFilters
          );
          return (
            <OncoGridWrapper
              projectId={projectId}
              currentFilters={componentFilters}
            />
          );
        }}</LocationSubscriber>
      </Column>

      <Column style={{ ...styles.card, marginTop: '2rem' }}>
        <h1 style={{ ...styles.heading, padding: '1rem' }} id="frequent-mutations">
          <i className="fa fa-bar-chart-o" style={{ paddingRight: '10px' }} />
          Most Frequent Mutations
        </h1>
        <Column>
          <Row>
            <Column flex="1">
              {
                loadingAggregation ? <SpinnerCentered /> : (
                  <FrequentMutationsChart
                    projectId={projectId}
                    defaultFilters={fmFilters}
                    explore={viewer.explore}
                    context={projectId}
                    showSurvivalPlot
                  />
                )
              }
            </Column>
            <Column flex="1">
              <SurvivalPlotWrapper
                {...frequentMutationsSurvivalData}
                onReset={() => setSelectedFrequentMutationsSurvivalData({})}
                height={240}
                survivalPlotloading={loadingSurvival}
              />
            </Column>
          </Row>
          {
            loadingAggregation ? <SpinnerCentered /> : (
              <SsmsTable
                defaultFilters={fmFilters}
                selectedSurvivalData={selectedFrequentMutationsSurvivalData}
                setSelectedSurvivalData={setSelectedFrequentMutationsSurvivalData}
                showSurvivalPlot
                context={projectId}
                tableLink={
                  <ExploreLink query={{ searchTableTab: 'mutations', filters: fmFilters }}>
                    Open in Exploration
                  </ExploreLink>
                }
              />
            )
          }
        </Column>
      </Column>
      <Column style={{ ...styles.card, marginTop: '2rem' }}>
        <h1 style={{ ...styles.heading, padding: '1rem' }} id="most-affected-cases">
          <i className="fa fa-bar-chart-o" style={{ paddingRight: '10px' }} />
          Most Affected Cases
        </h1>
        <MostAffectedCasesChart
          explore={viewer.explore}
          defaultFilters={macFilters}
          style={{ width: '50%', flexGrow: 0 }}
        />
        <MostAffectedCasesTable
          explore={viewer.explore}
          defaultFilters={macFilters}
        />
      </Column>
    </div>
  );
});

export default ProjectVisualizations;
