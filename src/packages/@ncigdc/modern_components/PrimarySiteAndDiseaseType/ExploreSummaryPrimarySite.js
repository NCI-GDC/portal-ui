import React from 'react';
import {
  compose, withProps, withPropsOnChange, withState,
} from 'recompose';
import Color from 'color';
import { isEmpty } from 'lodash';

import withRouter from '@ncigdc/utils/withRouter';
import { replaceFilters } from '@ncigdc/utils/filters';
import customGraphQL from '@ncigdc/utils/customGraphQL';
import { withTheme } from '@ncigdc/theme';
import DoubleDonut from '@ncigdc/components/Charts/DoubleDonut';
import { Column, Row } from '@ncigdc/uikit/Flex';
import DownloadVisualizationButton from '@ncigdc/components/DownloadVisualizationButton';
import wrapSvg from '@ncigdc/utils/wrapSvg';
import DoubleRingChart from '@ncigdc/components/Charts/DoubleRingChart';
import Loader from '@ncigdc/uikit/Loaders/Loader';
import { capitalize } from '@ncigdc/utils/string';

const primarySiteColors = {
  Breast: '#ED2891',
  Colon: '#9467bd',
  Kidney: '#2ca02c',
  'Lymph Nodes': '#3953A4',
  Pancreas: '#e17ac1',
  Skin: '#BBD642',
  Unknown: '#ff7f0e',
};
const moaarColors = [
  '#4f9e99',
  '#21827f',
  '#656bd7',
  '#4d52b0',
  '#783cb9',
  '#e9695f',
  '#d83933',
  '#c84281',
  '#e0699f',
  '#8168b3',
  '#a23737',
  '#6f3331',
  '#fb5a47',
  '#e52207',
  '#c05600',
  '#8b1303',
  '#5c1111',
  '#fc906d',
  '#ff580a',
  '#d24302',
  '#fa9441',
  '#2491ff',
  '#28a0cb',
  '#0d7ea2',
  '#3a7d95',
  '#e66f0e',
  '#8e704f',
  '#6b5947',
  '#ffbe2e',
  '#e5a000',
  '#c7a97b',
  '#ad8b65',
  '#b51d09',
  '#c2850c',
  '#28a0cb',
  '#0d7ea2',
  '#07648d',
  '#cbd17a',
  '#a6b557',
  '#ad79e9',
  '#7665d1',
  '#4a77b4',
  '#59b9de',
  '#8a984b',
  '#6f7a41',
  '#9bb672',
  '#6fbab3',
  '#8168b3',
  '#a23737',
  '#6f3331',
  '#fb5a47',
  '#e52207',
  '#c05600',
  '#8b1303',
  '#5c1111',
  '#fc906d',
  '#ff580a',
  '#d24302',
  '#fa9441',
  '#2491ff',
  '#28a0cb',
  '#0d7ea2',
  '#3a7d95',
  '#e66f0e',
  '#8e704f',
  '#6b5947',
  '#ffbe2e',
  '#e5a000',
];

const getStringName = (name = '') => `${name.replace(/\s|,|-/g, '_')}`;

const buildDiseaseTypeRequestBody = (({
  filters,
  primarySites,
}) => {
  const variables = primarySites.reduce((acc, site) => {
    const siteFilter = {
      [`${getStringName(site)}Filters`]: replaceFilters({
        content: [
          {
            content: {
              field: 'cases.primary_site',
              value: [site],
            },
            op: 'in',
          },
        ],
        op: 'and',
      }, filters),
    };
    return Object.assign(
      {},
      acc,
      siteFilter
    );
  }, {});

  return JSON.stringify({
    query: `
      query DiseaseTypeByPrimarySite_relayQuery(${
        primarySites.map(site => `$${getStringName(site)}Filters: FiltersArgument`).join(' ')
      }) {
        viewer {
          explore {
            cases {
              ${primarySites.map(site => `${getStringName(site)}Aggs: aggregations(filters: $${getStringName(site)}Filters) {
                    disease_type {
                      buckets {
                        key
                        doc_count
                      }
                    }
                  }`)}
            }
          }
        }
      }
    `,
    variables,
  });
});

const PrimarySiteTooltip = ({ primarySite }) => (
  <div>
    <h4
      style={{
        color: '#bf213a',
        margin: '0px 0px 5px',
      }}
      >
      {capitalize(primarySite.key)}
    </h4>
    <span style={{ fontSize: '1.2rem' }}>{`${primarySite.doc_count} Cases`}</span>
  </div>
);

const DiseaseTypeTooltip = ({ diseaseType, primarySite }) => (
  <div>
    <h4
      style={{
        color: '#bf213a',
        margin: '0px 0px 5px',
      }}
      >
      {capitalize(primarySite.key)}
    </h4>
    <span style={{ fontSize: '1.2rem' }}>{capitalize(diseaseType.key)}</span>
    <br />
    <span style={{ fontSize: '1.2rem' }}>{`${diseaseType.doc_count} Cases`}</span>
  </div>
);

const enhance = compose(
  withRouter,
  withTheme,
  withState('isLoading', 'setIsLoading', true),
  withState('arcData', 'setArcData', {}),
  withState('libData', 'setLibData', {}),
  withProps({
    updateData: async ({
      primarySites,
      setIsLoading,
      variables,
    }) => {
      setIsLoading(true);
      const body = buildDiseaseTypeRequestBody({
        filters: variables.filters,
        primarySites,
      });
      const data = await customGraphQL({
        body,
        component: 'DiseaseTypeByPrimarySite',
      });
      return data;
    },
  }),
  withPropsOnChange(
    ['viewer'],
    async ({
      setArcData,
      setIsLoading,
      setLibData,
      updateData,
      variables,
      viewer: {
        explore: {
          cases: {
            aggregations,
          },
        },
      },
    }) => {
      const primarySites = (aggregations && aggregations.primary_site.buckets);
      const data = await updateData({
        primarySites: primarySites.map(p => p.key),
        setIsLoading,
        variables,
      });

      const { data: { viewer: { explore: { cases } } } } = data;

      const parsedLibData = {
        children: primarySites.map((primarySite, i) => {
          return {
            children: cases
              ? cases[`${getStringName(primarySite.key)}Aggs`].disease_type.buckets.map(bucket => {
                return {
                  color: Color(primarySiteColors[primarySite.key] ||
                  moaarColors[i]).lighten(0.3).rgbString(),
                  count: bucket.doc_count,
                  id: bucket.key,
                };
              })
            : [],
            color: primarySiteColors[primarySite.key] || moaarColors[i],
            id: primarySite.key,
          };
        }),
        id: 'Primary Sites',
      };

      const parsedData = primarySites.map((primarySite, i) => {
        return {
          clickHandler: () => null,
          color: primarySiteColors[primarySite.key] || moaarColors[i],
          id: primarySite.key,
          key: primarySite.key,
          outer: cases
            ? cases[`${getStringName(primarySite.key)}Aggs`].disease_type.buckets.map(bucket => {
              return {
                clickHandler: () => null,
                color: Color(primarySiteColors[primarySite.key] ||
                moaarColors[i]).lighten(0.3).rgbString(),
                id: `${primarySite.key}-${bucket.key}`,
                key: bucket.key,
                tooltip: <DiseaseTypeTooltip diseaseType={bucket} primarySite={primarySite} />,
                value: bucket.doc_count,
              };
            })
            : [],
          tooltip: <PrimarySiteTooltip primarySite={primarySite} />,
          value: primarySite.doc_count,
        };
      });

      setArcData(parsedData, () => setIsLoading(false));
      setLibData(parsedLibData);
    }
  ),
);

const ExploreSummaryPrimarySite = ({
  arcData,
  isLoading,
  libData,
}) => {
  return (
    <Loader loading={isLoading}>
      <Column
        style={{
          padding: '1rem',
          width: '40%',
        }}
        >
        <Row
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          >
          <h3>Primary Sites & Disease Types</h3>
          <DownloadVisualizationButton
            noText
            slug="summary-primary-site-donut-chart"
            style={{ marginRight: '2rem' }}
            svg={() => wrapSvg({
              selector: '#summary-primary-site-donut svg',
              title: 'Primary Sites & Disease Types',
            })}
            tooltipHTML="Download image or data"
            />
        </Row>
        {
      isEmpty(arcData)
        ? <div>No Data</div>
        : (
          <Column id="summary-primary-site-donut" style={{ padding: '2rem 0rem 1rem' }}>
            <DoubleDonut
              arcData={libData}
              colors={Object.values(primarySiteColors)}
              loading={isLoading}
              />
            <DoubleRingChart
              data={arcData}
              height={300}
              outerRingWidth={30}
              width={300}
              />
          </Column>
        )
    }
      </Column>
    </Loader>
  );
};

export default enhance(ExploreSummaryPrimarySite);
