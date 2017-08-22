/* @flow */

import React from 'react';
import { truncate } from 'lodash';
import { Row, Column } from '@ncigdc/uikit/Flex';
import TableIcon from '@ncigdc/theme/icons/Table';
import ChartIcon from '@ncigdc/theme/icons/BarChart';
import GdcDataIcon from '@ncigdc/theme/icons/GdcData';
import { makeFilter } from '@ncigdc/utils/filters';
import Heading from '@ncigdc/uikit/Heading';
import FullWidthLayout from '@ncigdc/components/Layouts/FullWidthLayout';
import { SsmLolliplot } from '@ncigdc/modern_components/Lolliplot';
import SsmSummary from '@ncigdc/modern_components/SsmSummary';
import SsmExternalReferences from '@ncigdc/modern_components/SsmExternalReferences';
import ConsequencesTable from '@ncigdc/modern_components/ConsequencesTable';
import CancerDistributionBarChart from '@ncigdc/modern_components/CancerDistributionBarChart';
import CancerDistributionTable from '@ncigdc/modern_components/CancerDistributionTable';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import ProjectsLink from '@ncigdc/components/Links/ProjectsLink';
import createSsmSummary from '@ncigdc/modern_components/SsmSummary/SsmSummary.relay';

const DnaChange = createSsmSummary(
  ({
    viewer,
    dnaChange = viewer.explore.ssms.hits.edges[0].node.genomic_dna_change,
  }) =>
    <span>
      {truncate(dnaChange, 12)}
    </span>,
);

const CancerDistributionTitle = ({ cases = 0, projects = [], filters }) =>
  <h5 style={{ textTransform: 'uppercase', padding: '0 2rem' }}>
    THIS MUTATION AFFECTS&nbsp;
    <ExploreLink query={{ searchTableTab: 'cases', filters }}>
      {cases.toLocaleString()}
    </ExploreLink>&nbsp;
    CASES ACROSS&nbsp;
    <ProjectsLink
      query={{
        filters: {
          op: 'and',
          content: [
            {
              op: 'in',
              content: {
                field: 'projects.project_id',
                value: projects.map(p => p.project_id),
              },
            },
          ],
        },
      }}
    >
      {projects.length.toLocaleString()}
    </ProjectsLink>&nbsp;
    PROJECTS
  </h5>;

export default ({ match, ssmId = match.params.id, filters }) => {
  const cdFilters = makeFilter([
    { field: 'ssms.ssm_id', value: ssmId },
    { field: 'cases.available_variation_data', value: 'ssm' },
  ]);

  return (
    <FullWidthLayout
      title={<DnaChange ssmId={ssmId} minHeight={31} />}
      entityType="MU"
    >
      <Row spacing="2rem" id="summary">
        <Row flex="1"><SsmSummary ssmId={ssmId} /></Row>
        <Row flex="1"><SsmExternalReferences ssmId={ssmId} /></Row>
      </Row>
      <Column style={{ backgroundColor: 'white' }}>
        <Heading id="consequences" style={{ padding: '1rem' }}>
          <TableIcon style={{ marginRight: '1rem' }} />
          Consequences
        </Heading>
        <Row>
          <ConsequencesTable ssmId={ssmId} />
        </Row>
      </Column>
      <Column
        style={{ backgroundColor: 'white', marginTop: '2rem' }}
        id="cancer-distribution"
      >
        <Row style={{ padding: '1rem 1rem 2rem', alignItems: 'center' }}>
          <Heading>
            <ChartIcon style={{ marginRight: '1rem' }} />
            Cancer Distribution
          </Heading>
          <ExploreLink query={{ searchTableTab: 'cases', filters: cdFilters }}>
            <GdcDataIcon /> Open in Exploration
          </ExploreLink>
        </Row>
        <Column>
          <CancerDistributionBarChart
            filters={cdFilters}
            ChartTitle={CancerDistributionTitle}
            style={{ width: '50%' }}
          />
          <CancerDistributionTable filters={cdFilters} entityName={ssmId} />
        </Column>
      </Column>
      <Column style={{ backgroundColor: 'white', marginTop: '2rem' }}>
        <SsmLolliplot mutationId={ssmId} ssmId={ssmId} />
      </Column>
    </FullWidthLayout>
  );
};
