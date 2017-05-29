/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';
import { compose, withPropsOnChange } from 'recompose';
import { Row, Column } from '@ncigdc/uikit/Flex';
import TableIcon from '@ncigdc/theme/icons/Table';
import ChartIcon from '@ncigdc/theme/icons/BarChart';
import { makeFilter } from '@ncigdc/utils/filters';
import FullWidthLayout from '@ncigdc/components/Layouts/FullWidthLayout';
import Lolliplot from '@ncigdc/containers/Lolliplot';
import SsmSummary from '@ncigdc/containers/SsmSummary';
import SsmExternalReferences from '@ncigdc/containers/SsmExternalReferences';
import ConsequencesTable from '@ncigdc/containers/ConsequencesTable';
import CancerDistributionChart from '@ncigdc/containers/CancerDistributionChart';
import CancerDistributionTable from '@ncigdc/containers/CancerDistributionTable';

import type { TChartTitleProps } from '@ncigdc/containers/CancerDistributionChart';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import ProjectsLink from '@ncigdc/components/Links/ProjectsLink';

const CancerDistributionTitle = ({ cases = 0, projects = [], filters }: TChartTitleProps) => (
  <h5 style={{ textTransform: 'uppercase', padding: '0 2rem' }}>
    THIS MUTATION AFFECTS&nbsp;
    <ExploreLink query={{ searchTableTab: 'cases', filters }}>{cases.toLocaleString()}</ExploreLink>&nbsp;
    CASES ACROSS&nbsp;
    <ProjectsLink
      query={{
        filters: {
          op: 'and',
          content: [
            { op: 'in', content: { field: 'projects.project_id', value: projects.map(p => p.project_id) } },
          ],
        },
      }}
    >
      {projects.length.toLocaleString()}
    </ProjectsLink>&nbsp;
    PROJECTS
</h5>
);

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
    gene_aa_change: Array,
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
  canonicalGeneId: string,
  cdFilters: Object,
};

export const SSMPageComponent = compose(
  withPropsOnChange(['node'], ({ node }) => ({
    canonicalGeneId: node.consequence.hits.edges.find(x => x.node.transcript.is_canonical)
      .node.transcript.gene.gene_id,

    cdFilters: makeFilter([
      { field: 'ssms.ssm_id', value: node.ssm_id },
      { field: 'cases.available_variation_data', value: 'ssm' },
    ], false),
  }))
)(({ node, viewer, canonicalGeneId, cdFilters }: TProps = {}) => (
  <FullWidthLayout
    title={node.ssm_id}
    entityType="MU"
  >
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
    <Column style={{ ...styles.card, marginTop: '2rem' }} id="cancer-distribution">
      <Row>
        <h1 style={{ ...styles.heading, padding: '1rem' }}>
          <ChartIcon style={{ marginRight: '1rem' }} />
          Cancer Distribution
        </h1>
      </Row>
      <Column>
        <CancerDistributionChart
          cases={viewer.explore.cases}
          projects={viewer.projects}
          ssms={viewer.explore.ssms}
          filters={cdFilters}
          ChartTitle={CancerDistributionTitle}
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
      {
        node.gene_aa_change.length
        ? (
          <Lolliplot
            mutationId={node.ssm_id}
            geneId={canonicalGeneId}
            viewer={viewer}
            lolliplot={viewer.analysis.protein_mutations}
            transcripts={node.consequence.hits.edges.map(x => x.node.transcript)}
          />
          )
        : <div style={styles.lolliplotZeroStateWrapper}>No protein coding transcript is affected by this mutation in CDS region.</div>
      }
    </Column>
  </FullWidthLayout>
));

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
        ${Lolliplot.getFragment('viewer')}
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
        analysis {
          protein_mutations {
            ${Lolliplot.getFragment('lolliplot')}
          }
        }
      }
    `,
  },
};

const SSMPage = Relay.createContainer(
  SSMPageComponent,
  SSMPageQuery
);

export default SSMPage;
