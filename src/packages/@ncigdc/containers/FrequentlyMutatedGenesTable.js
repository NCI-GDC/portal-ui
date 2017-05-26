// @flow

import React from "react";
import Relay from "react-relay/classic";
import withSize from "@ncigdc/utils/withSize";
import { isEqual } from "lodash";
import { scaleOrdinal, schemeCategory10 } from "d3";
import { compose, withState, withPropsOnChange } from "recompose";
import withRouter from "@ncigdc/utils/withRouter";
import { makeFilter, addInFilters } from "@ncigdc/utils/filters";
import Showing from "@ncigdc/components/Pagination/Showing";
import { parseIntParam, parseFilterParam } from "@ncigdc/utils/uri";
import GeneLink from "@ncigdc/components/Links/GeneLink";
import EntityPageHorizontalTable
  from "@ncigdc/components/EntityPageHorizontalTable";
import Loader from "@ncigdc/uikit/Loaders/Loader";
import { Row } from "@ncigdc/uikit/Flex";
import { Tooltip } from "@ncigdc/uikit/Tooltip";
import Button from "@ncigdc/uikit/Button";
import { tableToolTipHint } from "@ncigdc/theme/mixins";
import { SpinnerIcon } from "@ncigdc/theme/icons";
import Hidden from "@ncigdc/components/Hidden";
import Pagination from "@ncigdc/components/Pagination";
import SurvivalIcon from "@ncigdc/theme/icons/SurvivalIcon";
import { getSurvivalCurves } from "@ncigdc/utils/survivalplot";
import ProjectBreakdown from "@ncigdc/containers/ProjectBreakdown";
import MutationsCount from "@ncigdc/containers/MutationsCount";
import CosmicIcon from "@ncigdc/theme/icons/Cosmic";
import ExploreLink from "@ncigdc/components/Links/ExploreLink";
import { ForTsvExport } from "@ncigdc/components/DownloadTableToTsvButton";
import TableActions from "@ncigdc/components/TableActions";

const colors = scaleOrdinal(schemeCategory10);

const FrequentlyMutatedGenesTableComponent = compose(
  withRouter,
  withState("survivalLoadingId", "setSurvivalLoadingId", ""),
  withPropsOnChange(
    (props, nextProps) =>
      ["query", "defaultFilters"].some(
        propName => !isEqual(props[propName], nextProps[propName])
      ),
    ({ relay, query, defaultFilters }) => {
      relay.setVariables({
        fetchData: true,
        fmgTable_offset: parseIntParam(query.fmgTable_offset, 0),
        fmgTable_size: parseIntParam(
          query.fmgTable_size,
          relay.route.params.fmgTable_size || 10
        ),
        fmgTable_filters: parseFilterParam(
          query.fmgTable_filters,
          defaultFilters || null
        ),
        geneCaseFilter: addInFilters(
          query.fmgTable_filters || defaultFilters,
          makeFilter(
            [
              {
                field: "cases.available_variation_data",
                value: "ssm"
              }
            ],
            false
          )
        )
      });
      // PRTL-1153 relay vars set correctly but fragment not being resent after 'Clear' button clicked unless forceFetch
      relay.forceFetch();
    }
  ),
  withSize()
)(
  ({
    explore: { genes, filteredCases, ssms },
    defaultFilters,
    relay,
    setSurvivalLoadingId,
    survivalLoadingId,
    setSelectedSurvivalData,
    selectedSurvivalData,
    projectBreakdown,
    context,
    query,
    tableLink
  }) => {
    if (genes && !genes.hits.edges.length) {
      return <Row style={{ padding: "1rem" }}>No gene data found.</Row>;
    }

    const data = !genes ? [] : genes.hits.edges.map(x => x.node);
    const prefix = "genes";
    const totalGenes = genes ? genes.hits.total : 0;

    const tableData = data
      .map(g => ({
        ...g,
        name: (
          <div style={{ maxWidth: "230px", whiteSpace: "normal" }}>
            {g.name}
          </div>
        ),
        symbol: <GeneLink uuid={g.gene_id}>{g.symbol}</GeneLink>,
        cytoband: (g.cytoband || []).join(", "),
        filteredCases: (
          <span>
            <ExploreLink
              merge
              query={{
                searchTableTab: "cases",
                filters: addInFilters(
                  query.fmgTable_filters || defaultFilters,
                  makeFilter(
                    [{ field: "genes.gene_id", value: [g.gene_id] }],
                    false
                  )
                )
              }}
            >
              {(g.numCases || 0).toLocaleString()}
            </ExploreLink>
            <span> / </span>
            <ExploreLink
              query={{
                searchTableTab: "cases",
                filters: addInFilters(
                  query.fmgTable_filters || defaultFilters,
                  makeFilter(
                    [
                      {
                        field: "cases.available_variation_data",
                        value: ["ssm"]
                      }
                    ],
                    false
                  )
                )
              }}
            >
              {(filteredCases.hits.total || 0).toLocaleString()}
            </ExploreLink>
            <span
            >{` (${((g.numCases || 0) / filteredCases.hits.total * 100).toFixed(2)}%)`}</span>
          </span>
        ),
        projectBreakdown: (
          <ProjectBreakdown
            filters={makeFilter(
              [{ field: "genes.gene_id", value: g.gene_id }],
              false
            )}
            explore={projectBreakdown}
            caseTotal={g.case.hits.total}
          />
        ),
        num_mutations: React.createElement(
          MutationsCount,
          {
            key: g.gene_id,
            ssms,
            filters: addInFilters(
              defaultFilters,
              makeFilter(
                [{ field: "genes.gene_id", value: [g.gene_id] }],
                false
              )
            )
          },
          null
        ),
        annotations: g.is_cancer_gene_census &&
          <span>
            <Tooltip Component="Cancer Gene Census">
              <CosmicIcon width={"20px"} height={"16px"} />
            </Tooltip>
            <ForTsvExport>
              Cancer Gene Census
            </ForTsvExport>
          </span>,
        survival_plot: (
          <Tooltip Component={`Click icon to plot ${g.symbol}`}>
            <Button
              style={{
                padding: "2px 3px",
                backgroundColor: colors(
                  selectedSurvivalData.id === g.symbol ? 1 : 0
                ),
                color: "white",
                margin: "0 auto"
              }}
              onClick={() => {
                if (g.symbol !== selectedSurvivalData.id) {
                  setSurvivalLoadingId(g.symbol);
                  getSurvivalCurves({
                    field: "gene.symbol",
                    value: g.symbol,
                    currentFilters: defaultFilters
                  }).then(data => {
                    setSelectedSurvivalData(data);
                    setSurvivalLoadingId("");
                  });
                } else {
                  setSelectedSurvivalData({});
                }
              }}
            >
              {survivalLoadingId === g.symbol
                ? <SpinnerIcon />
                : <SurvivalIcon />}
              <Hidden>add to survival plot</Hidden>
            </Button>
          </Tooltip>
        )
      }))
      // NOTE: manual sort is required because relay does not return items from cache ordered by score (PRTL-1041)
      .sort((a, b) => b.numCases - a.numCases);

    return (
      <Loader loading={!genes} height="387px">
        <Row
          style={{
            backgroundColor: "white",
            padding: "1rem",
            justifyContent: "space-between",
            alignItems: "flex-end"
          }}
        >
          <Showing
            docType="genes"
            prefix={"fmgTable"}
            params={relay.route.params}
            total={totalGenes}
          />
          <Row style={{ alignItems: "flex-end" }}>
            {tableLink}
            <TableActions
              currentFilters={query.fmgTable_filters || defaultFilters}
              style={{ marginLeft: "2rem" }}
              prefix={prefix}
              total={totalGenes}
              endpoint={prefix}
              downloadFields={[
                "symbol",
                "name",
                "cytoband",
                "biotype",
                "gene_id",
                "is_cancer_gene_census"
              ]}
              tsvSelector="#frequently-mutated-genes-table"
              tsvFilename="frequently-mutated-genes.tsv"
            />
          </Row>
        </Row>
        <EntityPageHorizontalTable
          tableId="frequently-mutated-genes-table"
          headings={[
            { key: "symbol", title: "Symbol" },
            { key: "name", title: "Name" },
            { key: "cytoband", title: "Cytoband" },
            { key: "biotype", title: "Type" },
            {
              key: "filteredCases",
              title: (
                <Tooltip
                  Component={
                    <span>
                      Breakdown of Affected Cases in {context} <br />
                      # of Cases where Gene is <br />mutated /# SSM tested Cases
                    </span>
                  }
                  style={tableToolTipHint()}
                >
                  # Affected Cases<br />in {context}
                </Tooltip>
              )
            },
            {
              key: "projectBreakdown",
              title: (
                <Tooltip
                  Component={
                    <span>
                      # of Cases where Gene contains SSM<br />
                      / # SSM tested Cases portal wide<br />
                      Expand to see breakdown by project
                    </span>
                  }
                  style={tableToolTipHint()}
                >
                  # Affected Cases<br /> Across the GDC
                </Tooltip>
              )
            },
            {
              key: "num_mutations",
              tdStyle: { textAlign: "right" },
              title: (
                <Tooltip
                  Component={<span># of SSM in the Gene in {context}</span>}
                  style={tableToolTipHint()}
                >
                  # Mutations
                </Tooltip>
              )
            },
            {
              key: "annotations",
              title: "Annotations",
              tdStyle: { textAlign: "center", padding: "5px 0 0 0" }
            },
            {
              title: <span>Survival <br />Analysis</span>,
              key: "survival_plot",
              style: { textAlign: "center", width: "100px" }
            }
          ]}
          data={tableData}
        />
        <Pagination
          prefix={"fmgTable"}
          params={relay.route.params}
          total={!genes ? 0 : genes.hits.total}
        />
      </Loader>
    );
  }
);

export const FrequentlyMutatedGenesTableQuery = {
  initialVariables: {
    fetchData: false,
    fmgTable_filters: null,
    fmgTable_size: 10,
    fmgTable_offset: 0,
    score: "case.project.project_id",
    geneCaseFilter: null,
    ssmTested: makeFilter(
      [
        {
          field: "cases.available_variation_data",
          value: "ssm"
        }
      ],
      false
    )
  },
  fragments: {
    explore: () => Relay.QL`
      fragment on Explore {
        ssms {
          ${MutationsCount.getFragment("ssms")}
        }
        x: cases { hits(first: 0) { total }}
        filteredCases: cases @include(if: $fetchData) {
          hits(first: 0 filters: $geneCaseFilter) {
            total
          }
        }
        genes @include(if: $fetchData) {
          hits (
            first: $fmgTable_size
            offset: $fmgTable_offset
            filters: $fmgTable_filters
            score: $score
          ) {
            total
            edges {
              node {
                numCases: score
                symbol
                name
                cytoband
                biotype
                gene_id
                is_cancer_gene_census
                case {
                  hits(first: 0 filters: $ssmTested) {
                    total
                  }
                }
              }
            }
          }
        }
      }
    `
  }
};

const FrequentlyMutatedGenesTable = Relay.createContainer(
  FrequentlyMutatedGenesTableComponent,
  FrequentlyMutatedGenesTableQuery
);

export default FrequentlyMutatedGenesTable;
