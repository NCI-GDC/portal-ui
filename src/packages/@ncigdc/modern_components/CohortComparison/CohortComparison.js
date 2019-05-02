import React from 'react';
import { union, truncate } from 'lodash';
import { connect } from 'react-redux';
import { compose, withState, withProps } from 'recompose';
import { withTheme } from '@ncigdc/theme';
import { Row, Column } from '@ncigdc/uikit/Flex';
import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';
import { getDefaultCurve } from '@ncigdc/utils/survivalplot';
import { buildOps } from '@ncigdc/components/Charts/Venn';
import withSize from '@ncigdc/utils/withSize';
import { COHORT_COMPARISON_FACETS } from '@ncigdc/utils/constants';
import Alias from '@ncigdc/components/Alias';
import { getLowerAgeYears, getUpperAgeYears } from '@ncigdc/utils/ageDisplay';
import withRouter from '@ncigdc/utils/withRouter';
import FacetTable from './FacetTable';
import Survival, { makeSurvivalCurveFilter } from './Survival';
import Toolbox from './Toolbox';
import './facet.css';

const initialState = {
  loadingSurvival: true,
};

const SET1_COLOUR = 'rgb(145, 114, 33)';
const SET2_COLOUR = 'rgb(29, 97, 135)';

const transformAgeAtDiagnosis = (buckets, compareBuckets) => {
  const unionAndParsed = union(
    buckets.map(({ key }) => key),
    compareBuckets.map(({ key }) => key),
  )
    .map(key => {
      const bucket = buckets.find(b => b.key === key);
      if (bucket) {
        return bucket;
      }
      return {
        key,
        doc_count: 0,
      };
    })
    .map(({ doc_count, key }) => ({
      doc_count,
      key: parseInt(key, 10),
    }));

  const buildDisplayKeyAndFilters = (acc, { doc_count, key }) => {
    const displayRange = `${getLowerAgeYears(key)}${acc.nextAge === 0
      ? '+'
      : ` - ${getUpperAgeYears(acc.nextAge - 1)}`}`;
    return {
      nextAge: key,
      data: [
        ...acc.data,
        {
          doc_count,
          key: `${displayRange} years`,
          filters: [
            {
              op: '>=',
              content: {
                field: 'cases.diagnoses.age_at_diagnosis',
                value: [key],
              },
            },
            ...(acc.nextAge !== 0 && [
              {
                op: '<=',
                content: {
                  field: 'cases.diagnoses.age_at_diagnosis',
                  value: [acc.nextAge - 1],
                },
              },
            ]),
          ],
        },
      ],
    };
  };
  return {
    buckets: unionAndParsed
      .sort((a, b) => b.key - a.key) // iterate descending to populate nextAge
      .reduce(buildDisplayKeyAndFilters, {
        nextAge: 0,
        data: [],
      })
      .data.slice(0)
      .reverse(), // but display ascending
  };
};

export default compose(
  connect(),
  withState('survivalData', 'setSurvivalData', {}),
  withState('state', 'setState', initialState),
  withProps({
    updateData: async ({
      setId1, setId2, setSurvivalData, setState,
    }) => {
      const survivalData = await getDefaultCurve({
        currentFilters: [
          makeSurvivalCurveFilter(
            setId1,
            setId2,
          ),
          makeSurvivalCurveFilter(setId2, setId1),
        ],
      });

      setSurvivalData(survivalData);

      setState(s => ({
        ...s,
        loadingSurvival: false,
        survivalHasData:
          survivalData &&
          survivalData.rawData &&
          survivalData.rawData.results.some(Boolean),
      }));
    },
  }),
  withRouter,
  withPropsOnChange(
    [
      'set1',
      'set2',
      'location',
    ],
    ({ updateData, ...props }) => {
      updateData(props);
    },
  ),
  withTheme,
  withState('showSurvival', 'toggleSurvival', true),
  withSize(),
)(
  ({
    activeFacets,
    sets,
    setId1,
    setId2,
    setName1,
    setName2,
    theme,
    survivalData,
    viewer: { repository: { result1, result2 } },
    message,
    showSurvival,
    toggleSurvival,
    state: { loadingSurvival, survivalHasData },
  }) => {
    const Set1 = (
      <span style={{
        color: SET1_COLOUR,
        fontWeight: 'bold',
      }}
            >
        {truncate(setName1, { length: 50 })}
      </span>
    );

    const Set2 = (
      <span style={{
        color: SET2_COLOUR,
        fontWeight: 'bold',
      }}
            >
        {truncate(setName2, { length: 50 })}
      </span>
    );

    const ops = buildOps({
      setIds: [setId1, setId2],
      type: 'case',
    });

    const availableFacets = Object.entries(COHORT_COMPARISON_FACETS);
    return (
      <Column style={{ marginBottom: '1rem' }}>
        <Row
          style={{
            alignItems: 'center',
            margin: '20px 0',
            justifyContent: 'space-between',
            padding: '2rem 3rem',
          }}
          >
          <div>
            <h1 style={{ margin: 0 }}>Cohort Comparison</h1>

            {(result1.hits.total === 0 || result2.hits.total === 0) &&
              `Analysis is deprecated because it contains one or more deprecated sets (${[...(result1.hits.total === 0 ? [setName1] : []), ...(result2.hits.total === 0 ? [setName2] : [])].join(', ')})`}
            {message && <div style={{ fontStyle: 'italic' }}>{message}</div>}
          </div>
        </Row>
        {result1.hits.total !== 0 &&
          result2.hits.total !== 0 && (
            <Row>
              <Column
                style={{
                  width: '65%',
                  padding: '0 3rem',
                  minWidth: 550,
                  marginTop: 1,
                }}
                >
                <div
                  className="facet-container"
                  style={{
                    display: 'block',
                    marginTop: 1,
                  }}
                  >
                  <Survival
                    loading={loadingSurvival}
                    palette={[SET1_COLOUR, SET2_COLOUR]}
                    result1={result1}
                    result2={result2}
                    set1id={setId1}
                    set2id={setId2}
                    style={{ marginTop: 10 }}
                    survivalData={survivalData}
                    />
                </div>
                {availableFacets
                  .filter(([field]) => activeFacets.includes(field))
                  .map(([field, heading]) => FacetTable({
                    key: field,
                    heading,
                    Alias,
                    field,
                    data1: {
                      ...JSON.parse(result1.facets),
                      'diagnoses.age_at_diagnosis': transformAgeAtDiagnosis(
                        result1.aggregations.diagnoses__age_at_diagnosis
                          .histogram.buckets,
                        result2.aggregations.diagnoses__age_at_diagnosis
                          .histogram.buckets,
                        result1.hits.total,
                      ),
                    },
                    data2: {
                      ...JSON.parse(result2.facets),
                      'diagnoses.age_at_diagnosis': transformAgeAtDiagnosis(
                        result2.aggregations.diagnoses__age_at_diagnosis
                          .histogram.buckets,
                        result1.aggregations.diagnoses__age_at_diagnosis
                          .histogram.buckets,
                        result2.hits.total,
                      ),
                    },
                    result1,
                    result2,
                    set1: setId1,
                    set2: setId2,
                    setName1,
                    setName2,
                    palette: [SET1_COLOUR, SET2_COLOUR],
                  }))}
              </Column>

              <div
                style={{
                  flex: 1,
                  width: '25%',
                  marginTop: 1,
                }}
                >
                <Toolbox
                  {...{
                    theme,
                    ops,
                    sets,
                    availableFacets,
                    activeFacets,
                    showSurvival,
                    survivalHasData: loadingSurvival || survivalHasData,
                    toggleSurvival,
                    Set1,
                    Set2,
                    setId1,
                    setId2,
                    result1,
                    result2,
                  }}
                  />
              </div>
            </Row>
        )}
      </Column>
    );
  },
);
