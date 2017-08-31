import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, withProps } from 'recompose';
import { union, find } from 'lodash';

import { withTheme } from '@ncigdc/theme';
import SurvivalPlotWrapper from '@ncigdc/components/SurvivalPlotWrapper';
import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';
import { getDefaultCurve } from '@ncigdc/utils/survivalplot';

const mapping = {
  'demographic.gender': 'Gender',
  'diagnoses.vital_status': 'Vital Status',
  'demographic.race': 'Race',
};

const initialState = {
  loading: true,
};

const section = (
  field,
  data1,
  data2,
  result1,
  result2,
  set1_name,
  set1_colour,
  set2_name,
  set2_colour,
) => {
  return (
    <div>
      <h2>{mapping[field]}</h2>
      <table style={{ width: '80%' }}>
        <thead>
          <tr>
            <th />
            <th style={{ textAlign: 'center', color: set1_colour }} colSpan={2}>
              {set1_name}
            </th>
            <th style={{ textAlign: 'center', color: set2_colour }} colSpan={2}>
              {set2_name}
            </th>
          </tr>
          <tr>
            <th>{mapping[field]}</th>
            <th style={{ textAlign: 'right' }}># of items</th>
            <th style={{ textAlign: 'right' }}>%</th>
            <th style={{ textAlign: 'right' }}># of items</th>
            <th style={{ textAlign: 'right' }}>%</th>
          </tr>
        </thead>
        <tbody>
          {union(
            data1[field].buckets.map(b => b.key),
            data2[field].buckets.map(b => b.key),
          ).map(k => {
            const set1_bucket =
              (find(data1[field].buckets, b => b.key === k) || {}).doc_count ||
              0;
            const set2_bucket =
              (find(data2[field].buckets, b => b.key === k) || {}).doc_count ||
              0;
            return (
              <tr key={k}>
                <td width={250}>{k}</td>
                <td style={{ textAlign: 'right' }}>{set1_bucket}</td>
                <td style={{ textAlign: 'right' }}>
                  {(set1_bucket / result1.hits.total * 100).toFixed(0)}%
                </td>
                <td style={{ textAlign: 'right' }}>{set2_bucket}</td>
                <td style={{ textAlign: 'right' }}>
                  {(set2_bucket / result2.hits.total * 100).toFixed(0)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default compose(
  connect(({ sets }) => ({ sets })),
  withState('defaultSurvivalData', 'setDefaultSurvivalData', {}),
  withState('selectedSurvivalData', 'setSelectedSurvivalData', {}),
  withState('state', 'setState', initialState),
  withProps(
    ({
      set1,
      set2,
      selectedSurvivalData,
      defaultSurvivalData,
      setDefaultSurvivalData,
      setSelectedSurvivalData,
      setState,
    }) => ({
      survivalData: {
        legend: selectedSurvivalData.legend || defaultSurvivalData.legend,
        rawData: selectedSurvivalData.rawData || defaultSurvivalData.rawData,
      },
      updateData: async () => {
        const survivalData = await getDefaultCurve({
          currentFilters: [
            {
              op: 'in',
              content: { field: 'cases.case_id', value: `set_id:${set1}` },
            },
            {
              op: 'in',
              content: { field: 'cases.case_id', value: `set_id:${set2}` },
            },
          ],
        });

        setDefaultSurvivalData(survivalData);
        setSelectedSurvivalData({});

        setState(s => ({
          ...s,
          loading: false,
        }));
      },
    }),
  ),
  withPropsOnChange(['set1', 'set2'], ({ updateData }) => {
    updateData();
  }),
  withTheme,
)(
  ({
    facets,
    sets,
    set1,
    set2,
    theme,
    survivalData,
    viewer: { repository: { result1, result2 } },
  }) => {
    const data1 = JSON.parse(result1.facets);
    const data2 = JSON.parse(result2.facets);

    const set1_name = sets.case[set1];
    const set1_colour = 'orange';
    const set2_name = sets.case[set2];
    const set2_colour = 'skyblue';
    console.log(survivalData);
    return (
      <div style={{ margin: '0 3rem' }}>
        <h1>Cohort Comparison</h1>
        <table>
          <thead>
            <tr>
              <th>Selected Cohorts</th>
              <th style={{ textAlign: 'right' }}># of cases</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ width: '150px', color: set1_colour }}>
                {set1_name}
              </td>
              <td style={{ textAlign: 'right' }}>{result1.hits.total}</td>
            </tr>
            <tr>
              <td style={{ width: '150px', color: set2_colour }}>
                {set2_name}
              </td>
              <td style={{ textAlign: 'right' }}>{result2.hits.total}</td>
            </tr>
          </tbody>
        </table>
        <h2>Survival Analysis</h2>
        <div style={{ width: '50%' }}>
          <SurvivalPlotWrapper {...survivalData} height={240} />
          {survivalData.rawData &&
            <table style={{ width: '80%' }}>
              <thead>
                <tr>
                  <th />
                  <th
                    style={{ textAlign: 'center', color: set1_colour }}
                    colSpan={2}
                  >
                    {set1_name}
                  </th>
                  <th
                    style={{ textAlign: 'center', color: set2_colour }}
                    colSpan={2}
                  >
                    {set2_name}
                  </th>
                </tr>
                <tr>
                  <th>Cases included in Analysis</th>
                  <th style={{ textAlign: 'right' }}># of items</th>
                  <th style={{ textAlign: 'right' }}>%</th>
                  <th style={{ textAlign: 'right' }}># of items</th>
                  <th style={{ textAlign: 'right' }}>%</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td width={250}>Overall Survival Analysis</td>
                  <td style={{ textAlign: 'right' }}>
                    {survivalData.rawData.results[0].donors.length}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {(survivalData.rawData.results[0].donors.length /
                      result1.hits.total *
                      100).toFixed(0)}%
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {survivalData.rawData.results[1].donors.length}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {(survivalData.rawData.results[1].donors.length /
                      result2.hits.total *
                      100).toFixed(0)}%
                  </td>
                </tr>

              </tbody>
            </table>}
        </div>

        {facets.map(f =>
          section(
            f,
            data1,
            data2,
            result1,
            result2,
            set1_name,
            set1_colour,
            set2_name,
            set2_colour,
          ),
        )}

      </div>
    );
  },
);
