// @flow

// Vendor
import React from 'react';
import { compose, withState, lifecycle } from 'recompose';
import _ from 'lodash';
import { scaleOrdinal, schemeCategory20 } from 'd3';

// Custom
import Column from './uikit/Flex/Column';
import Row from './uikit/Flex/Row';
import EntityPageVerticalTable from './components/EntityPageVerticalTable';
import CountCard from './components/CountCard';
import DownloadButton from './components/DownloadButton';
import FrequentMutationsContainer from './components/FrequentMutationsContainer';
import FrequentlyMutatedGenesContainer from './components/FrequentlyMutatedGenesContainer';
import MostAffectedCases from './components/MostAffectedCases';
import makeFilter from './utils/makeFilter';
import SummaryCard from './components/SummaryCard';
import OncoGridWrapper from './oncogrid/OncoGridWrapper';
import FileIcon from './theme/icons/File';
import CaseIcon from './theme/icons/Case';
import EditIcon from './theme/icons/Edit';
import Tooltip from './uikit/Tooltip';

const colors20 = scaleOrdinal(schemeCategory20);

const SPACING = '2rem';

const styles = {
  container: {
    width: '80%',
    margin: 'auto',
    position: 'static',
  },
  heading: {
    flexGrow: 1,
    fontSize: '2rem',
    marginBottom: 7,
    marginTop: 7,
  },
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
  hidden: {
    width: 0,
    height: 0,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: 'white',
  },
  coloredSquare: {
    display: 'inline-block',
    width: 10,
    height: 10,
    marginRight: 5,
  },
};

const Project = ({
  $scope,
  authApi,
  api,
  numCasesAggByProject,
  mostAffectedCases,
  defaultSurvivalRawData,
  setSelectedSurvivalData,
  selectedSurvivalData,
  width,
}) => {
  const {
    project,
    clinicalCount,
    clinicalDataExportFileName,
    clinicalDataExportExpands,
    clinicalDataExportFilters,
    biospecimenCount,
    biospecimenDataExportFileName,
    biospecimenDataExportExpands,
    biospecimenDataExportFilters,
    experimentalStrategies,
    expStratConfig,
    dataCategories,
    dataCategoriesConfig,
  } = $scope;
  const projectId = project.project_id;
  const defaultSurvivalLegend = [`${numCasesAggByProject[projectId] || 0} cases on ${projectId}`];

  const survivalData = {
    legend: selectedSurvivalData.legend || defaultSurvivalLegend,
    rawData: selectedSurvivalData.rawData || defaultSurvivalRawData,
  };

  const totalNumCases = Object.keys(numCasesAggByProject).reduce((sum, b) => sum + numCasesAggByProject[b], 0);

  return (
    <span>
      <Row style={{ ...styles.margin, flexDirection: 'row-reverse' }}>
        <DownloadButton
          disabled={biospecimenCount === 0}
          filename={biospecimenDataExportFileName}
          dataExportExpands={biospecimenDataExportExpands}
          url={`${authApi}/cases`}
          activeText="Processing"
          inactiveText={biospecimenCount === 0 ? 'No Biospecimen Data' : 'Download Biospecimen'}
          fields={['case_id']}
          filters={
            makeFilter(_.values(_.mapValues(biospecimenDataExportFilters, (value, field) => ({ value, field }))), false)
          }
        />

        <DownloadButton
          disabled={clinicalCount === 0}
          filename={clinicalDataExportFileName}
          dataExportExpands={clinicalDataExportExpands}
          url={`${authApi}/cases`}
          activeText="Processing"
          inactiveText={clinicalCount === 0 ? 'No Clinical Data' : 'Download Clinical'}
          fields={['case_id']}
          filters={
            makeFilter(_.values(_.mapValues(clinicalDataExportFilters, (value, field) => ({ value, field }))), false)
          }
        />

        <Tooltip
          dir="down"
          innerHTML={`Download a manifest for use with the GDC Data Transfer Tool.
            The GDC Data Transfer Tool is recommended for transferring large volumes of data.`}
          maxWidth="250px"
        >
          <DownloadButton
            disabled={!project.summary.file_count}
            url={`${authApi}/files`}
            activeText="Downloading"
            inactiveText="Download manifest"
            fields={['file_id']}
            size={project.summary.file_count}
            returnType="manifest"
            format="TSV"
            filters={
              makeFilter([{ field: 'cases.project.project_id', value: projectId }], false)
            }
          />
        </Tooltip>
      </Row>

      <Row style={{ flexWrap: 'wrap' }} spacing={SPACING}>
        <span style={{ ...styles.column, ...styles.margin }}>
          <EntityPageVerticalTable
            id="summary"
            title={<span><i className="fa fa-table" /> Summary</span>}
            thToTd={[
              { th: 'Project ID', td: projectId },
              { th: 'Project Name', td: project.name },
              { th: 'Disease Type', td: [].concat(project.disease_type).map(p => <div key={p}>{p}</div>) },
              { th: 'Primary Site', td: [].concat(project.primary_site).map(p => <div key={p}>{p}</div>) },
              { th: 'Program', td: project.program.name },
            ]}
          />
        </span>

        <Column style={{ ...styles.margin, width: '200px' }}>
          <CountCard
            title="CASES"
            count={project.summary.case_count.toLocaleString()}
            icon={<CaseIcon style={styles.icon} className="fa-3x" />}
            style={styles.countCard}
            onCountClick={() => {
              window.location = `/search/c?filters=${
                makeFilter([{ field: 'cases.project.project_id', value: projectId }])
              }`;
            }}
          />

          <CountCard
            title="FILES"
            count={project.summary.file_count.toLocaleString()}
            icon={<FileIcon style={styles.icon} className="fa-3x" />}
            style={styles.countCard}
            onCountClick={() => {
              window.location = `/search/f?filters=${
                makeFilter([{ field: 'cases.project.project_id', value: projectId }])
              }`;
            }}
          />

          <CountCard
            title="ANNOTATIONS"
            count={(project.annotations ? project.annotations.pagination.total : 0).toLocaleString()}
            icon={<EditIcon style={styles.icon} className="fa-3x" />}
            style={{ ...styles.countCard, marginBottom: 0 }}
            {
              ...(project.annotations && project.annotations.pagination.total > 0 ? { onCountClick: () => {
                if (project.annotations.pagination.total > 1) {
                  window.location = `/annotations?filters=${
                      makeFilter([{ field: 'project.project_id', value: projectId }])
                  }`;
                } else {
                  window.location = `/annotations?filters=annotationId=${project.annotations.hits[0].annotation_id}`;
                }
              } } : {})
            }
          />
        </Column>
      </Row>

      <Row style={{ flexWrap: 'wrap' }} spacing={SPACING}>
        <span style={{ ...styles.column, ...styles.margin }}>
          <SummaryCard
            tableTitle="Cases and File Counts by Experimental Strategy"
            pieChartTitle="File Counts by Experimental Strategy"
            data={
              experimentalStrategies.map((item, i) => {
                const { filters, displayKey } = expStratConfig;
                const builtFilters = filters.default.params.filters(item[displayKey]);
                return {
                  experimental_strategy: (
                    <span>
                      <div style={{ ...styles.coloredSquare, backgroundColor: colors20(i) }} />
                      {item.experimental_strategy}
                    </span>
                  ),
                  case_count: <a href={`/search/c?filters=${builtFilters}`} >{item.case_count.toLocaleString()}</a>,
                  file_count: <a href={`/search/f?filters=${builtFilters}`} >{item.file_count.toLocaleString()}</a>,
                  file_count_value: item.file_count,
                };
              })
            }
            footer={`${experimentalStrategies.length} Experimental Strategies`}
            path="file_count_value"
            headings={[
              { key: 'experimental_strategy', title: 'Experimental Strategy', color: true },
              {
                key: 'case_count',
                title: 'Cases',
                style: { textAlign: 'right' },
              },
              {
                key: 'file_count',
                title: 'Files',
                style: { textAlign: 'right' },
              },
            ]}
          />
        </span>
        <span style={{ ...styles.column, ...styles.margin }}>
          <SummaryCard
            tableTitle="Cases and File Counts by Data Category"
            pieChartTitle="File Counts by Experimental Strategy"
            data={
              dataCategories.map((item, i) => {
                const { filters, displayKey } = dataCategoriesConfig;
                const builtFilters = filters.default.params.filters(item[displayKey]);

                return {
                  data_category: (
                    <span>
                      <div style={{ ...styles.coloredSquare, backgroundColor: colors20(i) }} />
                      {item.data_category}
                    </span>
                  ),
                  case_count: <a href={`/search/c?filters=${builtFilters}`}>{item.case_count.toLocaleString()}</a>,
                  file_count: <a href={`/search/f?filters=${builtFilters}`}>{item.file_count.toLocaleString()}</a>,
                  file_count_value: item.file_count,
                };
              })
            }
            footer={`${dataCategories.length} Experimental Strategies`}
            path="file_count_value"
            headings={[
              { key: 'data_category', title: 'Data Category', color: true },
              {
                key: 'case_count',
                title: 'Cases',
                style: { textAlign: 'right' },
              },
              {
                key: 'file_count',
                title: 'Files',
                style: { textAlign: 'right' },
              },
            ]}
          />
        </span>
      </Row>

      <Column style={styles.card}>
        <h1 style={{ ...styles.heading, padding: '1rem' }} id="mutated-genes">
          <i className="fa fa-bar-chart-o" style={{ paddingRight: '10px' }} />
          Most Frequently Mutated Genes
        </h1>
        <FrequentlyMutatedGenesContainer
          numCasesAggByProject={numCasesAggByProject}
          survivalData={survivalData}
          setSelectedSurvivalData={setSelectedSurvivalData}
          selectedSurvivalData={selectedSurvivalData}
          totalNumCases={totalNumCases}
          projectId={projectId}
          width={width}
          api={api}
          config={$scope.config}
        />
      </Column>

      <Column style={{ ...styles.card, marginTop: '2rem', position: 'static' }}>
        <h1 style={{ ...styles.heading, padding: '1rem' }} id="oncogrid">
          <i className="fa fa-th" style={{ paddingRight: '10px' }} />
          OncoGrid
        </h1>
        <OncoGridWrapper width={width} projectId={projectId} api={api} />
      </Column>

      <Column style={{ ...styles.card, marginTop: '2rem' }}>
        <h1 style={{ ...styles.heading, padding: '1rem' }} id="frequent-mutations">
          <i className="fa fa-bar-chart-o" style={{ paddingRight: '10px' }} />
          Most Frequent Mutations
        </h1>

        <FrequentMutationsContainer
          numCasesAggByProject={numCasesAggByProject}
          totalNumCases={totalNumCases}
          projectId={projectId}
          project={$scope.project.project_id}
          defaultSurvivalRawData={defaultSurvivalRawData}
          defaultSurvivalLegend={defaultSurvivalLegend}
          api={api}
          width={width}
          showSurvivalPlot
        />

      </Column>
      <Column style={{ ...styles.card, marginTop: '2rem' }}>
        <h1 style={{ ...styles.heading, padding: '1rem' }} id="most-affected-cases">
          <i className="fa fa-bar-chart-o" style={{ paddingRight: '10px' }} />
          Most Affected Cases
        </h1>

        <MostAffectedCases
          mostAffectedCases={_.sortBy(mostAffectedCases, c => c.gene.length).reverse()}
          project={projectId}
        />
      </Column>
    </span>
  );
};

const enhance = compose(
  withState('selectedSurvivalData', 'setSelectedSurvivalData', {}),
  lifecycle({
    getInitialState() {
      return { width: window.innerWidth };
    },

    componentDidMount() {
      this.onResize = _.debounce(() => {
        this.setState({
          width: window.innerWidth,
        });
      }, 100);

      window.addEventListener('resize', this.onResize);
    },

    componentWillUnmount() {
      window.removeEventListener('resize', this.onResize);
    },
  })
);

export default enhance(Project);
