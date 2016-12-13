// @flow

// Vendor
import React from 'react';
import { compose, withState, lifecycle } from 'recompose';
import _ from 'lodash';
import { scaleOrdinal, schemeCategory10 } from 'd3';

// Custom
import Column from './uikit/Flex/Column';
import Row from './uikit/Flex/Row';
import EntityPageVerticalTable from './components/EntityPageVerticalTable';
import EntityPageHorizontalTable from './components/EntityPageHorizontalTable';
import CountCard from './components/CountCard';
import DownloadButton from './components/DownloadButton';
import FrequentMutationsContainer from './components/FrequentMutationsContainer';
import MostAffectedCases from './components/MostAffectedCases';
import makeFilter from './utils/makeFilter';
import SummaryCard from './components/SummaryCard';
import BarChart from './charts/BarChart';
import theme from './theme';
import { graphTitle } from './theme/mixins';
import OncoGridWrapper from './oncogrid/OncoGridWrapper';
import SurvivalPlotWrapper from './components/SurvivalPlotWrapper';
import TogglableUl from './uikit/TogglableUl';
import FileIcon from './theme/icons/File';
import CaseIcon from './theme/icons/Case';
import EditIcon from './theme/icons/Edit';
import SurvivalIcon from './theme/icons/SurvivalIcon';
import DownloadVisualizationButton from './components/DownloadVisualizationButton';
import Tooltip from './uikit/Tooltip';
import getSurvivalCurves from './utils/getSurvivalCurves';

const colors = scaleOrdinal(schemeCategory10);

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
  button: {
    color: '#333',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    marginRight: 12,
    minWidth: 46,
    minHeight: 34,
    display: 'inline-flex',
  },
  hidden: {
    width: 0,
    height: 0,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: 'white',
  },
};

function buildFilters(data) {
  return {
    op: 'and',
    content: _.values(_.mapValues(data, (value, key) => ({
      op: 'in',
      content: {
        field: key,
        value: [].concat(value),
      },
    }))),
  };
}

const Project = ({
  $scope,
  authApi,
  api,
  esHost,
  esIndexVersion,
  mutatedGenesProject,
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

  const mutatedGenesChartData = mutatedGenesProject.map(g => ({
    gene_id: g.gene_id,
    symbol: g.symbol,
    cytoband: g.cytoband,
    num_affected_cases_project: g.case.filter(c => c.project.project_id === $scope.project.project_id).length,
    num_affected_cases_all: g.case.length,
    num_affected_cases_by_project: g.case.reduce((acc, c) => ({
      ...acc,
      [c.project.project_id]: acc[c.project.project_id] ? acc[c.project.project_id] + 1 : 1,
    }), {}),
    num_mutations: g.case.reduce((acc, c) => acc + c.ssm.length, 0),
  }));

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
          filters={buildFilters(biospecimenDataExportFilters)}
        />

        <DownloadButton
          disabled={clinicalCount === 0}
          filename={clinicalDataExportFileName}
          dataExportExpands={clinicalDataExportExpands}
          url={`${authApi}/cases`}
          activeText="Processing"
          inactiveText={clinicalCount === 0 ? 'No Clinical Data' : 'Download Clinical'}
          fields={['case_id']}
          filters={buildFilters(clinicalDataExportFilters)}
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
            filters={{
              op: 'in',
              content: {
                field: 'cases.project.project_id',
                value: projectId,
              },
            }}
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
            data={experimentalStrategies}
            footer={`${experimentalStrategies.length} Experimental Strategies`}
            path="file_count"
            headings={[
              { key: 'experimental_strategy', title: 'Experimental Strategy', color: true },
              {
                key: 'case_count',
                title: 'Cases',
                style: { textAlign: 'right' },
                onClick: (item) => {
                  window.location = `/search/c?filters=${
                    expStratConfig.filters.default.params.filters(item[expStratConfig.displayKey])
                  }`;
                },
              },
              {
                key: 'file_count',
                title: 'Files',
                style: { textAlign: 'right' },
                onClick: (item) => {
                  window.location = `/search/f?filters=${
                    expStratConfig.filters.default.params.filters(item[expStratConfig.displayKey])
                  }`;
                },
              },
            ]}
          />
        </span>
        <span style={{ ...styles.column, ...styles.margin }}>
          <SummaryCard
            tableTitle="Cases and File Counts by Data Category"
            pieChartTitle="File Counts by Experimental Strategy"
            data={dataCategories}
            footer={`${dataCategories.length} Experimental Strategies`}
            path="file_count"
            headings={[
              { key: 'data_category', title: 'Data Category', color: true },
              {
                key: 'case_count',
                title: 'Cases',
                style: { textAlign: 'right' },
                onClick: (item) => {
                  window.location = `/search/c?filters=${
                    dataCategoriesConfig.filters.default.params.filters(item[dataCategoriesConfig.displayKey])
                  }`;
                },
              },
              {
                key: 'file_count',
                title: 'Files',
                style: { textAlign: 'right' },
                onClick: (item) => {
                  window.location = `/search/f?filters=${
                    dataCategoriesConfig.filters.default.params.filters(item[dataCategoriesConfig.displayKey])
                  }`;
                },
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
        <Row style={{ paddingBottom: '2.5rem' }}>
          <span>
            <div style={{ textAlign: 'right', marginRight: 50, marginLeft: 30 }}>
              <DownloadVisualizationButton
                disabled={!mutatedGenesChartData.length}
                svg="#mutated-genes-chart svg"
                data={mutatedGenesChartData}
                slug="bar-chart"
                tooltipHTML="Download image or data"
                noText
              />
            </div>
            <div style={graphTitle}>Distribution of Most Frequently Mutated Genes</div>
            {!!mutatedGenesChartData.length &&
              <div id="mutated-genes-chart">
                <Row style={{ padding: '0 2rem' }}>
                  <BarChart
                    data={mutatedGenesChartData.map(g => ({
                      label: g.symbol,
                      value: ((g.num_affected_cases_project / numCasesAggByProject[project.project_id]) * 100),
                      tooltip: `<b>${g.symbol}</b><br />
                        ${g.num_affected_cases_project} Case${g.num_affected_cases_project > 1 ? 's' : ''}
                        Affected in ${project.project_id}<br />
                        ${g.num_affected_cases_project} / ${numCasesAggByProject[project.project_id]}
                        ${((g.num_affected_cases_project / numCasesAggByProject[project.project_id]) * 100)
                          .toFixed(2)}%`,
                      href: `genes/${g.gene_id}`,
                    }))}
                    yAxis={{ title: '% of Cases Affected' }}
                    height={240}
                    styles={{
                      xAxis: { stroke: theme.greyScale4, textFill: theme.greyScale3 },
                      yAxis: { stroke: theme.greyScale4, textFill: theme.greyScale3 },
                      bars: { fill: theme.secondary },
                      tooltips: {
                        fill: '#fff',
                        stroke: theme.greyScale4,
                        textFill: theme.greyScale3,
                      },
                    }}
                  />
                </Row>
              </div>
            }
          </span>
          {survivalData.rawData && (
            <span style={{ ...styles.column, width: '50%' }}>
              <SurvivalPlotWrapper
                {...survivalData}
                onReset={() => setSelectedSurvivalData({})}
                height={240}
                width={width}
              />
            </span>
          )}
        </Row>
        <Column>
          {!!mutatedGenesChartData.length &&
            <EntityPageHorizontalTable
              headings={[
                { key: 'symbol', title: 'Symbol' },
                { key: 'cytoband', title: 'Cytoband' },
                {
                  key: 'num_affected_cases_project',
                  title: <span># Affected Cases<br /></span>,
                },
                {
                  key: 'num_affected_cases_all',
                  title: <span># Affected Cases<br /> Across all Projects</span>,
                  style: { minWidth: '210px' },
                },
                {
                  key: 'num_mutations',
                  title: '# Mutations',
                  style: { textAlign: 'right' },
                },
                {
                  title: 'Survival Analysis',
                  key: 'survival_plot',
                  style: { textAlign: 'center', width: '100px' },
                },
              ]}
              data={mutatedGenesChartData.map(g => ({
                ...g,
                symbol: <a href={`/genes/${g.gene_id}`}>{g.symbol}</a>,
                cytoband: (g.cytoband || []).join(', '),
                num_affected_cases_project:
                  `${g.num_affected_cases_project} / ${numCasesAggByProject[project.project_id]}
                  (${((g.num_affected_cases_project / numCasesAggByProject[project.project_id]) * 100).toFixed(2)}%)`,
                num_affected_cases_all: (
                  <TogglableUl
                    items={[
                      `${g.num_affected_cases_all}/${totalNumCases}
                      (${((g.num_affected_cases_all / totalNumCases) * 100).toFixed(2)}%)`,
                      ...Object.keys(g.num_affected_cases_by_project)
                        .map(k => `
                          ${k}: ${g.num_affected_cases_by_project[k]} / ${numCasesAggByProject[k]}
                          (${((g.num_affected_cases_by_project[k] / numCasesAggByProject[k]) * 100).toFixed(2)}%)`),
                    ]}
                  />
                ),
                survival_plot: (
                  <Tooltip innerHTML={`Add ${g.symbol} to surival plot`}>
                    <button
                      onClick={() => {
                          if (g.symbol !== selectedSurvivalData.id) {
                            getSurvivalCurves({
                              api,
                              projectId: projectId,
                              field: 'gene.symbol',
                              value: g.symbol,
                            })
                              .then(setSelectedSurvivalData);
                          } else {
                            setSelectedSurvivalData({});
                          }
                        }
                      }
                    >
                      <span
                        style={{
                          color: colors(selectedSurvivalData.id === g.symbol ? 1 : 0),
                          cursor: 'pointer'
                        }}
                      >
                        <SurvivalIcon />
                        <div style={styles.hidden}>add to survival plot</div>
                      </span>
                    </button>
                  </Tooltip>
                ),
              }))}
            />
          }
          {!mutatedGenesChartData.length && 'No mutated gene data to display'}
        </Column>
      </Column>

      <Column style={{ ...styles.card, marginTop: '2rem', position: 'static' }}>
        <h1 style={{ ...styles.heading, padding: '1rem' }} id="oncogrid">
          <i className="fa fa-th" style={{ paddingRight: '10px' }} />
          OncoGrid
        </h1>
        <OncoGridWrapper width={width} projectId={projectId} esHost={esHost} esIndexVersion={esIndexVersion} />
      </Column>

      <Column style={{ ...styles.card, marginTop: '2rem' }}>
        <h1 style={{ ...styles.heading, padding: '1rem' }} id="frequent-mutations">
          <i className="fa fa-bar-chart-o" style={{ paddingRight: '10px' }} />
          Most Frequent Mutations
        </h1>

        <FrequentMutationsContainer
          $scope={$scope}
          numCasesAggByProject={numCasesAggByProject}
          totalNumCases={totalNumCases}
          projectId={projectId}
          project={$scope.project.project_id}
          defaultSurvivalRawData={defaultSurvivalRawData}
          defaultSurvivalLegend={defaultSurvivalLegend}
          api={api}
          width={width}
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
