// @flow

import React from 'react';
import Relay from 'react-relay/classic';
import { compose, withState } from 'recompose';
import { makeFilter, addInFilters } from '@ncigdc/utils/filters';
import TogglableUl from '@ncigdc/uikit/TogglableUl';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';

const ProjectBreakdownComponent = compose(
  withState('loading', 'setLoading', false)
)(({
  loading,
  setLoading,
  explore: { cases },
  caseTotal,
  relay,
  filters,
}) => {
  const allAggs = !cases.allAggs ? {} : cases.allAggs.project__project_id.buckets.reduce((acc, b) => ({
    ...acc,
    [b.key]: b.doc_count,
  }), {});

  const filteredAggs = !cases.aggregations ? {} : cases.aggregations.project__project_id.buckets.reduce((acc, b) => ({
    ...acc,
    [b.key]: b.doc_count,
  }), {});

  return (
    <TogglableUl
      onToggle={() => {
        relay.setVariables({
          fetchData: true,
          aggFilters: filters,
        });
        setLoading(l => !l);
      }}
      items={[
        <span key="total">
          <ExploreLink
            query={{
              searchTableTab: 'cases',
              filters,
            }}
          >
            {caseTotal.toLocaleString()}
          </ExploreLink>
          <span> / </span>
          <ExploreLink
            query={{
              searchTableTab: 'cases',
              filters: makeFilter([
                { field: 'cases.available_variation_data', value: ['ssm'] },
              ], false),
            }}
          >
            {cases.hits.total.toLocaleString()}
          </ExploreLink>
        </span>,
        ...(loading && !cases.aggregations && [<i className="fa fa-spinner fa-spin" />]),
        ...Object.entries(filteredAggs)
          .sort(([ak, av], [bk, bv]) => (bv / allAggs[bk]) - (av / allAggs[ak]))
          .map(([k, v]) => (
            <span key={k}>
              <span>{k}: </span>
              <ExploreLink
                query={{
                  searchTableTab: 'cases',
                  filters: addInFilters(
                    filters,
                    makeFilter([
                      { field: 'cases.project.project_id', value: [k] },
                    ], false)
                  ),
                }}
              >
                {v}
              </ExploreLink>
              <span> / </span>
              <ExploreLink
                query={{
                  searchTableTab: 'cases',
                  filters: makeFilter([
                    { field: 'cases.available_variation_data', value: ['ssm'] },
                    { field: 'cases.project.project_id', value: [k] },
                  ], false),
                }}
              >
                {allAggs[k]}
              </ExploreLink>
              <span>&nbsp;({((v / allAggs[k]) * 100).toFixed(2)}%)</span>
            </span>
          )),
      ]}
    />
  );
});

export const ProjectBreakdownQuery = {
  initialVariables: {
    fetchData: false,
    aggFilters: null,
    ssmTested: makeFilter([{
      field: 'cases.available_variation_data',
      value: 'ssm',
    }], false),
  },
  fragments: {
    explore: () => Relay.QL`
      fragment on Explore {
        cases {
          hits(first: 0 filters: $ssmTested) { total }
          allAggs: aggregations(filters: $ssmTested) {
            project__project_id {
              buckets {
                doc_count
                key
              }
            }
          }
          aggregations(filters: $aggFilters) @include(if: $fetchData) {
            project__project_id {
              buckets {
                doc_count
                key
              }
            }
          }
        }
      }
    `,
  },
};

const ProjectBreakdown = Relay.createContainer(
  ProjectBreakdownComponent,
  ProjectBreakdownQuery
);

export default ProjectBreakdown;
