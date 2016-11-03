import React from 'react';
import FileIcon from 'react-icons/lib/fa/file-o';

import makeFilter from './utils/makeFilter';
import Column from './uikit/Flex/Column';
import Row from './uikit/Flex/Row';
import CountCard from './components/CountCard';
import EntityPageVerticalTable from './components/EntityPageVerticalTable';
import EntityPageHorizontalTable from './components/EntityPageHorizontalTable';
import theme from './theme'

let styles = {
  icon: {
    width: '4rem',
    height: '4rem',
    color: '#888',
  },
};

let Case = ({ $scope }) => {
  let { participant: p } = $scope;

  return (
    <Column>
      <Row spacing={theme.spacing}>
        <EntityPageVerticalTable
          id="summary"
          title={<span><i className="fa fa-table" /> Summary</span>}
          thToTd={[
            { th: 'Case UUID', td: p.case_id },
            { th: 'Case Submitter ID', td: p.submitter_id },
            { th: 'Project ID', td: p.project.project_id },
            { th: 'Project Name', td: p.project.name },
            { th: 'Disease Type', td: p.project.disease_type },
            { th: 'Program', td: p.project.program.name },
            { th: 'Primary Site', td: p.project.primary_site },
          ]}
          style={{ flex: 1 }}
        />

        <Column style={{ width: '200px' }} spacing={theme.spacing}>
          <CountCard
            title="FILES"
            count={p.files.length.toLocaleString()}
            icon={<FileIcon style={styles.icon} />}
            onCountClick={() => {
              window.location = `/search/f?filters=${
                makeFilter([{ field: 'cases.project.project_id', value: p.files[0].file_id }])
              }`;
            }}
          />
          <CountCard
            title="ANNOTATIONS"
            count={p.annotationIds.length.toLocaleString()}
            icon={<i className="fa fa-edit" style={styles.icon} />}
            onCountClick={() => {
              window.location = `/search/f?filters=${
                makeFilter([{ field: 'cases.project.project_id', value: p.files[0].file_id }])
              }`;
            }}
          />
        </Column>
      </Row>
    </Column>
  );
};

export default Case;
