import React from 'react';
import { compose, withPropsOnChange, withState } from 'recompose';
import { Sunburst } from 'nivo';
import { parse } from 'query-string';
import { fetchQuery, graphql } from 'relay-runtime';

import { API, IS_AUTH_PORTAL } from '@ncigdc/utils/constants';
import md5 from 'blueimp-md5';
import urlJoin from 'url-join';
import _ from 'lodash';

import consoleDebug from '@ncigdc/utils/consoleDebug';
import { redirectToLogin } from '@ncigdc/utils/auth';

import environment from '@ncigdc/modern_components/environment';
import { parseFilterParam } from '@ncigdc/utils/uri';
import withRouter from '@ncigdc/utils/withRouter';
import { withTheme } from '@ncigdc/theme';
import { replaceFilters } from '@ncigdc/utils/filters';
// import withData from './DiseaseTypeByPrimarySite.relay';

const arrghData = {
  name: 'Primary Sites',
  children: [
    {
      name: 'Breast',
      children: [
        {
          name: 'Disease type 1',
          size: 3,
        },
        {
          name: 'Disease type 2',
          size: 10,
        },
        {
          name: 'Disease type 3',
          size: 55,
        },
      ],
    },
    {
      name: 'Bronchus and lung',
      children: [
        {
          name: 'Disease type 1',
          size: 500,
        },
        {
          name: 'Disease type 2',
          size: 25,
        },
      ],
    },
    {
      name: 'Stomach',
      children: [
        {
          name: 'Disease type 1',
          size: 112,
        },
        {
          name: 'Disease type 2',
          size: 5,
        },
      ],
    },
  ],
};

const getStringName = (name = '') => `${name.replace(/\s|,|-/g, '_')}`;

const getDiseaseTypeBySite = (({
  filters,
  primarySites,
}) => {
  const variables = primarySites.reduce((acc, site) => {
    const siteFilter = {
      [`${getStringName(site)}Filters`]: replaceFilters({
        op: 'and',
        content: [
          {
            op: 'in',
            content: {
              field: 'cases.primary_site',
              value: [site],
            },
          },
        ],
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

  const hash = md5(body);

  return fetch(
    urlJoin(API, `graphql/DiseaseTypeByPrimarySiteQuery?hash=${hash}`),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    }
  ).then(response => response
    .json()
    .then(json => {
      if (!response.ok) {
        consoleDebug('throwing error in Environment');
        throw response;
      }

      // if (response.status === 200) {
      //   simpleAggCache[hash] = json;
      //   delete pendingAggCache[hash];
      // }

      return json;
    })
    .catch(err => {
      if (err.status) {
        switch (err.status) {
          case 401:
          case 403:
            consoleDebug(err.statusText);
            if (IS_AUTH_PORTAL) {
              return redirectToLogin('timeout');
            }
            break;
          case 400:
          case 404:
            consoleDebug(err.statusText);
            break;
          default:
            return consoleDebug(`Default error case: ${err.statusText}`);
        }
      } else {
        consoleDebug(
          `Something went wrong in the environment, but no error status: ${err}`
        );
      }
    }));
});

const enhance = compose(
  withTheme,
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
      // const variables = {
      //   variables: {
      //     filters: replaceFilters({
      //       op: 'and',
      //       content: [
      //         {
      //           op: 'in',
      //           content: {
      //             field: 'cases.primary_site',
      //             value: primarySites,
      //           },
      //         },
      //       ],
      //     }, filters),
      //   },
      // };

      const data = await getDiseaseTypeBySite({
        filters,
        primarySites: primarySites.map(p => p.key),
      });

      // const data = await fetchQuery(environment, diseaseTypeQuery, variables);
      // console.log(data);

      const colors = {
        Breast: '#1f77b4',
        Unknown: '#ff7f0e',
        Colon: '#9467bd',
        Kidney: '#2ca02c',
        Pancreas: 'pink',
      };
      const { data: { viewer: { explore: { cases } } } } = data;
      const foo = {
        name: 'Primary Sites',
        children: primarySites.map(primarySite => {
          return {
            name: primarySite.key,
            children: cases ? cases[`${getStringName(primarySite.key)}Aggs`].disease_type.buckets.map(bucket => {
              return {
                name: bucket.key,
                // color: 'hsl(176,100%,33%)',
                size: bucket.doc_count,
              };
            }) : [],
            color: colors[primarySite.key],
            // size: primarySite.doc_count,
          };
        }),
      };
      setArcData(foo);
    }
  )
);

const ExploreSummaryPrimarySite = ({
  arcData,
  ...props
}) => {
  console.log(arcData);

  return (
    <div>
      <Sunburst
        borderColor="white"
        borderWidth={1}
        // childColor={{ from: 'hsl(176,100%,33%)' }}
        // colors={[
        //   '#1f77b4',
        //   '#ff7f0e',
        //   '#9467bd',
        //   '#2ca02c',
        // ]}
        data={arcData}
        height={400}
        identity="name"
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
