/* @flow */

import React from 'react';
import { compose, withState, lifecycle, withProps } from 'recompose';
import { get } from 'lodash';
import { getDefaultCurve } from '@ncigdc/utils/survivalplot';
import FullWidthLayout from '@ncigdc/components/Layouts/FullWidthLayout';
import ProjectSummary from '@ncigdc/modern_components/ProjectSummary';
import {
  ProjectCountsDataCategory,
  ProjectCountsExpStrategy,
} from '@ncigdc/modern_components/ProjectCounts';
import { fetchApi } from '@ncigdc/utils/ajax';
import { makeFilter } from '@ncigdc/utils/filters';
import DownloadManifestButton from '@ncigdc/modern_components/DownloadManifestButton';
import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';
import { withExists } from '@ncigdc/modern_components/Exists/index';
import Button from '@ncigdc/uikit/Button';
import withRouter from '@ncigdc/utils/withRouter';
import { stringifyJSONParam } from '@ncigdc/utils/uri';
import ProjectPrimarySitesTable from '@ncigdc/modern_components/ProjectPrimarySitesTable/index';
import { Row } from '@ncigdc/uikit/Flex';
import DownloadClinicalDropdown from '@ncigdc/modern_components/DownloadClinicalDropdown/';
import moment from 'moment';
import DownloadBiospecimenDropdown from '@ncigdc/modern_components/DownloadBiospecimenDropdown/';

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
  withProps(({ match }) => ({ type: 'Project', id: get(match, 'params.id') })),
  withExists,
  withRouter,
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
  withPropsOnChange(['id'], async ({ id, setState }) => {
    if (!id) return;

    const defaultSurvivalData = await getDefaultCurve({
      currentFilters: {
        op: '=',
        content: { field: 'cases.project.project_id', value: id },
      },
      slug: id,
    });

    setState(s => ({
      ...s,
      loadingSurvival: false,
      defaultSurvivalData,
    }));
  }),
  lifecycle({
    componentWillReceiveProps(nextProps): void {
      if (nextProps.id !== this.props.id) {
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
    id: projectId,
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
    push,
  }) => {
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
            <Button
              onClick={projectId => {
                push({
                  pathname: '/exploration',
                  query: {
                    filters: stringifyJSONParam(projectFilter),
                  },
                });
              }}
            >
              Explore Project Data
            </Button>
          </span>
          <span>
            <DownloadBiospecimenDropdown
              dropdownStyles={{
                width: '126px',
                left: '2px',
                marginTop: '2px',
              }}
              jsonFilename={`biospecimen.project-${projectId}_${moment().format(
                'YYYY-MM-DD',
              )}.json`}
              tsvFilename={`biospecimen.project-${projectId}_${moment().format(
                'YYYY-MM-DD',
              )}.tar.gz`}
              filters={projectFilter}
              inactiveText={'Biospecimen'}
            />
          </span>
          <span>
            <DownloadClinicalDropdown
              dropdownStyles={{
                width: '90px',
                left: '2px',
                marginTop: '2px',
              }}
              filters={projectFilter}
              tsvFilename={`clinical.project-${projectId}_${moment().format(
                'YYYY-MM-DD',
              )}.tar.gz`}
              jsonFilename={`clinical.project-${projectId}_${moment().format(
                'YYYY-MM-DD',
              )}.json`}
              inactiveText={'Clinical'}
            />
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
        <Row>
          <span style={{ ...styles.column, marginBottom: '2rem', flex: 1 }}>
            <ProjectPrimarySitesTable projectId={projectId} />
          </span>
        </Row>
      </FullWidthLayout>
    );
  },
);
