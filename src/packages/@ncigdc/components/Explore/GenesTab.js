// @flow
import React from 'react';
import { get } from 'lodash';
import { compose, withState, withProps, withHandlers } from 'recompose';
import { Row, Column } from '@ncigdc/uikit/Flex';
import { getDefaultCurve, enoughData } from '@ncigdc/utils/survivalplot';
import withFilters from '@ncigdc/utils/withFilters';
import SurvivalPlotWrapper from '@ncigdc/components/SurvivalPlotWrapper';
import GenesBarChart from '@ncigdc/modern_components/GenesBarChart';
import GenesTable from '@ncigdc/modern_components/GenesTable';
import {
  makeFilter,
  toggleFilters,
  getFilterValue,
} from '@ncigdc/utils/filters';
// import { ShowToggleBox } from '@ncigdc/components/TabPieCharts'; // GenesBarChart component and related are hidding for now.
import { stringifyJSONParam } from '@ncigdc/utils/uri';
import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';
import removeEmptyKeys from '@ncigdc/utils/removeEmptyKeys';
import { withTheme } from '@ncigdc/theme';

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
  withTheme,
  withState('defaultSurvivalData', 'setDefaultSurvivalData', {}),
  withState('selectedSurvivalData', 'setSelectedSurvivalData', {}),
  withState('showingMore', 'setShowingMore', false),
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
    handleClickGene: ({ push, query, filters }) => gene => {
      const sets = []
        .concat(
          get(
            getFilterValue({
              currentFilters: get(filters, 'content', []),
              dotField: 'genes.gene_id',
            }),
            'content.value',
            []
          )
        )
        .filter(v => v.includes('set_id'));

      const newFilters = toggleFilters(
        filters,
        makeFilter([{ field: 'genes.gene_id', value: [gene.gene_id, ...sets] }])
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
    state: { loading },
    survivalData,
    defaultSurvivalData,
    selectedSurvivalData,
    setSelectedSurvivalData,
    viewer,
    filters,
    showingMore,
    setShowingMore,
    handleClickGene,
  }) => (
    <Column style={styles.card}>
      <h1 style={{ ...styles.heading, padding: '1rem' }} id="mutated-genes">
        <i className="fa fa-bar-chart-o" style={{ paddingRight: '10px' }} />
        Genes
      </h1>
      <Column>
        <Row
          style={{ paddingBottom: '1.5rem', borderBottom: '1px solid #c8c8c8' }}
        >
          <Column flex="none" style={{ width: '50%' }}>
            <GenesBarChart
              defaultFilters={filters}
              onClickGene={handleClickGene}
              showingMore={false} //{showingMore} // GenesBarChart component and related are hidding for now.
            />
          </Column>
          <Column flex="none" style={{ width: '50%' }}>
            <SurvivalPlotWrapper
              {...survivalData}
              onReset={() => setSelectedSurvivalData({})}
              plotType="mutation"
              height={240}
              survivalPlotLoading={loading}
            />
          </Column>
        </Row>
        {/* <Row style={{ margin: 'auto', marginTop: '-1.5rem' }}>
          <ShowToggleBox onClick={() => setShowingMore(!showingMore)}>
            Show {showingMore ? 'Less' : 'More'}
          </ShowToggleBox>
        </Row> */}
        {/* GenesBarChart component and related are hidding for now. */}
        <GenesTable
          defaultFilters={filters}
          survivalData={survivalData}
          hasEnoughSurvivalDataOnPrimaryCurve={enoughData(
            defaultSurvivalData.rawData
          )}
          setSelectedSurvivalData={setSelectedSurvivalData}
          selectedSurvivalData={selectedSurvivalData}
          context="Cohort"
        />
      </Column>
    </Column>
  )
);
