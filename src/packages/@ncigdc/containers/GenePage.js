/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';

import ChartIcon from '@ncigdc/theme/icons/BarChart';
import { Row, Column } from '@ncigdc/uikit/Flex';
import { makeFilter } from '@ncigdc/utils/filters';
import GeneSummary from '@ncigdc/containers/GeneSummary';
import GeneExternalReferences from '@ncigdc/containers/GeneExternalReferences';
import CancerDistributionChart from '@ncigdc/containers/CancerDistributionChart';
import CancerDistributionTable from '@ncigdc/containers/CancerDistributionTable';
import Lolliplot from '@ncigdc/containers/Lolliplot';
import SsmsBarChart from '@ncigdc/modern_components/SsmsBarChart/SsmsBarChart';
import SsmsTable from '@ncigdc/modern_components/SsmsTable/SsmsTable';
import FullWidthLayout from '@ncigdc/components/Layouts/FullWidthLayout';
import DoubleHelix from '@ncigdc/theme/icons/DoubleHelix';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';

const styles = {
  heading: {
    flexGrow: 1,
    fontSize: '2.2rem',
    marginBottom: 7,
    marginTop: 7,
    display: 'flex',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
  },
};

export type TProps = {|
  node: {
    gene_id: string,
    symbol: string,
    biotype: string,
    transcripts: {
      hits: {
        edges: Array<Object>,
      },
    },
  },
  viewer: {
    explore: {
      cases: Object,
      ssms: Object,
    },
    projects: Object,
  },
|};

export const GenePageComponent = (props: TProps) => {
  const fmFilters = makeFilter([
    {
      field: 'genes.gene_id',
      value: [props.node.gene_id],
    },
  ]);

  const cdFilters = makeFilter([
    { field: 'genes.gene_id', value: props.node.gene_id },
    { field: 'cases.available_variation_data', value: 'ssm' },
  ]);

  return (
    <FullWidthLayout title={props.node.symbol} entityType="GN">
      <Column spacing="2rem">
        <Row spacing="2rem">
          <Row flex="1"><GeneSummary node={props.node} /></Row>
          <Row flex="1"><GeneExternalReferences node={props.node} /></Row>
        </Row>
        <Column style={styles.card} id="cancer-distribution">
          <Row>
            <h1 style={{ ...styles.heading, padding: '1rem' }}>
              <ChartIcon style={{ marginRight: '1rem' }} />
              Cancer Distribution
            </h1>
          </Row>
          <Column>
            <CancerDistributionChart
              cases={props.viewer.explore.cases}
              ssms={props.viewer.explore.ssms}
              projects={props.viewer.projects}
              filters={cdFilters}
              style={{ width: '50%' }}
            />
            <CancerDistributionTable
              filters={cdFilters}
              entityName={props.node.symbol}
              geneId={props.node.gene_id}
              cases={props.viewer.explore.cases}
              projects={props.viewer.projects}
              explore={props.viewer.explore}
            />
          </Column>
        </Column>

        <Column style={{ ...styles.card, marginTop: '2rem' }}>
          {props.node.biotype === 'protein_coding' &&
            <Lolliplot
              geneId={props.node.gene_id}
              transcripts={props.node.transcripts.hits.edges.map(x => x.node)}
              lolliplot={props.viewer.analysis.protein_mutations}
              viewer={props.viewer}
            />}
          {props.node.biotype !== 'protein_coding' &&
            <div>
              <Row>
                <h1 style={{ ...styles.heading, padding: '1rem' }} id="protein">
                  <DoubleHelix width={12} />
                  <span style={{ marginLeft: '1rem' }}>
                    {props.node.symbol} - Protein
                  </span>
                </h1>
              </Row>
              <div style={{ padding: '1rem' }}>
                No mutation occurs in the coding region of this gene.
              </div>
            </div>}
        </Column>

        <Column style={{ ...styles.card, marginTop: '2rem' }}>
          <h1
            style={{ ...styles.heading, padding: '1rem' }}
            id="frequent-mutations"
          >
            <ChartIcon style={{ marginRight: '1rem' }} />
            Most Frequent Somatic Mutations
          </h1>

          <Column>
            <SsmsBarChart
              style={{ width: '50%', flexGrow: 0 }}
              defaultFilters={fmFilters}
              context={props.node.symbol}
            />
            <SsmsTable
              defaultFilters={fmFilters}
              shouldShowGeneSymbol={false}
              context={props.node.symbol}
              tableLink={
                <ExploreLink
                  query={{ searchTableTab: 'mutations', filters: fmFilters }}
                >
                  Open in Exploration
                </ExploreLink>
              }
            />
          </Column>
        </Column>
      </Column>
    </FullWidthLayout>
  );
};

export const GenePageQuery = {
  fragments: {
    node: () => Relay.QL`
      fragment on Gene {
        gene_id
        symbol
        biotype
        transcripts {
          hits(first: 99) {
            edges {
              node {
                is_canonical
                transcript_id
                # used for lolliplot transcript dropdown
                length_amino_acid
                domains {
                  hit_name
                  description
                  start
                  end
                }
              }
            }
          }
        }
        ${GeneSummary.getFragment('node')}
        ${GeneExternalReferences.getFragment('node')}
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

const GenePage = Relay.createContainer(GenePageComponent, GenePageQuery);

export default GenePage;
