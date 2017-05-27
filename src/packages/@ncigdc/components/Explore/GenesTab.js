// @flow
import React from "react";
import JSURL from "jsurl";
import {
  compose,
  withState,
  withProps,
  withPropsOnChange,
  withHandlers
} from "recompose";
import { Row, Column } from "@ncigdc/uikit/Flex";
import { getDefaultCurve } from "@ncigdc/utils/survivalplot";
import withFilters from "@ncigdc/utils/withFilters";
import SurvivalPlotWrapper from "@ncigdc/components/SurvivalPlotWrapper";
import FrequentlyMutatedGenesChart
  from "@ncigdc/containers/FrequentlyMutatedGenesChart";
import FrequentlyMutatedGenesTable
  from "@ncigdc/containers/FrequentlyMutatedGenesTable";
import { makeFilter, toggleFilters } from "@ncigdc/utils/filters";

const styles = {
  heading: {
    flexGrow: 1,
    fontSize: "2rem",
    marginBottom: 7,
    marginTop: 7
  },
  card: {
    backgroundColor: "white"
  }
};

const initialState = {
  loading: true
};

export default compose(
  withFilters(),
  withState("defaultSurvivalData", "setDefaultSurvivalData", {}),
  withState("selectedSurvivalData", "setSelectedSurvivalData", {}),
  withState("state", "setState", initialState),
  withProps(
    ({
      selectedSurvivalData,
      defaultSurvivalData,
      setDefaultSurvivalData,
      setSelectedSurvivalData,
      filters,
      setState
    }) => ({
      survivalData: {
        legend: selectedSurvivalData.legend || defaultSurvivalData.legend,
        rawData: selectedSurvivalData.rawData || defaultSurvivalData.rawData
      },
      updateData: async () => {
        const survivalData = await getDefaultCurve({
          currentFilters: filters,
          slug: "Explore"
        });

        setDefaultSurvivalData(survivalData);
        setSelectedSurvivalData({});

        setState(s => ({
          ...s,
          loading: false
        }));
      }
    })
  ),
  withPropsOnChange(["filters"], ({ updateData }) => {
    updateData();
  }),
  withHandlers({
    handleClickGene: ({ push, query, filters }) => gene => {
      const newFilters = toggleFilters(
        filters,
        makeFilter([{ field: "genes.gene_id", value: [gene.gene_id] }], false)
      );
      push({
        pathname: "/exploration",
        query: {
          ...query,
          filters: JSURL.stringify(newFilters)
        }
      });
    }
  })
)(
  ({
    state: { loading },
    survivalData,
    selectedSurvivalData,
    setSelectedSurvivalData,
    viewer,
    filters,
    handleClickGene
  }) => {
    return (
      <Column style={styles.card}>
        <h1 style={{ ...styles.heading, padding: "1rem" }} id="mutated-genes">
          <i className="fa fa-bar-chart-o" style={{ paddingRight: "10px" }} />
          Genes
        </h1>
        <Column>
          <Row>
            <Column flex="none" style={{ width: "50%" }}>
              <FrequentlyMutatedGenesChart
                explore={viewer.frequentlyMutatedGenesChartFragment}
                defaultFilters={filters}
                onClickGene={handleClickGene}
              />
            </Column>
            <Column flex="none" style={{ width: "50%" }}>
              <SurvivalPlotWrapper
                {...survivalData}
                onReset={() => setSelectedSurvivalData({})}
                height={240}
                survivalPlotloading={loading}
              />
            </Column>
          </Row>
          <FrequentlyMutatedGenesTable
            defaultFilters={filters}
            survivalData={survivalData}
            setSelectedSurvivalData={setSelectedSurvivalData}
            selectedSurvivalData={selectedSurvivalData}
            explore={viewer.frequentlyMutatedGenesTableFragment}
            projectBreakdown={viewer.projectBreakdownFragment}
            context="Cohort"
          />
        </Column>
      </Column>
    );
  }
);
