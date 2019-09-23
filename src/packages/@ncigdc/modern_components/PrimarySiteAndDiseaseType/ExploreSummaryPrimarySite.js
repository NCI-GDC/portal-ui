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
// import DoubleDonut from '@ncigdc/components/Charts/DoubleDonut';
import { Column, Row } from '@ncigdc/uikit/Flex';
import DownloadVisualizationButton from '@ncigdc/components/DownloadVisualizationButton';
import wrapSvg from '@ncigdc/utils/wrapSvg';
import DoubleRingChart from '@ncigdc/components/Charts/DoubleRingChart';
import Loader from '@ncigdc/uikit/Loaders/Loader';
import { capitalize } from '@ncigdc/utils/string';
import Spinner from '@ncigdc/uikit/Loaders/Material';
import { moaarColors, primarySiteColors } from './colourMap';

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
  // withState('libData', 'setLibData', {}),
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
      // setLibData,
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

      // structure for nivo library
      // const parsedLibData = {
      //   children: primarySites.map((primarySite, i) => {
      //     return {
      //       children: cases
      //         ? cases[`${getStringName(primarySite.key)}Aggs`].disease_type.buckets.map(bucket => {
      //           return {
      //             color: Color(primarySiteColors[primarySite.key] ||
      //             moaarColors[i]).lighten(0.3).rgbString(),
      //             count: bucket.doc_count,
      //             id: bucket.key,
      //           };
      //         })
      //       : [],
      //       color: primarySiteColors[primarySite.key] || moaarColors[i],
      //       id: primarySite.key,
      //     };
      //   }),
      //   id: 'Primary Sites',
      // };

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
      // setLibData(parsedLibData);
    }
  ),
);

const ExploreSummaryPrimarySite = ({
  arcData,
  isLoading,
  // libData,
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
            {/* <DoubleDonut
              arcData={libData}
              colors={Object.values(primarySiteColors)}
              loading={isLoading}
              /> */}
            <DoubleRingChart
              data={arcData}
              height={350}
              outerRingWidth={30}
              width={350}
              />
          </Column>
      ))}
      </Column>
    </Loader>
  );
};

export default enhance(ExploreSummaryPrimarySite);
