import React from 'react';
import { union, truncate, xor } from 'lodash';
import { connect } from 'react-redux';
import { compose, withState, withProps } from 'recompose';
import Table, { Tr, Td, Th } from '@ncigdc/uikit/Table';
import { withTheme } from '@ncigdc/theme';
import { Row } from '@ncigdc/uikit/Flex';
import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';
import { getDefaultCurve } from '@ncigdc/utils/survivalplot';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import Link from '@ncigdc/components/Links/Link';
import Venn, { buildOps } from '@ncigdc/components/Charts/Venn';
import withSize from '@ncigdc/utils/withSize';
import { stringifyJSONParam } from '@ncigdc/utils/uri';
import { COHORT_COMPARISON_FACETS } from '@ncigdc/utils/constants';
import CreateOrOpenAnalysis from '@ncigdc/components/CreateOrOpenAnalysis';
import Alias from '@ncigdc/components/Alias';
import Dropdown from '@ncigdc/uikit/Dropdown';
import Button from '@ncigdc/uikit/Button';
import { CaretIcon } from '@ncigdc/theme/icons';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import FacetTable from './FacetTable';
import Survival from './Survival';
import { getLowerAgeYears, getUpperAgeYears } from '@ncigdc/utils/ageDisplay';
import withRouter from '@ncigdc/utils/withRouter';

const initialState = {
  loading: true,
};

const SET1_COLOUR = 'rgb(145, 114, 33)';
const SET2_COLOUR = 'rgb(29, 97, 135)';

const transformAgeAtDiagnosis = (buckets, compareBuckets) => {
  const unionWithCompareAndFillEmpties = () => {
    return union(
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
  };

  const buildDisplayKeyAndFilters = (acc, { doc_count, key }) => {
    const displayRange = `${getLowerAgeYears(key)}${acc.nextAge === 0
      ? '+'
      : ' - ' + getUpperAgeYears(acc.nextAge)}`;
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
                  value: [acc.nextAge],
                },
              },
            ]),
          ],
        },
      ],
    };
  };
  return {
    buckets: unionWithCompareAndFillEmpties()
      .sort((a, b) => b.key - a.key) // iterate descending to populate nextAge
      .reduce(buildDisplayKeyAndFilters, { nextAge: 0, data: [] })
      .data.slice(0)
      .reverse(), // but display ascending
  };
};

export default compose(
  connect(),
  withState('survivalData', 'setSurvivalData', {}),
  withState('state', 'setState', initialState),
  withProps({
    updateData: async ({ setId1, setId2, setSurvivalData, setState }) => {
      const survivalData = await getDefaultCurve({
        currentFilters: [
          {
            op: 'in',
            content: { field: 'cases.case_id', value: `set_id:${setId1}` },
          },
          {
            op: 'in',
            content: { field: 'cases.case_id', value: `set_id:${setId2}` },
          },
        ],
      });

      setSurvivalData(survivalData);

      setState(s => ({
        ...s,
        loading: false,
      }));
    },
  }),
  withRouter,
  withPropsOnChange(
    ['set1', 'set2', 'location'],
    ({ updateData, ...props }) => {
      updateData(props);
    },
  ),
  withTheme,
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
    size: { width },
    message,
  }) => {
    const Set1 = (
      <span style={{ color: SET1_COLOUR, fontWeight: 'bold' }}>
        {truncate(setName1, { length: 50 })}
      </span>
    );

    const Set2 = (
      <span style={{ color: SET2_COLOUR, fontWeight: 'bold' }}>
        {truncate(setName2, { length: 50 })}
      </span>
    );

    const ops = buildOps({
      setIds: [setId1, setId2],
      type: 'case',
    });

    const availableFacets = Object.entries(COHORT_COMPARISON_FACETS);
    return (
      <div style={{ maxWidth: 1000, padding: '2rem 3rem' }}>
        <Row
          style={{
            alignItems: 'center',
            margin: '20px 0',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h1 style={{ margin: 0 }}>Cohort Comparison</h1>
            {message && <div style={{ fontStyle: 'italic' }}>{message}</div>}
          </div>
          <Dropdown
            style={{ flex: 'none' }}
            autoclose={false}
            button={
              <Button>
                Choose Clinical Fields{' '}
                <CaretIcon style={{ marginLeft: 5 }} direction="down" />
              </Button>
            }
          >
            {availableFacets.map(([field, label]) => {
              return (
                <DropdownItem key={field} style={{ padding: 5 }}>
                  <Link
                    merge
                    query={{
                      activeFacets: stringifyJSONParam(
                        xor(activeFacets, [field]),
                      ),
                    }}
                  >
                    <label>
                      <input
                        readOnly
                        style={{ marginRight: 5, pointerEvents: 'none' }}
                        type="checkbox"
                        aira-label={`Select ${field}`}
                        checked={activeFacets.includes(field)}
                      />
                      {label}
                    </label>
                  </Link>
                </DropdownItem>
              );
            })}
          </Dropdown>
        </Row>
        <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Table
              style={{ width: '400px' }}
              headings={[
                <Th key="1" style={{ backgroundColor: 'white' }}>
                  Selected Cohorts
                </Th>,
                <Th
                  key="2"
                  style={{ textAlign: 'right', backgroundColor: 'white' }}
                >
                  # Cases
                </Th>,
              ]}
              body={
                <tbody>
                  <Tr>
                    <Td style={{ width: '150px', color: SET1_COLOUR }}>
                      <Alias i={1} style={{ fontWeight: 'bold' }} /> : {Set1}
                    </Td>
                    <Td style={{ textAlign: 'right' }}>
                      <ExploreLink
                        query={{
                          searchTableTab: 'cases',
                          filters: {
                            op: 'AND',
                            content: [
                              {
                                op: 'IN',
                                content: {
                                  field: `cases.case_id`,
                                  value: [`set_id:${setId1}`],
                                },
                              },
                            ],
                          },
                        }}
                      >
                        {result1.hits.total.toLocaleString()}
                      </ExploreLink>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td style={{ width: '150px', color: SET2_COLOUR }}>
                      <Alias i={2} style={{ fontWeight: 'bold' }} /> : {Set2}
                    </Td>
                    <Td style={{ textAlign: 'right' }}>
                      <ExploreLink
                        query={{
                          searchTableTab: 'cases',
                          filters: {
                            op: 'AND',
                            content: [
                              {
                                op: 'IN',
                                content: {
                                  field: `cases.case_id`,
                                  value: [`set_id:${setId2}`],
                                },
                              },
                            ],
                          },
                        }}
                      >
                        {result2.hits.total.toLocaleString()}
                      </ExploreLink>
                    </Td>
                  </Tr>
                </tbody>
              }
            />
          </div>
          <div>
            <h2
              style={{
                textAlign: 'center',
                fontSize: 12,
                fontWeight: 'bold',
                margin: 0,
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              }}
            >
              Cohorts Venn Diagram<br />
              <CreateOrOpenAnalysis
                type="set_operations"
                sets={sets}
                style={{
                  color: theme.primary1,
                  fontSize: '0.8em',
                  textDecoration: 'underline',
                  display: 'inline-block',
                }}
              >
                Open in new tab
              </CreateOrOpenAnalysis>
            </h2>

            <Venn
              type="case"
              ops={ops}
              getFillColor={d => 'rgb(237, 237, 237)'}
              style={{
                fontSize: 10,
                width: 180,
                margin: 'auto',
                paddingTop: 5,
              }}
            />
          </div>
        </Row>
        <Survival
          survivalData={survivalData}
          result1={result1}
          result2={result2}
          set1id={setId1}
          set2id={setId2}
          palette={[SET1_COLOUR, SET2_COLOUR]}
          style={{ marginTop: 10 }}
        />
        {availableFacets
          .filter(([field]) => activeFacets.includes(field))
          .map(([field, heading]) =>
            FacetTable({
              key: field,
              heading,
              Alias,
              field,
              data1: {
                ...JSON.parse(result1.facets),
                'diagnoses.age_at_diagnosis': transformAgeAtDiagnosis(
                  result1.aggregations.diagnoses__age_at_diagnosis.histogram
                    .buckets,
                  result2.aggregations.diagnoses__age_at_diagnosis.histogram
                    .buckets,
                ),
              },
              data2: {
                ...JSON.parse(result2.facets),
                'diagnoses.age_at_diagnosis': transformAgeAtDiagnosis(
                  result2.aggregations.diagnoses__age_at_diagnosis.histogram
                    .buckets,
                  result1.aggregations.diagnoses__age_at_diagnosis.histogram
                    .buckets,
                ),
              },
              result1,
              result2,
              set1: setId1,
              set2: setId2,
              setName1,
              setName2,
              palette: [SET1_COLOUR, SET2_COLOUR],
            }),
          )}
      </div>
    );
  },
);
