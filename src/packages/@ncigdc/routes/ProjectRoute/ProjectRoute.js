/* @flow */

import React from 'react';
import { compose, withState, lifecycle, withPropsOnChange } from 'recompose';
import { getDefaultCurve, enoughData } from '@ncigdc/utils/survivalplot';
import FullWidthLayout from '@ncigdc/components/Layouts/FullWidthLayout';
import ProjectSummary from '@ncigdc/modern_components/ProjectSummary';
import {
  ProjectCountsDataCategory,
  ProjectCountsExpStrategy,
} from '@ncigdc/modern_components/ProjectCounts';
import { fetchApi } from '@ncigdc/utils/ajax';
import SpinnerCentered from '@ncigdc/components/SpinnerCentered';
import { makeFilter } from '@ncigdc/utils/filters';
import { Row, Column } from '@ncigdc/uikit/Flex';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import { GdcDataIcon, GridIcon } from '@ncigdc/theme/icons';
import SsmsTable from '@ncigdc/modern_components/SsmsTable';
import AffectedCasesBarChart from '@ncigdc/modern_components/AffectedCasesBarChart';
import AffectedCasesTable from '@ncigdc/modern_components/AffectedCasesTable';
import DownloadBiospecimenButton from '@ncigdc/modern_components/DownloadBiospecimenButton';
import DownloadClinicalButton from '@ncigdc/modern_components/DownloadClinicalButton';
import DownloadManifestButton from '@ncigdc/modern_components/DownloadManifestButton';
import GenesBarChart from '@ncigdc/modern_components/GenesBarChart';
import GenesTable from '@ncigdc/modern_components/GenesTable';
import SurvivalPlotWrapper from '@ncigdc/components/SurvivalPlotWrapper';

const styles = {
  column: {
    flexGrow: 1,
  },
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
  withPropsOnChange(
    ['match'],
    async ({ match, projectId = match.params.id, setState }) => {
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
    },
  ),
  lifecycle({
    componentWillReceiveProps(nextProps): void {
      if (nextProps.match.params.id !== this.props.match.params.id) {
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

export default enhance(
  ({
    match,
    projectId = match.params.id,
    filters,
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
    const projectFilter = makeFilter([
      { field: 'cases.project.project_id', value: projectId },
    ]);
    return (
      <FullWidthLayout title={projectId} entityType="PR">
        <Row
          style={{ marginBottom: '2rem', marginLeft: 'auto' }}
          spacing="0.2rem"
        >
          <span>
            <DownloadBiospecimenButton projectId={projectId} />
          </span>
          <span>
            <DownloadClinicalButton projectId={projectId} />
          </span>
          <span>
            <DownloadManifestButton projectId={projectId} />
          </span>
        </Row>
        <ProjectSummary projectId={projectId} />
        <Row style={{ flexWrap: 'wrap' }} spacing={'2rem'}>
          <span style={{ ...styles.column, marginBottom: '2rem', flex: 1 }}>
            <ProjectCountsDataCategory projectId={projectId} />
          </span>
          <span style={{ ...styles.column, marginBottom: '2rem', flex: 1 }}>
            <ProjectCountsExpStrategy projectId={projectId} />
          </span>
        </Row>

        <div>
          <Column style={styles.card}>
            <Row style={{ padding: '1rem 1rem 2rem' }}>
              <h1 style={styles.heading} id="mutated-genes">
                <i
                  className="fa fa-bar-chart-o"
                  style={{ paddingRight: '10px' }}
                />
                Most Frequently Mutated Genes
              </h1>
              <Row style={{ alignItems: 'center' }}>
                <ExploreLink
                  query={{
                    searchTableTab: 'oncogrid',
                    filters: projectFilter,
                  }}
                  style={{ marginRight: '1.5rem' }}
                >
                  <GridIcon /> OncoGrid
                </ExploreLink>
                <ExploreLink
                  query={{
                    searchTableTab: 'genes',
                    filters: projectFilter,
                  }}
                >
                  <GdcDataIcon /> Open in Exploration
                </ExploreLink>
              </Row>
            </Row>
            <Column>
              <Row>
                <Column flex="none" style={{ width: '50%' }}>
                  <GenesBarChart
                    defaultFilters={projectFilter}
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
                defaultFilters={projectFilter}
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
                  filters: projectFilter,
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
                    defaultFilters={projectFilter}
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
                query={{ searchTableTab: 'cases', filters: projectFilter }}
              >
                <GdcDataIcon /> Open in Exploration
              </ExploreLink>
            </Row>
            <AffectedCasesBarChart
              defaultFilters={projectFilter}
              style={{ width: '50%', flexGrow: 0 }}
            />
            <AffectedCasesTable defaultFilters={projectFilter} />
          </Column>
        </div>
      </FullWidthLayout>
    );
  },
);
