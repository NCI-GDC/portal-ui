// Vendor
import React from 'react';
import { compose, withState, lifecycle } from 'recompose';
import FileIcon from 'react-icons/lib/fa/file-o';
import CaseIcon from 'react-icons/lib/fa/user';
import EditIcon from 'react-icons/lib/fa/edit';
import _ from 'lodash';

// Custom
import Column from './uikit/Flex/Column';
import Row from './uikit/Flex/Row';
import EntityPageVerticalTable from './components/EntityPageVerticalTable';
import EntityPageHorizontalTable from './components/EntityPageHorizontalTable';
import CountCard from './components/CountCard';
import DownloadButton from './components/DownloadButton';
import FrequentMutations from './components/FrequentMutations';
import makeFilter from './utils/makeFilter';
import SummaryCard from './components/SummaryCard';
import BarChart from './charts/BarChart';
import theme from './theme';
import OncoGridWrapper from './oncogrid/OncoGridWrapper';
import SurvivalPlotWrapper from './components/SurvivalPlotWrapper';
import Button from './Button';
import downloadSvg from './utils/download-svg';

const SPACING = '2rem';
const HALF_SPACING = '1rem';

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
  summary: {
    color: '#6b6262',
  },
  column: {
    // minWidth: 450,
    flexGrow: 1,
  },
  margin: {
    marginBottom: SPACING,
    marginLeft: HALF_SPACING,
    marginRight: HALF_SPACING,
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
  esHost,
  mutatedGenesProject,
  numCasesAggByProject,
  frequentMutations: fm,
  survivalData,
  setSurvivalGene,
  survivalGene,
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

  const mutatedGenesChartData = mutatedGenesProject.map(g => (
    {
      'gene_id': g.gene_id,
      'symbol': g.symbol,
      'cytoband': g.cytoband,
      'num_affected_cases_project': g.case.filter(c => c.project.project_id === $scope.project.project_id).length,
      'num_affected_cases_all': g.case.length,
      'num_mutations': g.case.reduce((acc, c) =>  acc + c.ssm.length, 0),
    }
  ));

  const totalNumCases = Object.keys(numCasesAggByProject).reduce((sum, b) => sum + numCasesAggByProject[b], 0);

  const frequentMutations = fm.map(x => {
    let consequence = x.consequence.find(x => x.transcript.is_canonical);

    return {
      ...x,
      num_affected_cases_project: x.occurrence.filter(x =>
        x.case.project.project_id === $scope.project.project_id).length,
      num_affected_cases_all: x.occurrence.length,
      consequence_type:
        <span>
          <b>{_.startCase(consequence.transcript.consequence_type)}</b>
          <span style={{marginLeft:'5px'}}>{consequence.transcript.gene_symbol}</span>
          <span style={{marginLeft:'5px'}}>{consequence.transcript.aa_change}</span>
        </span>
    }
  });

  return (
    <span>
      <Row style={{ ...styles.margin, flexDirection: 'row-reverse' }}>
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
              value: project.project_id,
            },
          }}
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
      </Row>

      <Row style={{ flexWrap: 'wrap' }}>
        <span style={{ ...styles.column, ...styles.margin }}>
          <EntityPageVerticalTable
            id="summary"
            className="summary-table"
            style={styles.summary}
            title="Summary"
            thToTd={[
              { th: 'Project ID', td: project.project_id },
              { th: 'Project Name', td: project.name },
              { th: 'Disease Type', td: project.disease_type },
              { th: 'Primary Site', td: project.primary_site },
              { th: 'Program', td: project.program.name },
            ]}
          />
        </span>

        <Column style={{ ...styles.margin, width: '200px' }}>
          <CountCard
            title="CASES"
            count={project.summary.case_count.toLocaleString()}
            icon={<CaseIcon style={styles.icon} />}
            style={styles.countCard}
            onCountClick={() => {
              window.location = `/search/c?filters=${
                makeFilter([{ field: 'cases.project.project_id', value: project.project_id }])
              }`;
            }}
          />

          <CountCard
            title="FILES"
            count={project.summary.file_count.toLocaleString()}
            icon={<FileIcon style={styles.icon} />}
            style={styles.countCard}
            onCountClick={() => {
              window.location = `/search/f?filters=${
                makeFilter([{ field: 'cases.project.project_id', value: project.project_id }])
              }`;
            }}
          />

          <CountCard
            title="ANNOTATIONS"
            count={(project.annotations ? project.annotations.pagination.total : 0).toLocaleString()}
            icon={<EditIcon style={styles.icon} />}
            style={{ ...styles.countCard, marginBottom: 0 }}
            {
              ...(project.annotations && project.annotations.pagination.total > 0 ? { onCountClick: () => {
                if (project.annotations.pagination.total > 1) {
                  window.location = `/annotations?filters=${
                      makeFilter([{ field: 'project.project_id', value: project.project_id }])
                  }`;
                } else {
                  window.location = `/annotations?filters=annotationId=${project.annotations.hits[0].annotation_id}`;
                }
              } } : {})
            }
          />
        </Column>
      </Row>

      <Row style={{ flexWrap: 'wrap' }}>
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
                onClick: (item) => {
                  window.location = `/search/c?filters=${
                    expStratConfig.filters.default.params.filters(item[expStratConfig.displayKey])
                  }`;
                },
              },
              {
                key: 'file_count',
                title: 'Files',
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
                onClick: (item) => {
                  window.location = `/search/c?filters=${
                    dataCategoriesConfig.filters.default.params.filters(item[dataCategoriesConfig.displayKey])
                  }`;
                },
              },
              {
                key: 'file_count',
                title: 'Files',
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
      <Row style={{ flexWrap: 'wrap' }}>
        <span style={{...styles.column, width: '50%', minWidth: 520}}>
          <Column>
            <h1 style={styles.heading} id="mutated-genes">
              <i className="fa fa-bar-chart-o" style={{ paddingRight: `10px` }} />Most Frequently Mutated Genes
            </h1>
            <span style={{textAlign: 'right', marginRight: 50, marginLeft: 30}}>
              <Button
                style={styles.button}
                disabled={!mutatedGenesChartData.length}
                onClick={
                  () => {
                    downloadSvg({
                      svg: document.querySelector('#mutated-genes-chart svg'),
                      // stylePrefix: '.survival-plot',
                      fileName: 'bar-chart.svg',
                    });
                  }
                }
              >
                <i className="fa fa-download" /><span style={styles.hidden}>reload</span>
              </Button>
            </span>
          </Column>
          <Column style={{...styles.column, paddingBottom: '2.5rem'}}>
            {mutatedGenesChartData.length ? (<div id="mutated-genes-chart"><BarChart
                  height={width < 1410 ? 200 : width * 0.16}
                  data={mutatedGenesChartData.map(g => ({
                    label: g.symbol,
                    value: (g.num_affected_cases_project / numCasesAggByProject[$scope.project.project_id] * 100),
                    tooltip: `<b>${g.symbol}</b><br /> ${(g.num_affected_cases_project / numCasesAggByProject[$scope.project.project_id] * 100).toFixed(2)}%`
                  }))}
                  yAxis={{ title: '% of Cases Affected' }}
                  styles={{
                    xAxis: {stroke: theme.greyScale4, textFill: theme.greyScale3},
                    yAxis: {stroke: theme.greyScale4, textFill: theme.greyScale3},
                    bars: {fill: theme.secondary},
                    tooltips: {
                      fill: '#fff',
                      stroke: theme.greyScale4,
                      textFill: theme.greyScale3
                    }
                  }}
                />
              </div>) : 'No mutated gene data to display'}
          </Column>
        </span>
        <span style={{...styles.column, width: '50%', minWidth: 500}}>
          <SurvivalPlotWrapper
            rawData={survivalData}
            gene={survivalGene}
            onReset={() => setSurvivalGene('')}
            height={width < 1410 ? width * 0.25 : width * 0.16}
            width={width}
          />
        </span>
      </Row>
      {mutatedGenesChartData.length ? (<div>
      <EntityPageHorizontalTable
          headings={[
            { key: 'symbol', title: 'Symbol' },
            { key: 'cytoband', title: 'Cytoband' },
            {
              key: 'num_affected_cases_project',
              title: (<span># Affected Cases<br />in {$scope.project.project_id}</span>),
            },
            {
              key: 'num_affected_cases_all',
              title: (<span># Affected Cases<br />in All Projects</span>),
            },
            { key: 'num_mutations', title: '# Mutations'},
            {
              title: <i className="fa fa-bar-chart-o" />,
              onClick: (d) => setSurvivalGene(d.gene_id === survivalGene ? '' : d.gene_id),
              value: <i className="fa fa-bar-chart-o" />,
            }
          ]}
          data={mutatedGenesChartData.map(g => ({
            ...g,
            symbol: <a href={`/genes/${g.gene_id}`}>{g.symbol}</a>,
            num_affected_cases_project: `${g.num_affected_cases_project} / ${numCasesAggByProject[$scope.project.project_id]} (${(g.num_affected_cases_project/numCasesAggByProject[$scope.project.project_id]*100).toFixed(2)}%)`,
            num_affected_cases_all: `${g.num_affected_cases_all} / ${totalNumCases} (${(g.num_affected_cases_all/totalNumCases * 100).toFixed(2)}%)`,
          }))}
      /></div>) : 'No mutated gene data to display'}

      <Column>
        <h1 style={styles.heading} id="frequent-mutations">
          <i className="fa fa-bar-chart-o" style={{ paddingRight: `10px` }} />
          Most Frequent Mutations
        </h1>
      </Column>

      <FrequentMutations
        frequentMutations={frequentMutations}
        numCasesAggByProject={numCasesAggByProject}
        totalNumCases={totalNumCases}
        project={$scope.project.project_id}
      />

      <Column>
        <h1 style={styles.heading} id="oncogrid">
          <i className="fa fa-th" style={{ paddingRight: `10px` }} /> OncoGrid
        </h1>
      </Column>

      <OncoGridWrapper projectId={project.project_id} esHost={esHost} width={width} />
    </span>
  );
};

Project.propTypes = {
  $scope: React.PropTypes.object,
  authApi: React.PropTypes.string,
  mutatedGenesProject: React.PropTypes.array,
  numCasesAggByProject: React.PropTypes.object,
};

const enhance = compose(
  withState('survivalGene', 'setSurvivalGene', ''),
  lifecycle({
    getInitialState: function() {
      return { width: window.innerWidth };
    },

    componentDidMount: function() { 
      this.onResize = _.debounce(() => {this.setState({
        width: window.innerWidth,
      })}, 100);

      window.addEventListener('resize', this.onResize);
    },

    componentWillUnmount: function() {
      window.removeEventListener('resize', this.onResize);
    },
  })
);

export default enhance(Project);
