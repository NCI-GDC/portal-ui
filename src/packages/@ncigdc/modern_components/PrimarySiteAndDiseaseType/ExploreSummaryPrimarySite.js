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

const primarySiteColors = {
  Breast: '#ED2891',
  Colon: '#9467bd',
  Kidney: '#2ca02c',
  'Lymph Nodes': '#3953A4',
  Pancreas: '#e17ac1',
  Skin: '#BBD642',
  Unknown: '#ff7f0e',
};

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

const enhance = compose(
  withRouter,
  withTheme,
  withState('isLoading', 'setIsLoading', true),
  withState('arcData', 'setArcData', {}),
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
      theme,
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

      const parsedData = {
        children: primarySites.map(primarySite => {
          return {
            children: cases
              ? cases[`${getStringName(primarySite.key)}Aggs`].disease_type.buckets.map(bucket => {
                return {
                  color: Color(primarySiteColors[primarySite.key] ||
                  theme.primaryLight1).lighten(0.3).rgbString(),
                  count: bucket.doc_count,
                  id: bucket.key,
                // cases: `${bucket.doc_count} Cases`,
                };
              })
            : [],
            color: primarySiteColors[primarySite.key] || theme.primaryLight1,
            id: primarySite.key,
            // count: primarySite.doc_count,
          };
        }),
        id: 'Primary Sites',
      };

      setArcData(parsedData, () => setIsLoading(false));
    }
  ),
);

const ExploreSummaryPrimarySite = ({
  arcData,
  isLoading,
}) => (
    isEmpty(arcData)
      ? <div>No Data</div>
      : (
        <DoubleDonut
          arcData={arcData}
          colors={Object.values(primarySiteColors)}
          loading={isLoading}
          />
      )
);

export default enhance(ExploreSummaryPrimarySite);
