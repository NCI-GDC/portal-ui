/* @flow */

import React from 'react';
import { parse } from 'query-string';
import { Row, Column } from '@ncigdc/uikit/Flex';
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
import Heading from '@ncigdc/uikit/Heading';
import { parseJSONParam } from '@ncigdc/utils/uri';
import Exists from '@ncigdc/modern_components/Exists';

export default ({ match, geneId = match.params.id, location }: Object) => {
  const { filters: f } = parse(location.search);
  const filters = parseJSONParam(f, f);

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
            value: ['ssm', 'cna'],
          },
        },
      ],
    },
    geneFilter,
  );

  return (
    <Exists type="Gene" id={geneId}>
      <FullWidthLayout title={<GeneSymbol geneId={geneId} />} entityType="GN">
        <Column spacing="2rem">
          {filters && <CurrentFilters />}
          <Row spacing="2rem">
            <Row flex="1">
              <GeneSummary geneId={geneId} />
            </Row>
            <Row flex="1">
              <GeneExternalReferences geneId={geneId} />
            </Row>
          </Row>
          <Column style={{ backgroundColor: 'white' }} id="cancer-distribution">
            <Row style={{ padding: '1rem 1rem 2rem', alignItems: 'center' }}>
              <Heading>
                <ChartIcon style={{ marginRight: '1rem' }} />
                Cancer Distribution
              </Heading>
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
                style={{ width: '100%' }}
              />
              <CancerDistributionTable
                filters={mutatedGeneFilter}
                entityName={<GeneSymbol geneId={geneId} />}
                geneId={geneId}
              />
            </Column>
          </Column>
          <Column style={{ backgroundColor: 'white', marginTop: '2rem' }}>
            <GeneLolliplot geneId={geneId} />
          </Column>
          <Column style={{ backgroundColor: 'white', marginTop: '2rem' }}>
            <Row style={{ padding: '1rem 1rem 2rem', alignItems: 'center' }}>
              <Heading id="frequent-mutations">
                <ChartIcon style={{ marginRight: '1rem' }} />
                Most Frequent Somatic Mutations
              </Heading>
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
                context={<GeneSymbol geneId={geneId} />}
                hideSurvival
              />
            </Column>
          </Column>
        </Column>
      </FullWidthLayout>
    </Exists>
  );
};
