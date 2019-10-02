import React from 'react';
import {
  compose, withProps, withPropsOnChange, withState,
} from 'recompose';
import Color from 'color';
import { isEmpty, isEqual } from 'lodash';
import { scaleOrdinal, schemeCategory20 } from 'd3';

import withRouter from '@ncigdc/utils/withRouter';
import { replaceFilters } from '@ncigdc/utils/filters';
import customGraphQL from '@ncigdc/utils/customGraphQL';
import { withTheme } from '@ncigdc/theme';
import { Column, Row } from '@ncigdc/uikit/Flex';
import DownloadVisualizationButton from '@ncigdc/components/DownloadVisualizationButton';
import wrapSvg from '@ncigdc/utils/wrapSvg';
import DoubleRingChart from '@ncigdc/components/Charts/DoubleRingChart';
import Loader from '@ncigdc/uikit/Loaders/Loader';
import { capitalize } from '@ncigdc/utils/string';
import { HUMAN_BODY_SITES_MAP } from '@ncigdc/utils/constants';
import colors from './colorMap';

const secondaryColors = scaleOrdinal(schemeCategory20);

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
  withState('arcData', 'setArcData', []),
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
    (props, nextProps) => !(isEqual(props.filters, nextProps.filters)),
    async ({
      setArcData,
      setIsLoading,
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

      // map through all the diseaseType buckets
      // add applicable doc_count to existing Types
      // append new types as needed

      // this can use some cleanup
      const parsedData = primarySites.reduce((acc, primarySite, i) => {
        const lowerCaseSite = (primarySite.key || '').toLowerCase();
        const humanBodyMatch = HUMAN_BODY_SITES_MAP[lowerCaseSite] || lowerCaseSite;
        const currentIndex = acc.findIndex(site => site.key === humanBodyMatch);

        if (currentIndex >= 0) {
          const currentItem = acc[currentIndex];
          const diseaseTypes = cases
            ? cases[`${getStringName(primarySite.key)}Aggs`].disease_type.buckets.reduce((dTypeAcc, bucket) => {
              const currentDiseaseTypeIndex = currentItem.outer
                .find(dType => dType.key === bucket.key);

              if (currentDiseaseTypeIndex >= 0) {
                const currentDiseaseType = dTypeAcc[currentDiseaseTypeIndex];
                return [
                  ...dTypeAcc.slice(0, currentDiseaseTypeIndex),
                  {
                    ...currentDiseaseType,
                    tooltip: <DiseaseTypeTooltip
                      diseaseType={{
                        key: bucket.key,
                        doc_count: currentDiseaseType.doc_count + bucket.doc_count,
                      }}
                      primarySite={{
                        key: humanBodyMatch,
                      }}
                      />,
                    value: currentDiseaseType.value + bucket.doc_count,
                  },
                  ...dTypeAcc.slice(currentDiseaseTypeIndex + 1, Infinity),
                ];
              }
              return [
                ...dTypeAcc,
                {
                  clickHandler: () => null,
                  color: Color(colors[humanBodyMatch] ||
                  secondaryColors[i]).lighten(0.3).rgbString(),
                  id: `${humanBodyMatch}-${bucket.key}`,
                  key: bucket.key,
                  tooltip: <DiseaseTypeTooltip
                    diseaseType={bucket}
                    primarySite={{ key: humanBodyMatch }}
                    />,
                  value: bucket.doc_count,
                },
              ];
            }, [])
            : [];
          return [
            ...acc.slice(0, currentIndex),
            {
              ...currentItem,
              outer: [...currentItem.outer, ...diseaseTypes],
              tooltip: <PrimarySiteTooltip
                primarySite={{
                  doc_count: currentItem.value + primarySite.doc_count,
                  key: currentItem.key,
                }}
                />,
              value: currentItem.value + primarySite.doc_count,
            },
            ...acc.slice(currentIndex + 1, Infinity),
          ];
        }
        return [
          ...acc,
          {
            clickHandler: () => null,
            color: colors[humanBodyMatch] || secondaryColors[i],
            id: humanBodyMatch,
            key: humanBodyMatch,
            outer: cases
              ? cases[`${getStringName(primarySite.key)}Aggs`].disease_type.buckets.map(bucket => {
                return {
                  clickHandler: () => null,
                  color: Color(colors[humanBodyMatch] ||
                  secondaryColors[i]).lighten(0.3).rgbString(),
                  id: `${primarySite.key}-${bucket.key}`,
                  key: bucket.key,
                  tooltip: <DiseaseTypeTooltip
                    diseaseType={bucket}
                    primarySite={{
                      key: humanBodyMatch,
                      doc_count: primarySite.doc_count,
                    }}
                    />,
                  value: bucket.doc_count,
                };
              })
              : [],
            tooltip: <PrimarySiteTooltip
              primarySite={{
                key: humanBodyMatch,
                doc_count: primarySite.doc_count,
              }}
              />,
            value: primarySite.doc_count,
          },
        ];
      }, []);
      // console.log(parsedData);
      // possibly causing setState console error with update placement
      setArcData(parsedData, () => setIsLoading(false));
    }
  ),
);

// this is rendering multiple times, looks like something happening in the summary parent?
const ExploreSummaryPrimarySite = ({
  arcData,
  isLoading,
}) => {
  // download keys set in this order specifically
  const jsonData = arcData.map(d => ({
    key: d.key,
    doc_count: d.value,
    disease_types: d.outer.map(type => ({
      key: type.key,
      doc_count: type.value,
    })),
  }));

  const tsvData = jsonData.reduce((acc, item) => (
    [
      ...acc,
      ...item.disease_types.map(type => ({
        primary_site: item.key,
        primary_site_total: item.doc_count,
        disease_type: type.key,
        doc_count: type.doc_count,
      })),
    ]
  ), []);

  return (
    <Loader loading={isLoading}>
      <Column>
        <Row
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '0px 10px 10px',
          }}
          >
          <h3>Primary Sites & Disease Types</h3>
          <DownloadVisualizationButton
            data={jsonData}
            disabled={isLoading}
            noText
            slug="summary-primary-site-donut-chart"
            svg={() => wrapSvg({
              selector: '#summary-primary-site-donut svg',
              title: 'Primary Sites & Disease Types',
            })}
            tooltipHTML="Download image or data"
            tsvData={tsvData}
            />
        </Row>
        <Row
          style={{
            justifyContent: 'center',
          }}
          >
          {!isLoading && (
            isEmpty(arcData)
            ? (
              <Column
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                >
                No Data
              </Column>
          ) : (
            <Column id="summary-primary-site-donut" style={{ padding: '2rem 0rem 1rem' }}>
              <DoubleRingChart
                data={arcData}
                outerRingWidth={25}
                />
            </Column>
        ))}
        </Row>
      </Column>
    </Loader>
  );
};

export default enhance(ExploreSummaryPrimarySite);
