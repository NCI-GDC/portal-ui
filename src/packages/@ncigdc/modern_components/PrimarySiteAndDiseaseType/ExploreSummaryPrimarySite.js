import React from 'react';
import { compose, withPropsOnChange, withState } from 'recompose';
import { Sunburst } from '@nivo/sunburst';
import { parse } from 'query-string';
import Color from 'color';

import { parseFilterParam } from '@ncigdc/utils/uri';
import withRouter from '@ncigdc/utils/withRouter';
import { replaceFilters } from '@ncigdc/utils/filters';
import { theme } from '@ncigdc/theme';
import customGraphQL from '@ncigdc/utils/customGraphQL';

const getStringName = (name = '') => `${name.replace(/\s|,|-/g, '_')}`;

const primarySiteColors = {
  Breast: '#ED2891',
  Colon: '#9467bd',
  Kidney: '#2ca02c',
  'Lymph Nodes': '#3953A4',
  Pancreas: '#e17ac1',
  Skin: '#BBD642',
  Unknown: '#ff7f0e',
};

const getDiseaseTypeBySite = (async ({
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

  const body = JSON.stringify({
    query: `
    query DiseaseTypeByPrimarySite_relayQuery(${
      primarySites.map(site => `$${getStringName(site)}Filters: FiltersArgument`).join(' ')
    }) {
      viewer {
        explore {
          cases {
            ${primarySites.map(site => {
      return `${getStringName(site)}Aggs: aggregations(filters: $${getStringName(site)}Filters) {
                disease_type {
                  buckets {
                    key
                    doc_count
                  }
                }
              }`;
    })}
          }
        }
      }
    }
    `,
    variables,
  });

  const data = await customGraphQL({
    body,
    component: 'DiseaseTypeByPrimarySite',
  });
  return data;
});

const enhance = compose(
  withRouter,
  withState('arcData', 'setArcData', {}),
  withPropsOnChange(
    ['location'],
    async ({
      defaultFilters = null,
      location: { search },
      setArcData,
      viewer: {
        explore: {
          cases: {
            aggregations,
          },
        },
      },
    }) => {
      const q = parse(search);
      const filters = parseFilterParam(q.filters, defaultFilters);

      const primarySites = (aggregations && aggregations.primary_site.buckets);

      const data = await getDiseaseTypeBySite({
        filters,
        primarySites: primarySites.map(p => p.key),
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
                  id: bucket.key,
                  size: bucket.doc_count,
                // cases: `${bucket.doc_count} Cases`,
                };
              })
            : [],
            color: primarySiteColors[primarySite.key] || theme.primaryLight1,
            id: primarySite.key,
            // size: primarySite.doc_count,
          };
        }),
        id: 'Primary Sites',
      };
      setArcData(parsedData);
    }
  )
);

const ExploreSummaryPrimarySite = ({
  arcData,
}) => {
  return (
    <div>
      <Sunburst
        borderColor="white"
        borderWidth={0.5}
        childColor="noinherit"
        colorBy={data => data.color}
        colors={Object.values(primarySiteColors)}
        data={arcData}
        height={400}
        identity="id"
        margin={{
          bottom: 20,
          left: 20,
          right: 20,
          top: 20,
        }}
        value="size"
        width={400}
        />
    </div>
  );
};

export default enhance(ExploreSummaryPrimarySite);
