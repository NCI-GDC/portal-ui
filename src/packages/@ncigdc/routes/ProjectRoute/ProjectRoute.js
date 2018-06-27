/* @flow */

import React from 'react';
import { compose, withProps } from 'recompose';
import { get } from 'lodash';
import FullWidthLayout from '@ncigdc/components/Layouts/FullWidthLayout';
import ProjectSummary from '@ncigdc/modern_components/ProjectSummary';
import {
  ProjectCountsDataCategory,
  ProjectCountsExpStrategy,
} from '@ncigdc/modern_components/ProjectCounts';
import { makeFilter } from '@ncigdc/utils/filters';
import DownloadManifestButton from '@ncigdc/modern_components/DownloadManifestButton';
import { withExists } from '@ncigdc/modern_components/Exists/index';
import Button from '@ncigdc/uikit/Button';
import withRouter from '@ncigdc/utils/withRouter';
import { stringifyJSONParam } from '@ncigdc/utils/uri';
import ProjectPrimarySitesTable from '@ncigdc/modern_components/ProjectPrimarySitesTable/index';
import { Row } from '@ncigdc/uikit/Flex';
import DownloadClinicalDropdown from '@ncigdc/modern_components/DownloadClinicalDropdown/';
import timestamp from '@ncigdc/utils/timestamp';
import DownloadBiospecimenDropdown from '@ncigdc/modern_components/DownloadBiospecimenDropdown/';
import { AWG } from '@ncigdc/utils/constants';

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

const enhance = compose(
  withProps(({ match }) => ({ type: 'Project', id: get(match, 'params.id') })),
  withExists,
  withRouter,
);

export default enhance(({ id: projectId, filters, push }) => {
  const projectFilter = makeFilter([
    { field: 'cases.project.project_id', value: projectId },
  ]);
  return (
    <FullWidthLayout title={projectId} entityType="PR">
      <Row
        style={{ marginBottom: '2rem', marginLeft: 'auto' }}
        spacing="0.2rem"
      >
        {!AWG && (
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
        )}
        <span>
          <DownloadBiospecimenDropdown
            dropdownStyles={{
              width: '126px',
              left: '2px',
              marginTop: '2px',
            }}
            jsonFilename={`biospecimen.project-${projectId}.${timestamp()}.json`}
            tsvFilename={`biospecimen.project-${projectId}.${timestamp()}.tar.gz`}
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
            tsvFilename={`clinical.project-${projectId}.${timestamp()}.tar.gz`}
            jsonFilename={`clinical.project-${projectId}.${timestamp()}.json`}
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
});
