import React from 'react';
import _ from 'lodash';
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
import Dropdown from '@ncigdc/uikit/Dropdown';
import Button from '@ncigdc/uikit/Button';
import { CaretIcon } from '@ncigdc/theme/icons';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import FacetTable from './FacetTable';
import Survival from './Survival';

const initialState = {
  loading: true,
};

const SET1_COLOUR = 'rgb(158, 124, 36)';
const SET2_COLOUR = 'rgb(29, 97, 135)';

const Alias = ({ i, style = { fontWeight: 'bold' } }) => (
  <span style={style}>
    <em>S</em>
    <sub>{i}</sub>
  </span>
);

export default compose(
  connect(),
  withState('survivalData', 'setSurvivalData', {}),
  withState('state', 'setState', initialState),
  withProps(({ setId1, setId2, setSurvivalData, setState }) => ({
    updateData: async () => {
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
  })),
  withPropsOnChange(['set1', 'set2'], ({ updateData }) => {
    updateData();
  }),
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
  }) => {
    const Set1 = (
      <span style={{ color: SET1_COLOUR, fontWeight: 'bold' }}>
        {_.truncate(setName1, { length: 50 })}
      </span>
    );

    const Set2 = (
      <span style={{ color: SET2_COLOUR, fontWeight: 'bold' }}>
        {_.truncate(setName2, { length: 50 })}
      </span>
    );

    const ops = buildOps({
      setIds: [setId1, setId2],
      type: 'case',
    });

    const availableFacets = Object.entries(COHORT_COMPARISON_FACETS);
    return (
      <div style={{ width: '90%', padding: '0 3rem 2rem' }}>
        <Row
          style={{
            alignItems: 'center',
            margin: '20px 0 10px',
            justifyContent: 'space-between',
          }}
        >
          <h1 style={{ margin: 0 }}>Cohort Comparison</h1>
          <Dropdown
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
                        _.xor(activeFacets, [field]),
                      ),
                    }}
                  >
                    <label>
                      <input
                        readOnly
                        style={{ marginRight: 5, pointerEvents: 'none' }}
                        type="checkbox"
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
                  <Alias i={1} /> : {Set1}
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
                  <Alias i={2} /> : {Set2}
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
        <Row>
          <Survival
            survivalData={survivalData}
            result1={result1}
            Alias={Alias}
            result2={result2}
            set1id={setId1}
            set2id={setId2}
            palette={[SET1_COLOUR, SET2_COLOUR]}
            style={{ flex: 1, width: 100 }}
          />
          <div style={{ marginLeft: 50, flex: 1, width: 100 }}>
            <h2>
              <span style={{ marginRight: 10 }}>Cohorts Venn Diagram</span>
              <CreateOrOpenAnalysis
                type="set_operations"
                sets={sets}
                style={{
                  color: 'rgb(43, 118, 154)',
                  fontSize: '0.6em',
                  textDecoration: 'underline',
                  display: 'inline-block',
                }}
              >
                Open in new tab
              </CreateOrOpenAnalysis>
            </h2>

            <Venn
              type="case"
              width={width / 2 - 50}
              data={[setId1, setId2]}
              ops={ops}
              getFillColor={d => 'rgb(237, 237, 237)'}
            />
          </div>
        </Row>
        {availableFacets
          .filter(([field]) => activeFacets.includes(field))
          .map(([field, heading]) =>
            FacetTable({
              key: field,
              heading,
              Alias,
              field,
              data1: JSON.parse(result1.facets),
              data2: JSON.parse(result2.facets),
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
