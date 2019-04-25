// @flow
import React from 'react';
import {
  compose, withState, withProps, withHandlers,
} from 'recompose';

import { Column, Row } from '@ncigdc/uikit/Flex';
import { getDefaultCurve, enoughData } from '@ncigdc/utils/survivalplot';
import withFilters from '@ncigdc/utils/withFilters';
import { makeFilter, toggleFilters } from '@ncigdc/utils/filters';
import SsmsTable from '@ncigdc/modern_components/SsmsTable';
import SurvivalPlotWrapper from '@ncigdc/components/SurvivalPlotWrapper';
import { stringifyJSONParam } from '@ncigdc/utils/uri';
import removeEmptyKeys from '@ncigdc/utils/removeEmptyKeys';
import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';

const styles = {
  heading: {
    flexGrow: 1,
    fontSize: '2rem',
    marginBottom: 7,
    marginTop: 7,
  },
  card: {
    backgroundColor: 'white',
  },
};

const initialState = {
  loading: true,
};

export default compose(
  withFilters(),
  withState('defaultSurvivalData', 'setDefaultSurvivalData', {}),
  withState('selectedSurvivalData', 'setSelectedSurvivalData', {}),
  withState('state', 'setState', initialState),
  withProps(
    ({
      selectedSurvivalData,
      defaultSurvivalData,
      setDefaultSurvivalData,
      setSelectedSurvivalData,
      filters,
      setState,
    }) => ({
      survivalData: {
        legend: selectedSurvivalData.legend || defaultSurvivalData.legend,
        rawData: selectedSurvivalData.rawData || defaultSurvivalData.rawData,
      },
      updateData: async () => {
        const survivalData = await getDefaultCurve({
          currentFilters: filters,
          slug: 'Explore',
        });

        setDefaultSurvivalData(survivalData);
        setSelectedSurvivalData({});

        setState(s => ({
          ...s,
          loading: false,
        }));
      },
    })
  ),
  withPropsOnChange(['filters'], ({ updateData }) => {
    updateData();
  }),
  withHandlers({
    handleClickMutation: ({ push, query, filters }) => ssm => {
      const newFilters = toggleFilters(
        filters,
        makeFilter([
          {
            field: 'ssms.ssm_id',
            value: [ssm.ssm_id],
          },
        ])
      );
      push({
        pathname: '/exploration',
        query: removeEmptyKeys({
          ...query,
          filters: newFilters && stringifyJSONParam(newFilters),
        }),
      });
    },
  })
)(
  ({
    viewer,
    filters,
    survivalData,
    defaultSurvivalData,
    selectedSurvivalData,
    setSelectedSurvivalData,
    handleClickMutation,
  }) => (
    <Column style={styles.card}>
      <h1
        id="mutated-genes"
        style={{
          ...styles.heading,
          padding: '1rem',
        }}>
        <i className="fa fa-bar-chart-o" style={{ paddingRight: '10px' }} />
        Somatic Mutations
      </h1>

      <Row>
        <Column
          flex="1"
          style={{
            width: '50%',
            padding: '0 20px',
          }}>
          <SurvivalPlotWrapper
            {...survivalData}
            height={240}
            onReset={() => setSelectedSurvivalData({})}
            plotType="mutation"
            survivalPlotLoading={false} />
        </Column>
        <Column flex="1" style={{ width: '50%' }} />
      </Row>

      <SsmsTable
        context="Cohort"
        defaultFilters={filters}
        hasEnoughSurvivalDataOnPrimaryCurve={enoughData(
          defaultSurvivalData.rawData
        )}
        selectedSurvivalData={selectedSurvivalData}
        setSelectedSurvivalData={setSelectedSurvivalData}
        showSurvivalPlot />
    </Column>
  )
);
