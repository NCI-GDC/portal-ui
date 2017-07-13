// @flow
import React from 'react';
import { scaleOrdinal, schemeCategory20 } from 'd3';
import { compose } from 'recompose';
import withRouter from '@ncigdc/utils/withRouter';
import JSURL from 'jsurl';

import { makeFilter, mergeQuery } from '@ncigdc/utils/filters';

import { Row, Column } from '@ncigdc/uikit/Flex';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import CollapsibleList from '@ncigdc/uikit/CollapsibleList';

import EntityPageVerticalTable from '@ncigdc/components/EntityPageVerticalTable';
import CountCard from '@ncigdc/components/CountCard';
import DownloadButton from '@ncigdc/components/DownloadButton';
import SummaryCard from '@ncigdc/components/SummaryCard';
import ProjectVisualizations from '@ncigdc/components/ProjectVisualizations';
import Link from '@ncigdc/components/Links/Link';
import SparkMeterWithTooltip from '@ncigdc/components/SparkMeterWithTooltip';
import SampleSize from '@ncigdc/components/SampleSize';

import { removeEmptyKeys } from '@ncigdc/utils/uri';

import FileIcon from '@ncigdc/theme/icons/File';
import CaseIcon from '@ncigdc/theme/icons/Case';
import AnnotationIcon from '@ncigdc/theme/icons/Edit';

const colors20 = scaleOrdinal(schemeCategory20);

const SPACING = '2rem';

const styles = {
  countCard: {
    width: 'auto',
    marginBottom: SPACING,
  },
  column: {
    flexGrow: 1,
  },
  margin: {
    marginBottom: SPACING,
  },
  icon: {
    width: '4rem',
    height: '4rem',
    color: '#888',
  },
  coloredSquare: {
    display: 'inline-block',
    width: 10,
    height: 10,
    marginRight: 5,
  },
};

const enhance = compose(withRouter);

type TProps = {|
  projectId: string,
  fileCount: number,
  projectName: string,
  programName: string,
  caseCount: number,
  diseaseType: Array<string>,
  primarySite: Array<string>,
  experimentalStrategies: Array<Object>,
  dataCategories: Array<Object>,
  totalAnnotations: number,
  annotations: Array<{ annotation_id: string }>,
  clinicalCount: number,
  biospecimenCount: number,
  push: Function,
  query: Object,
  viewer: Object,
|};

const Project = (
  {
    projectId,
    fileCount,
    projectName,
    programName,
    caseCount,
    diseaseType,
    primarySite,
    experimentalStrategies,
    dataCategories,
    totalAnnotations,
    annotations,
    clinicalCount,
    biospecimenCount,
    push,
    query,
    viewer,
  }: TProps = {},
) => {
  const projectFilter = [
    {
      field: 'cases.project.project_id',
      value: projectId,
    },
  ];

  const dataExportFilters = makeFilter(projectFilter);

  return (
    <span>
      <Row>
        <Row style={{ ...styles.margin, marginLeft: 'auto' }} spacing="0.2rem">
          <DownloadButton
            disabled={!biospecimenCount}
            filename={`biospecimen.project-${projectId}`}
            endpoint="cases"
            activeText="Processing"
            inactiveText={
              biospecimenCount ? 'Download Biospecimen' : 'No Biospecimen Data'
            }
            fields={['case_id']}
            dataExportExpands={[
              'samples',
              'samples.portions',
              'samples.portions.analytes',
              'samples.portions.analytes.aliquots',
              'samples.portions.analytes.aliquots.annotations',
              'samples.portions.analytes.annotations',
              'samples.portions.submitter_id',
              'samples.portions.slides',
              'samples.portions.annotations',
              'samples.portions.center',
            ]}
            filters={dataExportFilters}
          />

          <DownloadButton
            disabled={!clinicalCount}
            filename={`clinical.project-${projectId}`}
            endpoint="cases"
            activeText="Processing"
            inactiveText={
              clinicalCount ? 'Download Clinical' : 'No Clinical Data'
            }
            fields={['case_id']}
            dataExportExpands={[
              'demographic',
              'diagnoses',
              'family_histories',
              'exposures',
            ]}
            filters={dataExportFilters}
          />

          <Tooltip
            Component={
              <div style={{ maxWidth: 250 }}>
                Download a manifest for use with the GDC Data Transfer Tool.
                The GDC Data Transfer Tool is recommended for transferring large
                volumes of data.
              </div>
            }
          >
            <DownloadButton
              disabled={!fileCount}
              endpoint="files"
              activeText="Downloading"
              inactiveText="Download Manifest"
              returnType="manifest"
              filters={makeFilter(projectFilter)}
            />
          </Tooltip>
        </Row>
      </Row>

      <Row style={{ flexWrap: 'wrap' }} spacing={SPACING}>
        <span style={{ ...styles.column, ...styles.margin }}>
          <EntityPageVerticalTable
            id="summary"
            title={<span><i className="fa fa-table" /> Summary</span>}
            thToTd={[
              { th: 'Project', td: projectId },
              { th: 'Project Name', td: projectName },
              {
                th: 'Disease Type',
                td: <CollapsibleList data={diseaseType} />,
              },
              {
                th: 'Primary Site',
                td: <CollapsibleList data={primarySite} />,
              },
              { th: 'Program', td: programName },
            ]}
          />
        </span>

        <Column style={{ ...styles.margin, width: '200px' }}>
          <CountCard
            title="CASES"
            count={caseCount.toLocaleString()}
            icon={<CaseIcon style={styles.icon} className="fa-3x" />}
            style={styles.countCard}
            linkParams={
              caseCount
                ? {
                    merge: 'replace',
                    pathname: '/repository',
                    query: {
                      filters: makeFilter(projectFilter),
                    },
                  }
                : null
            }
          />
          <CountCard
            title="FILES"
            count={fileCount.toLocaleString()}
            icon={<FileIcon style={styles.icon} className="fa-3x" />}
            style={styles.countCard}
            linkParams={
              fileCount
                ? {
                    pathname: '/repository',
                    query: {
                      filters: makeFilter(projectFilter),
                      facetTab: 'files',
                      searchTableTab: 'files',
                    },
                  }
                : null
            }
          />
          <CountCard
            title="ANNOTATIONS"
            count={totalAnnotations.toLocaleString()}
            icon={<AnnotationIcon style={styles.icon} className="fa-3x" />}
            style={{ ...styles.countCard, marginBottom: 0 }}
            linkParams={
              totalAnnotations
                ? {
                    merge: 'replace',
                    pathname: `/annotations${totalAnnotations === 1
                      ? `/${annotations[0].annotation_id}`
                      : ''}`,
                    query: {
                      filters:
                        totalAnnotations > 1 &&
                          makeFilter([
                            {
                              field: 'annotations.project.project_id',
                              value: projectId,
                            },
                          ]),
                    },
                  }
                : null
            }
          />
        </Column>
      </Row>

      <Row style={{ flexWrap: 'wrap' }} spacing={SPACING}>
        <span style={{ ...styles.column, ...styles.margin, flex: 1 }}>
          <SummaryCard
            tableTitle="Cases and File Counts by Experimental Strategy"
            pieChartTitle="File Counts by Experimental Strategy"
            data={experimentalStrategies.map((item, i) => {
              const filters = makeFilter([
                ...projectFilter,
                {
                  field: 'files.experimental_strategy',
                  value: [item.experimental_strategy],
                },
              ]);

              return {
                id: item.experimental_strategy,
                experimental_strategy: (
                  <span>
                    <div
                      style={{
                        ...styles.coloredSquare,
                        backgroundColor: colors20(i),
                      }}
                    />
                    {item.experimental_strategy}
                  </span>
                ),
                case_count: (
                  <Link
                    merge="replace"
                    pathname="/repository"
                    query={{
                      filters,
                      facetTab: 'cases',
                      searchTableTab: 'cases',
                    }}
                  >
                    {(item.case_count || 0).toLocaleString()}
                  </Link>
                ),
                case_count_meter: (
                  <SparkMeterWithTooltip
                    part={item.case_count}
                    whole={caseCount}
                  />
                ),
                file_count: (
                  <Link
                    merge="replace"
                    pathname="/repository"
                    query={{
                      filters,
                      facetTab: 'files',
                      searchTableTab: 'files',
                    }}
                  >
                    {(item.file_count || 0).toLocaleString()}
                  </Link>
                ),
                file_count_meter: (
                  <SparkMeterWithTooltip
                    part={item.file_count}
                    whole={fileCount}
                  />
                ),
                file_count_value: item.file_count,
                tooltip: (
                  <span>
                    <b>{item.experimental_strategy}</b><br />
                    {item.file_count} file{item.file_count > 1 ? 's' : ''}
                  </span>
                ),
                clickHandler: () => {
                  const newQuery = mergeQuery(
                    {
                      filters,
                      facetTab: 'files',
                      searchTableTab: 'files',
                    },
                    query,
                    'replace',
                  );
                  const q = removeEmptyKeys({
                    ...newQuery,
                    filters:
                      newQuery.filters && JSURL.stringify(newQuery.filters),
                  });
                  push({ pathname: '/repository', query: q });
                },
              };
            })}
            footer={`${experimentalStrategies.length} Experimental Strategies`}
            path="file_count_value"
            headings={[
              {
                key: 'experimental_strategy',
                title: 'Experimental Strategy',
                color: true,
              },
              {
                key: 'case_count',
                title: 'Cases',
                style: { textAlign: 'right' },
              },
              {
                key: 'case_count_meter',
                title: (
                  <Link
                    merge="replace"
                    pathname="/repository"
                    query={{
                      filters: makeFilter(projectFilter),
                      facetTab: 'cases',
                      searchTableTab: 'cases',
                    }}
                    title="Browse cases"
                  >
                    <SampleSize n={caseCount} />
                  </Link>
                ),
                thStyle: {
                  width: 1,
                  textAlign: 'center',
                },
                style: { textAlign: 'left' },
              },
              {
                key: 'file_count',
                title: 'Files',
                style: { textAlign: 'right' },
              },
              {
                key: 'file_count_meter',
                title: (
                  <Link
                    merge="replace"
                    pathname="/repository"
                    query={{
                      filters: makeFilter(projectFilter),
                      facetTab: 'files',
                      searchTableTab: 'files',
                    }}
                    title="Browse files"
                  >
                    <SampleSize n={fileCount} />
                  </Link>
                ),
                thStyle: {
                  width: 1,
                  textAlign: 'center',
                },
                style: { textAlign: 'left' },
              },
            ]}
          />
        </span>
        <span style={{ ...styles.column, ...styles.margin, flex: 1 }}>
          <SummaryCard
            tableTitle="Cases and File Counts by Data Category"
            pieChartTitle="File Counts by Data Category"
            data={dataCategories.map((item, i) => {
              const filters = makeFilter([
                ...projectFilter,
                { field: 'files.data_category', value: [item.data_category] },
              ]);

              return {
                id: item.data_category,
                data_category: (
                  <span>
                    <div
                      style={{
                        ...styles.coloredSquare,
                        backgroundColor: colors20(i),
                      }}
                    />
                    {item.data_category}
                  </span>
                ),
                case_count: item.case_count > 0
                  ? <Link
                      merge="replace"
                      pathname="/repository"
                      query={{
                        filters,
                        facetTab: 'cases',
                        searchTableTab: 'cases',
                      }}
                    >
                      {item.case_count.toLocaleString()}
                    </Link>
                  : 0,
                case_count_meter: (
                  <SparkMeterWithTooltip
                    part={item.case_count}
                    whole={caseCount}
                  />
                ),
                file_count: item.file_count
                  ? <Link
                      merge="replace"
                      pathname="/repository"
                      query={{
                        filters,
                        facetTab: 'files',
                        searchTableTab: 'files',
                      }}
                    >
                      {item.file_count.toLocaleString()}
                    </Link>
                  : 0,
                file_count_meter: (
                  <SparkMeterWithTooltip
                    part={item.file_count}
                    whole={fileCount}
                  />
                ),
                file_count_value: item.file_count,
                tooltip: (
                  <span>
                    <b>{item.data_category}</b><br />
                    {item.file_count} file{item.file_count > 1 ? 's' : ''}
                  </span>
                ),
                clickHandler: () => {
                  const newQuery = mergeQuery(
                    {
                      filters,
                      facetTab: 'files',
                      searchTableTab: 'files',
                    },
                    query,
                    'replace',
                  );
                  const q = removeEmptyKeys({
                    ...newQuery,
                    filters:
                      newQuery.filters && JSURL.stringify(newQuery.filters),
                  });
                  push({ pathname: '/repository', query: q });
                },
              };
            })}
            footer={`${dataCategories.length} Data Categories`}
            path="file_count_value"
            headings={[
              { key: 'data_category', title: 'Data Category', color: true },
              {
                key: 'case_count',
                title: 'Cases',
                style: { textAlign: 'right' },
              },
              {
                key: 'case_count_meter',
                title: (
                  <Link
                    merge="replace"
                    pathname="/repository"
                    query={{
                      filters: makeFilter(projectFilter),
                      facetTab: 'cases',
                      searchTableTab: 'cases',
                    }}
                    title="Browse cases"
                  >
                    <SampleSize n={caseCount} />
                  </Link>
                ),
                thStyle: {
                  textAlign: 'center',
                  width: 1,
                },
                style: { textAlign: 'left' },
              },
              {
                key: 'file_count',
                title: 'Files',
                style: { textAlign: 'right' },
              },
              {
                key: 'file_count_meter',
                title: (
                  <Link
                    merge="replace"
                    pathname="/repository"
                    query={{
                      filters: makeFilter(projectFilter),
                      facetTab: 'files',
                      searchTableTab: 'files',
                    }}
                    title="Browse files"
                  >
                    <SampleSize n={fileCount} />
                  </Link>
                ),
                thStyle: {
                  textAlign: 'center',
                  width: 1,
                },
                style: { textAlign: 'left' },
              },
            ]}
          />
        </span>
      </Row>
      {!!viewer.explore.cases.mutatedCases.total &&
        <ProjectVisualizations viewer={viewer} projectId={projectId} />}
    </span>
  );
};

export default enhance(Project);
