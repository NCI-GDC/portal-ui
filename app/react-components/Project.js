// Vendor
import React from 'react';
import FileIcon from 'react-icons/lib/fa/file-o';
import CaseIcon from 'react-icons/lib/fa/user';
import EditIcon from 'react-icons/lib/fa/edit';

// Custom
import Column from './uikit/Flex/Column';
import Row from './uikit/Flex/Row';
import Button from './Button';
import OncoGridWrapper from './OncoGridWrapper';
import EntityPageVerticalTable from './components/EntityPageVerticalTable';
import EntityPageHorizontalTable from './components/EntityPageHorizontalTable';
import CountCard from './components/CountCard';

let Project = (() => {
  const icon = '';
  const active = '';
  const styles = {
    container: {
      width: '80%',
      margin: 'auto',
    },
    heading: {
      flexGrow: 1,
      fontSize: '2rem',
      marginBottom: 7,
      marginTop: 7,
    },
    buttons: {
      flex: 'none',
      color: '#fff',
      backgroundColor: '#0d95a1',
      marginLeft: '0.2rem',
    },
    countCard: {
      width: 'auto',
      marginBottom: '2rem',
    },
    summary: {
      marginBottom: '2rem',
    },
    column: {
      width: '100%',
      minWidth: 450,
    },
  }

  return ({ $scope }) => (
    <Column style={styles.container}>
      <Row style={{
        justifyContent: 'space-between',
        marginBottom: '2rem'
      }}>
        <h1 style={styles.heading}>
          <i className="fa fa-custom fa-annotations"></i>
          {$scope.project.project_id}
        </h1>

        <Button
          style={styles.buttons}
          leftIcon={
            <i className={`fa ${icon || 'fa-download'} ${active ? 'fa-spinner fa-pulse' : ''}`} />
          }
          disabled={$scope.biospecimenCount === 0}
        >
          {$scope.biospecimenCount === 0 ? 'No Biospecimen Data' : 'Download Biospecimen'}
        </Button>
        <Button
          style={styles.buttons}
          leftIcon={
            <i className={`fa ${icon || 'fa-download'} ${active ? 'fa-spinner fa-pulse' : ''}`} />
          }
        >
          {$scope.clinicalCount === 0 ? 'No Clinical Data' : 'Download Clinical'}
        </Button>
        <Button
          style={styles.buttons}
          leftIcon={
            <i className={`fa ${icon || 'fa-download'} ${active ? 'fa-spinner fa-pulse' : ''}`} />
          }
        >
          {true ? 'Downloading' : 'Download manifest'}
        </Button>
      </Row>


      <Row spacing="2rem">
        <EntityPageVerticalTable
          title="Summary"
          thToTd={[
            { th: 'Project ID', td: $scope.project.project_id },
            { th: 'Project Name', td: $scope.project.name },
            { th: 'Disease Type', td: $scope.project.disease_type },
            { th: 'Primary Site', td: $scope.project.primary_site },
            { th: 'Program', td: $scope.project.program.name },
          ]}
          style={{...styles.summary, ...styles.column}}
        />

        <Column style={styles.column}>
          <CountCard
            title="CASES"
            count={$scope.project.summary.case_count}
            icon={<CaseIcon style={{ width: '4rem', height: '4rem' }} />}
            style={styles.countCard}
          />

          <CountCard
            title="FILES"
            count={$scope.project.summary.file_count}
            icon={<FileIcon style={{ width: '4rem', height: '4rem' }} />}
            style={styles.countCard}
          />

          {$scope.project.annotation && <CountCard
            title="ANNOTATIONS"
            count={$scope.project.annotations.pagination.total}
            icon={<EditIcon style={{ width: '4rem', height: '4rem' }} />}
            style={styles.countCard}
          />}
        </Column>
      </Row>

      <Row spacing="2rem" style={{marginBottom: '2rem'}}>
        <span
          style={styles.column}
        >
          <EntityPageHorizontalTable
            title="Cases and File Counts by Experimental Strategy"
            headings={[
              { key: 'experimental_strategy', title: 'Experimental Strategy' },
              { key: 'case_count', title: 'Cases' },
              { key: 'file_count', title: 'Files' },
            ]}
            data={$scope.experimentalStrategies}
            style={styles.column}
          />
        </span>
        <span
          style={styles.column}
        >
          <EntityPageHorizontalTable
            title="Cases and File Counts by Data Category"
            headings={[
              { key: 'data_category', title: 'Data Category' },
              { key: 'case_count', title: 'Cases' },
              { key: 'file_count', title: 'Files' },
            ]}
            data={$scope.dataCategories}
          />
        </span>
      </Row>
      <OncoGridWrapper $scope={$scope}/>
    </Column>
  );
})()

export default Project;
