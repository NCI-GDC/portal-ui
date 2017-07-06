/* @flow */

import React from 'react';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Route from 'react-router/Route';
import GeneSummary from '@ncigdc/modern_components/GeneSummary';
import GeneExternalReferences from '@ncigdc/modern_components/GeneExternalReferences';
import CancerDistributionBarChart from '@ncigdc/modern_components/CancerDistributionBarChart';
import CancerDistributionTable from '@ncigdc/modern_components/CancerDistributionTable';
import SsmsTable from '@ncigdc/modern_components/SsmsTable';
import { GeneLolliplot } from '@ncigdc/modern_components/Lolliplot';
import FullWidthLayout from '@ncigdc/components/Layouts/FullWidthLayout';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import CurrentFilters from '@ncigdc/components/CurrentFilters';
import ChartIcon from '@ncigdc/theme/icons/BarChart';
import GdcDataIcon from '@ncigdc/theme/icons/GdcData';
import { replaceFilters } from '@ncigdc/utils/filters';
import GeneSymbol from '@ncigdc/modern_components/GeneSymbol';

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

export default (
  <Route
    path="/genes/:id"
    component={({ match, geneId = match.params.id, filters }) => {
      const geneFilter = replaceFilters(
        {
          op: 'and',
          content: [
            {
              op: 'in',
              content: { field: 'genes.gene_id', value: [geneId] },
            },
          ],
        },
        filters,
      );

      const mutatedGeneFilter = replaceFilters(
        {
          op: 'and',
          content: [
            {
              op: 'in',
              content: {
                field: 'cases.available_variation_data',
                value: ['ssm'],
              },
            },
          ],
        },
        geneFilter,
      );

      return (
        <FullWidthLayout title={<GeneSymbol geneId={geneId} />} entityType="GN">
          <Column spacing="2rem">
            {filters && <CurrentFilters />}
            <Row spacing="2rem">
              <Row flex="1"><GeneSummary geneId={geneId} /></Row>
              <Row flex="1">
                <GeneExternalReferences geneId={geneId} />
              </Row>
            </Row>
            <Column style={styles.card} id="cancer-distribution">
              <Row style={{ padding: '1rem 1rem 2rem', alignItems: 'center' }}>
                <h1 style={{ ...styles.heading }}>
                  <ChartIcon style={{ marginRight: '1rem' }} />
                  Cancer Distribution
                </h1>
                <ExploreLink
                  query={{
                    searchTableTab: 'cases',
                    filters: mutatedGeneFilter,
                  }}
                >
                  <GdcDataIcon /> Open in Exploration
                </ExploreLink>
              </Row>
              <Column>
                <CancerDistributionBarChart
                  filters={mutatedGeneFilter}
                  style={{ width: '50%' }}
                />
                <CancerDistributionTable
                  filters={mutatedGeneFilter}
                  entityName={'GET SYMBOL'}
                  geneId={geneId}
                />
              </Column>
            </Column>

            {/* <Column style={{ ...styles.card, marginTop: '2rem' }}>
              <GeneLolliplot geneId={geneId} />}
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
                  context={'props.node.symbol'}
                />
              </Column>
            </Column> */}
          </Column>
        </FullWidthLayout>
      );
    }}
  />
);
