/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';
import { compose, withPropsOnChange } from 'recompose';
import { Row, Column } from '@ncigdc/uikit/Flex';
import TableIcon from '@ncigdc/theme/icons/Table';
import ChartIcon from '@ncigdc/theme/icons/BarChart';
import GdcDataIcon from '@ncigdc/theme/icons/GdcData';
import { makeFilter } from '@ncigdc/utils/filters';
import FullWidthLayout from '@ncigdc/components/Layouts/FullWidthLayout';
import { SsmLolliplot } from '@ncigdc/modern_components/Lolliplot';
import SsmSummary from '@ncigdc/containers/SsmSummary';
import SsmExternalReferences from '@ncigdc/containers/SsmExternalReferences';
import ConsequencesTable from '@ncigdc/containers/ConsequencesTable';
import CancerDistributionChart from '@ncigdc/containers/CancerDistributionChart';
import CancerDistributionTable from '@ncigdc/containers/CancerDistributionTable';

import type { TChartTitleProps } from '@ncigdc/containers/CancerDistributionChart';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import ProjectsLink from '@ncigdc/components/Links/ProjectsLink';

const CancerDistributionTitle = ({
  cases = 0,
  projects = [],
  filters,
}: TChartTitleProps) =>
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

const styles = {
  heading: {
    flexGrow: 1,
    fontSize: '2rem',
    marginBottom: 7,
    marginTop: 7,
  },
  card: {
    backgroundColor: 'white',
  },
  lolliplotZeroStateWrapper: {
    padding: '24px 18px',
  },
};

export type TProps = {
  node: {
    ssm_id: string,
    gene_aa_change: Array<string>,
    consequence: {
      hits: {
        edges: Array<{
          node: {
            transcript: {
              transcript_id: string,
              gene: {
                gene_id: string,
              },
            },
          },
        }>,
      },
    },
  },
  viewer: {
    projects: Object,
    explore: {
      cases: {
        aggregations: {
          project__project_id: {
            buckets: Array<Object>,
          },
        },
      },
      ssms: Object,
    },
  },
  cdFilters: Object,
};

export const SSMPageComponent = compose(
  withPropsOnChange(['node'], ({ node }) => ({
    cdFilters: makeFilter([
      { field: 'ssms.ssm_id', value: node.ssm_id },
      { field: 'cases.available_variation_data', value: 'ssm' },
    ]),
  })),
)(({ node, viewer, cdFilters }: TProps = {}) =>
  <FullWidthLayout title={node.ssm_id} entityType="MU">
    <Row spacing="2rem" id="summary">
      <Row flex="1"><SsmSummary node={node} /></Row>
      <Row flex="1"><SsmExternalReferences node={node} /></Row>
    </Row>
    <Column style={styles.card}>
      <h1 id="consequences" style={{ ...styles.heading, padding: '1rem' }}>
        <TableIcon style={{ marginRight: '1rem' }} />
        Consequences
      </h1>
      <Row>
        <ConsequencesTable node={node} />
      </Row>
    </Column>
    <Column
      style={{ ...styles.card, marginTop: '2rem' }}
      id="cancer-distribution"
    >
      <Row style={{ padding: '1rem 1rem 2rem', alignItems: 'center' }}>
        <h1 style={{ ...styles.heading }}>
          <ChartIcon style={{ marginRight: '1rem' }} />
          Cancer Distribution
        </h1>
        <ExploreLink query={{ searchTableTab: 'cases', filters: cdFilters }}>
          <GdcDataIcon /> Open in Exploration
        </ExploreLink>
      </Row>
      <Column>
        <CancerDistributionChart
          cases={viewer.explore.cases}
          projects={viewer.projects}
          ssms={viewer.explore.ssms}
          filters={cdFilters}
          ChartTitle={CancerDistributionTitle}
          style={{ width: '50%' }}
        />
        <CancerDistributionTable
          filters={cdFilters}
          entityName={node.ssm_id}
          cases={viewer.explore.cases}
          projects={viewer.projects}
          explore={viewer.explore}
        />
      </Column>
    </Column>
    <Column style={{ ...styles.card, marginTop: '2rem' }}>
      {node.gene_aa_change.length
        ? <SsmLolliplot mutationId={node.ssm_id} ssmId={node.ssm_id} />
        : <div style={styles.lolliplotZeroStateWrapper}>
            No protein coding transcript is affected by this mutation in CDS
            region.
          </div>}
    </Column>
  </FullWidthLayout>,
);

export const SSMPageQuery = {
  fragments: {
    node: () => Relay.QL`
      fragment on Ssm {
        ssm_id
        gene_aa_change
        consequence {
          hits(first: 99) {
            edges {
              node {
                transcript {
                  transcript_id
                  is_canonical
                  gene {
                    gene_id
                  }
                }
              }
            }
          }
        }
        ${SsmSummary.getFragment('node')}
        ${SsmExternalReferences.getFragment('node')}
        ${ConsequencesTable.getFragment('node')}
      }
    `,
    viewer: () => Relay.QL`
      fragment on Root {
        projects {
          ${CancerDistributionTable.getFragment('projects')}
        }
        explore {
          ${CancerDistributionTable.getFragment('explore')}
          ssms {
            ${CancerDistributionChart.getFragment('ssms')}
          }
          cases {
            ${CancerDistributionChart.getFragment('cases')}
            ${CancerDistributionTable.getFragment('cases')}
            aggregations {
              project__project_id {
                buckets {
                  doc_count
                  key
                }
              }
            }
          }
        }
      }
    `,
  },
};

const SSMPage = Relay.createContainer(SSMPageComponent, SSMPageQuery);

export default SSMPage;
