// Vendor
import React from 'react';
import { compose } from 'recompose';
import FileIcon from 'react-icons/lib/fa/file-o';
import CaseIcon from 'react-icons/lib/fa/user';
import EditIcon from 'react-icons/lib/fa/edit';
import _ from 'lodash';

// Custom
import Column from './uikit/Flex/Column';
import Row from './uikit/Flex/Row';
import EntityPageVerticalTable from './components/EntityPageVerticalTable';
import CountCard from './components/CountCard';
import DownloadButton from './components/DownloadButton';
import makeFilter from './utils/makeFilter';
import SummaryCard from './components/SummaryCard';

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
    minWidth: 450,
    flexGrow: 1,
    flexBasis: 1,
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

const Project = ({ $scope, authApi }) => {
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

  return (
    <Column style={styles.container} className="project-page">
      <Row style={{ ...styles.margin, justifyContent: 'space-between' }} >
        <h1 style={styles.heading}>
          <i style={{ marginRight: 6 }} className="fa fa-align-left" />
          {project.project_id}
        </h1>

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

        <Column style={{ ...styles.column, ...styles.margin }}>
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
            onCountClick={project.annotations && project.annotations.pagination.total > 0 && function() {
              if (project.annotations.pagination.total > 1) {
                window.location = `/annotations?filters=${
                  makeFilter([{ field: 'project.project_id', value: project.project_id }])
                }`;
              } else {
                window.location = `/annotations?filters=annotationId=${project.annotations.hits[0].annotation_id}`;
              }
            }}
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

    </Column>
  );
};

Project.propTypes = {
  $scope: React.PropTypes.object,
  authApi: React.PropTypes.string,
};

const enhance = compose(
);

export default enhance(Project);
