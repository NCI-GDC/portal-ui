/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';

import { Row, Column } from '@ncigdc/uikit/Flex';
import GeneSummary from '@ncigdc/containers/GeneSummary';
import GeneExternalReferences from '@ncigdc/containers/GeneExternalReferences';
import CancerDistributionChart from '@ncigdc/containers/CancerDistributionChart';
import CancerDistributionTable from '@ncigdc/containers/CancerDistributionTable';
import SsmsTable from '@ncigdc/modern_components/SsmsTable';
import { GeneLolliplot } from '@ncigdc/modern_components/Lolliplot';
import FullWidthLayout from '@ncigdc/components/Layouts/FullWidthLayout';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import CurrentFilters from '@ncigdc/components/CurrentFilters';
import DoubleHelix from '@ncigdc/theme/icons/DoubleHelix';
import ChartIcon from '@ncigdc/theme/icons/BarChart';
import GdcDataIcon from '@ncigdc/theme/icons/GdcData';

import GeneSymbol from '@ncigdc/containers/GeneSymbol';
import { replaceFilters } from '@ncigdc/utils/filters';

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
  filters: {},
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
    analysis: {
      protein_mutations: {},
    },
    geneSymbolFragment: {},
  },
|};

export const GenePageComponent = (props: TProps) => {
  const geneFilter = replaceFilters(
    {
      op: 'and',
      content: [
        {
          op: 'in',
          content: { field: 'genes.gene_id', value: [props.node.gene_id] },
        },
      ],
    },
    props.filters,
  );

  const mutatedGeneFilter = replaceFilters(
    {
      op: 'and',
      content: [
        {
          op: 'in',
          content: { field: 'cases.available_variation_data', value: ['ssm'] },
        },
      ],
    },
    geneFilter,
  );

  return (
    <FullWidthLayout title={props.node.symbol} entityType="GN">
      <Column spacing="2rem">
        {props.filters &&
          <CurrentFilters
            geneSymbolFragment={props.viewer.geneSymbolFragment}
          />}
        <Row spacing="2rem">
          <Row flex="1"><GeneSummary node={props.node} /></Row>
          <Row flex="1"><GeneExternalReferences node={props.node} /></Row>
        </Row>
        <Column style={styles.card} id="cancer-distribution">
          <Row style={{ padding: '1rem 1rem 2rem', alignItems: 'center' }}>
            <h1 style={{ ...styles.heading }}>
              <ChartIcon style={{ marginRight: '1rem' }} />
              Cancer Distribution
            </h1>
            <ExploreLink
              query={{ searchTableTab: 'cases', filters: mutatedGeneFilter }}
            >
              <GdcDataIcon /> Open in Exploration
            </ExploreLink>
          </Row>
          <Column>
            <CancerDistributionChart
              cases={props.viewer.explore.cases}
              ssms={props.viewer.explore.ssms}
              projects={props.viewer.projects}
              filters={mutatedGeneFilter}
              style={{ width: '50%' }}
            />
            <CancerDistributionTable
              filters={mutatedGeneFilter}
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
            <GeneLolliplot geneId={props.node.gene_id} />}
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
          <Row style={{ padding: '1rem 1rem 2rem', alignItems: 'center' }}>
            <h1 style={{ ...styles.heading }} id="frequent-mutations">
              <ChartIcon style={{ marginRight: '1rem' }} />
              Most Frequent Somatic Mutations
            </h1>
            <ExploreLink
              query={{ searchTableTab: 'mutations', filters: geneFilter }}
            >
              <GdcDataIcon /> Open in Exploration
            </ExploreLink>
          </Row>

          <Column>
            <SsmsTable
              defaultFilters={geneFilter}
              shouldShowGeneSymbol={false}
              context={props.node.symbol}
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
        geneSymbolFragment: explore {
          ${GeneSymbol.getFragment('explore')}
        }
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
      }
    `,
  },
};

const GenePage = Relay.createContainer(GenePageComponent, GenePageQuery);

export default GenePage;
