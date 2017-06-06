// @flow
import React from "react";
import Relay from "react-relay/classic";
import { compose } from "recompose";
import JSURL from "jsurl";

import LocationSubscriber from "@ncigdc/components/LocationSubscriber";
import PieChart from "@ncigdc/components/Charts/PieChart";
import { Row, Column } from "@ncigdc/uikit/Flex";
import styled from "@ncigdc/theme/styled";
import type { TRawQuery } from "@ncigdc/utils/uri/types";
import type { TBucket } from "@ncigdc/components/Aggregations/types";
import withRouter from "@ncigdc/utils/withRouter";
import {
  mergeQuery,
  makeFilter,
  inCurrentFilters
} from "@ncigdc/utils/filters";
import { removeEmptyKeys, parseFilterParam } from "@ncigdc/utils/uri";

export type TProps = {
  push: Function,
  aggregations: {
    demographic__ethnicity: { buckets: [TBucket] },
    demographic__gender: { buckets: [TBucket] },
    demographic__race: { buckets: [TBucket] },
    diagnoses__vital_status: { buckets: [TBucket] },
    project__disease_type: { buckets: [TBucket] },
    project__primary_site: { buckets: [TBucket] },
    project__program__name: { buckets: [TBucket] },
    project__project_id: { buckets: [TBucket] }
  }
};

const toPieData = clickHandler => bucket => ({
  id: bucket.key,
  doc_count: bucket.doc_count,
  clickHandler,
  tooltip: (
    <span>
      <b>{bucket.key}</b><br />
      {bucket.doc_count.toLocaleString()} case{bucket.doc_count > 1 ? "s" : 0}
    </span>
  )
});

const ColumnCenter = styled(Column, {
  justifyContent: "center",
  alignItems: "center"
});

const RowCenter = styled(Row, {
  justifyContent: "space-around",
  alignItems: "center"
});

const PieTitle = styled.h4({
  color: ({ theme }) => theme.primary || "inherit"
});

function addFilter(query: Object, push: Function): Function {
  return (field, values) => {
    const newQuery = mergeQuery(
      {
        filters: makeFilter([
          { field, value: Array.isArray(values) ? values : [values] }
        ])
      },
      query,
      "toggle"
    );

    push({
      query: removeEmptyKeys({
        ...newQuery,
        filters: newQuery.filters && JSURL.stringify(newQuery.filters)
      })
    });
  };
}

const enhance = compose(withRouter);

const ExploreCasesChartsComponent = ({ aggregations, push }: TProps) => (
  <LocationSubscriber>
    {(ctx: {| pathname: string, query: TRawQuery |}) => {
      const clickHandler = addFilter(ctx.query, push);
      const currentFilters = (ctx.query &&
        parseFilterParam((ctx.query || {}).filters, {}).content) || [];
      const currentFieldNames = currentFilters.map(f => f.content.field);
      return (
        <RowCenter>
          <ColumnCenter>
            <PieTitle>Primary Sites</PieTitle>
            <PieChart
              data={aggregations.primary_site.buckets
                .filter(
                  bucket =>
                    currentFieldNames.includes("cases.primary_site")
                      ? inCurrentFilters({
                          key: bucket.key,
                          dotField: "cases.primary_site",
                          currentFilters
                        })
                      : true
                )
                .map(
                  toPieData(({ data }) =>
                    clickHandler("cases.primary_site", data.id)
                  )
                )}
              path="doc_count"
              height={125}
              width={125}
            />
          </ColumnCenter>
          <ColumnCenter>
            <PieTitle>Projects</PieTitle>
            <PieChart
              data={aggregations.project__project_id.buckets
                .filter(
                  bucket =>
                    currentFieldNames.includes("cases.project.project_id")
                      ? inCurrentFilters({
                          key: bucket.key,
                          dotField: "cases.project.project_id",
                          currentFilters
                        })
                      : true
                )
                .map(
                  toPieData(({ data }) =>
                    clickHandler("cases.project.project_id", data.id)
                  )
                )}
              path="doc_count"
              height={125}
              width={125}
            />
          </ColumnCenter>
          <ColumnCenter>
            <PieTitle>Disease Type</PieTitle>
            <PieChart
              data={aggregations.disease_type.buckets
                .filter(
                  bucket =>
                    currentFieldNames.includes("cases.disease_type")
                      ? inCurrentFilters({
                          key: bucket.key,
                          dotField: "cases.disease_type",
                          currentFilters
                        })
                      : true
                )
                .map(
                  toPieData(({ data }) =>
                    clickHandler("cases.disease_type", data.id)
                  )
                )}
              path="doc_count"
              height={125}
              width={125}
            />
          </ColumnCenter>
          <ColumnCenter>
            <PieTitle>Gender</PieTitle>
            <PieChart
              data={aggregations.demographic__gender.buckets
                .filter(
                  bucket =>
                    currentFieldNames.includes("cases.demographic.gender")
                      ? inCurrentFilters({
                          key: bucket.key,
                          dotField: "cases.demographic.gender",
                          currentFilters
                        })
                      : true
                )
                .map(
                  toPieData(({ data }) =>
                    clickHandler("cases.demographic.gender", data.id)
                  )
                )}
              path="doc_count"
              height={125}
              width={125}
            />
          </ColumnCenter>
          <ColumnCenter>
            <PieTitle>Vital Status</PieTitle>
            <PieChart
              data={aggregations.diagnoses__vital_status.buckets
                .filter(
                  bucket =>
                    currentFieldNames.includes("cases.diagnoses.vital_status")
                      ? inCurrentFilters({
                          key: bucket.key,
                          dotField: "cases.diagnoses.vital_status",
                          currentFilters
                        })
                      : true
                )
                .map(
                  toPieData(({ data }) =>
                    clickHandler("cases.diagnoses.vital_status", data.id)
                  )
                )}
              path="doc_count"
              height={125}
              width={125}
            />
          </ColumnCenter>
        </RowCenter>
      );
    }}
  </LocationSubscriber>
);

export const ExploreCasesChartsQuery = {
  fragments: {
    aggregations: () => Relay.QL`
      fragment on CaseAggregations {
        demographic__ethnicity {
          buckets {
            doc_count
            key
          }
        }
        demographic__gender {
          buckets {
            doc_count
            key
          }
        }
        demographic__race {
          buckets {
            doc_count
            key
          }
        }
        diagnoses__vital_status {
          buckets {
            doc_count
            key
          }
        }
        disease_type {
          buckets {
            doc_count
            key
          }
        }
        primary_site {
          buckets {
            doc_count
            key
          }
        }
        project__project_id {
          buckets {
            doc_count
            key
          }
        }
        project__program__name {
          buckets {
            doc_count
            key
          }
        }
      }
    `
  }
};

const ExploreCasesCharts = Relay.createContainer(
  enhance(ExploreCasesChartsComponent),
  ExploreCasesChartsQuery
);

export default ExploreCasesCharts;
