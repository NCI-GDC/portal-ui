// @flow

import React from 'react';
import { compose, withState, lifecycle, withPropsOnChange } from 'recompose';
import { fetchApi } from '@ncigdc/utils/ajax';
import { getDefaultCurve, enoughData } from '@ncigdc/utils/survivalplot';
import { makeFilter } from '@ncigdc/utils/filters';
import { Row, Column } from '@ncigdc/uikit/Flex';
import SsmsTable from '@ncigdc/modern_components/SsmsTable';
import AffectedCasesBarChart from '@ncigdc/modern_components/AffectedCasesBarChart/AffectedCasesBarChart';
import AffectedCasesTable from '@ncigdc/modern_components/AffectedCasesTable/AffectedCasesTable';
import GenesBarChart from '@ncigdc/modern_components/GenesBarChart/GenesBarChart';
import GenesTable from '@ncigdc/modern_components/GenesTable/GenesTable';
import SurvivalPlotWrapper from '@ncigdc/components/SurvivalPlotWrapper';
import SpinnerCentered from '@ncigdc/components/SpinnerCentered';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import { GdcDataIcon, GridIcon } from '@ncigdc/theme/icons';

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
  withState(
    'selectedMutatedGenesSurvivalData',
    'setSelectedMutatedGenesSurvivalData',
    {},
  ),
  withState(
    'selectedFrequentMutationsSurvivalData',
    'setSelectedFrequentMutationsSurvivalData',
    {},
  ),
  withState('state', 'setState', initialState),
  withState('numCasesAggByProject', 'setNumCasesAggByProject', undefined),
  withPropsOnChange(['projectId'], async ({ projectId, setState }) => {
    if (!projectId) return;

    const defaultSurvivalData = await getDefaultCurve({
      currentFilters: {
        op: '=',
        content: { field: 'cases.project.project_id', value: projectId },
      },
      slug: projectId,
    });

    setState(s => ({
      ...s,
      loadingSurvival: false,
      defaultSurvivalData,
    }));
  }),
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
        { headers: { 'Content-Type': 'application/json' } },
      );

      const numCasesAggByProject = mutatedCasesCountByProject.aggregations.projects.buckets.reduce(
        (acc, b) => ({
          ...acc,
          [b.key]: b.case_summary.case_with_ssm.doc_count,
        }),
        {},
      );
      this.props.setNumCasesAggByProject(numCasesAggByProject);

      this.props.setState(s => ({
        ...s,
        loadingAggregation: false,
      }));
    },
  }),
);

const ProjectVisualizations = enhance(
  ({
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
      legend:
        selectedMutatedGenesSurvivalData.legend || defaultSurvivalData.legend,
      rawData:
        selectedMutatedGenesSurvivalData.rawData || defaultSurvivalData.rawData,
    };

    const frequentMutationsSurvivalData = {
      legend:
        selectedFrequentMutationsSurvivalData.legend ||
          defaultSurvivalData.legend,
      rawData:
        selectedFrequentMutationsSurvivalData.rawData ||
          defaultSurvivalData.rawData,
    };

    const fmFilters = makeFilter([
      { field: 'cases.project.project_id', value: projectId },
    ]);
    const macFilters = makeFilter([
      { field: 'cases.project.project_id', value: projectId },
    ]);

    return (
      <div className="test-project-viz">
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
      </div>
    );
  },
);

export default ProjectVisualizations;
