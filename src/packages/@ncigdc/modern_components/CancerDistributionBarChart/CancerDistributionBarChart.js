// @flow

import React from 'react';
import { compose, withState } from 'recompose';
import { sortBy, sum, get, mapValues } from 'lodash';
import withRouter from '@ncigdc/utils/withRouter';
import { Row, Column } from '@ncigdc/uikit/Flex';
import DownloadVisualizationButton from '@ncigdc/components/DownloadVisualizationButton';
import { withTheme } from '@ncigdc/theme';
import BarChart from '@ncigdc/components/Charts/BarChart';
import FilteredStackedBarChart from '@ncigdc/components/Charts/FilteredStackedBarChart';
import wrapSvg from '@ncigdc/utils/wrapSvg';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import ProjectsLink from '@ncigdc/components/Links/ProjectsLink';
import { TGroupFilter } from '@ncigdc/utils/filters/types';

type TProps = {
  style: Object,
  filters: ?TGroupFilter,
  cases: {
    total: {
      project__project_id: {
        buckets: Array<{
          key: string,
          doc_count: number,
        }>,
      },
    },
    filtered: {
      project__project_id: {
        buckets: Array<{
          key: string,
          doc_count: number,
        }>,
      },
    },
  },
  ssms: {
    hits: {
      total: number,
    },
  },
  aggregations: Object,
  theme: Object,
  push: Function,
  ChartTitle: ReactClass<{}>,
};

const CHART_HEIGHT = 295;
const CHART_MARGINS = { top: 20, right: 50, bottom: 75, left: 55 };

export type TChartTitleProps = {
  cases: number,
  projects: Array<{ project_id: string }>,
  ssms: number,
  filters: any,
};
const DefaultChartTitle = ({
  type = 'mutations',
  cases = 0,
  projects = [],
  ssms = 0,
  filters,
}: TChartTitleProps) => (
  <div style={{ textTransform: 'uppercase', padding: '0 2rem' }}>
    <ExploreLink query={{ searchTableTab: 'cases', filters }}>
      {cases.toLocaleString()}
    </ExploreLink>&nbsp; cases affected by&nbsp;
    <ExploreLink query={{ searchTableTab: 'mutations', filters }}>
      {ssms.toLocaleString()}
    </ExploreLink>&nbsp; {type} across&nbsp;
    <ProjectsLink
      query={{
        filters: {
          op: 'and',
          content: [
            {
              op: 'in',
              content: {
                field: 'projects.project_id',
                value: projects.map(p => p.project_id),
              },
            },
          ],
        },
      }}
    >
      {projects.length.toLocaleString()}
    </ProjectsLink>&nbsp; projects
  </div>
);
const initalCna = {
  gain1: true,
  gain2: true,
  loss1: true,
  loss2: true,
};
export default compose(
  withRouter,
  withTheme,
  withState('cna', 'setCna', initalCna),
)(
  (
    {
      viewer: { explore: { cases, ssms } },
      theme,
      push,
      ChartTitle = DefaultChartTitle,
      filters,
      style,
      cna,
      setCna,
      type, //mutation or CNA
    }: TProps = {},
  ) => {
    /* prettier-ignore */
    const cnaCases = { 
      filtered: {
        project__project_id: { 
          buckets: [
            { loss2: 20, loss1: 1, gain1: 5, gain2: 9, key: 'TCGA-UCSK',},
            { loss2: 19, loss1: 1, gain1: 6, gain2: 7, key: 'TCGA-LUSC',},
            { loss2: 18, loss1: 9, gain1: 8, gain2: 7, key: 'TCGA-ESCA',},
            { loss2: 17, loss1: 4, gain1: 7, gain2: 6, key: 'TCGA-READ',},
            { loss2: 16, loss1: 6, gain1: 9, gain2: 4, key: 'TCGA-HNSC',},
            { loss2: 15, loss1: 6, gain1: 5, gain2: 6, key: 'TCGA-UCS1',},
            { loss2: 14, loss1: 3, gain1: 2, gain2: 7, key: 'TCGA-LSC2',},
            { loss2: 13, loss1: 9, gain1: 5, gain2: 3, key: 'TCGA-ESA3',},
            { loss2: 12, loss1: 4, gain1: 7, gain2: 6, key: 'TCGA-RED4',},
            { loss2: 11, loss1: 6, gain1: 9, gain2: 4, key: 'TCGA-HNC5',},
            { loss2: 10, loss1: 6, gain1: 5, gain2: 6, key: 'TCGA-UCS6',},
            { loss2: 9,  loss1: 1, gain1: 2, gain2: 7, key: 'TCGA-LSC7',},
            { loss2: 8,  loss1: 9, gain1: 5, gain2: 3, key: 'TCGA-ECA8',},
            { loss2: 7,  loss1: 4, gain1: 7, gain2: 6, key: 'TCGA-RED9',},
            { loss2: 6,  loss1: 6, gain1: 9, gain2: 4, key: 'TCGA-HSC0',},
            { loss2: 5,  loss1: 6, gain1: 5, gain2: 6, key: 'TCGA-UCSA',},
            { loss2: 4,  loss1: 3, gain1: 2, gain2: 7, key: 'TCGA-LUSB',},
            { loss2: 3,  loss1: 9, gain1: 5, gain2: 3, key: 'TCGA-ESAC',},
            { loss2: 2,  loss1: 4, gain1: 7, gain2: 6, key: 'TCGA-RADD',},
            { loss2: 1,  loss1: 6, gain1: 9, gain2: 4, key: 'TCGA-HNSE',},
          ]
        },
      },
      total: {
        project__project_id: { 
          buckets: [
            { total: 325, key: 'TCGA-UCSK', },
            { total: 621, key: 'TCGA-LUSC', },
            { total: 356, key: 'TCGA-ESCA', },
            { total: 777, key: 'TCGA-READ', },
            { total: 287, key: 'TCGA-HNSC', },
            { total: 369, key: 'TCGA-UCS1', },
            { total: 580, key: 'TCGA-LSC2', },
            { total: 701, key: 'TCGA-ESA3', },
            { total: 902, key: 'TCGA-RED4', },
            { total: 335, key: 'TCGA-HNC5', },
            { total: 447, key: 'TCGA-UCS6', },
            { total: 236, key: 'TCGA-LSC7', },
            { total: 690, key: 'TCGA-ECA8', },
            { total: 625, key: 'TCGA-RED9', },
            { total: 763, key: 'TCGA-HSC0', },
            { total: 273, key: 'TCGA-UCSA', },
            { total: 828, key: 'TCGA-LUSB', },
            { total: 178, key: 'TCGA-ESAC', },
            { total: 445, key: 'TCGA-RADD', },
            { total: 321, key: 'TCGA-HNSE', },
          ]
        },
      } 
    }
    const chartStyles = {
      xAxis: {
        stroke: theme.greyScale4,
        textFill: theme.greyScale3,
      },
      yAxis: {
        stroke: theme.greyScale4,
        textFill: theme.greyScale3,
      },
      bars: { fill: theme.secondary },
      tooltips: {
        fill: '#fff',
        stroke: theme.greyScale4,
        textFill: theme.greyScale3,
      },
    };

    const checkers = [
      { key: 'gain2', name: 'High Level Amplification', color: '#c8190d' },
      { key: 'gain1', name: 'Gain', color: '#f97dd7' },
      { key: 'loss1', name: 'Shallow Loss', color: '#71cdf4' },
      { key: 'loss2', name: 'Deep Loss', color: '#2b6ca0' },
    ];
    const mutationCancerDistData = (cases.filtered || {
      project__project_id: { buckets: [] },
    }).project__project_id.buckets.map(b => {
      const totalCasesByProject = cases.total.project__project_id.buckets.filter(
        f => f.key === b.key,
      )[0].doc_count;
      return {
        freq: b.doc_count / totalCasesByProject,
        project_id: b.key,
        num_affected_cases: b.doc_count,
        num_cases_total: totalCasesByProject,
      };
    });
    const mutationChartData = sortBy(mutationCancerDistData, d => -d.freq)
      .slice(0, 20)
      .map(d => ({
        label: d.project_id,
        value: d.freq * 100,
        onClick: () => push(`/projects/${d.project_id}`),
        tooltip: (
          <span>
            {d.num_affected_cases.toLocaleString()}&nbsp;Case
            {d.num_affected_cases > 1 ? 's ' : ' '}
            Affected in <b>{d.project_id}</b>
            <br />
            {d.num_affected_cases.toLocaleString()}
            &nbsp;/&nbsp;
            {d.num_cases_total.toLocaleString()}&nbsp; ({(d.freq * 100).toFixed(2)}%)
          </span>
        ),
      }));

    const cnaCancerDistData = (cnaCases.filtered || {
      project__project_id: { buckets: [] },
    }).project__project_id.buckets.map(b => {
      const totalCasesByProject = cnaCases.total.project__project_id.buckets.filter(
        f => f.key === b.key,
      )[0].total;
      return {
        gain2: b.gain2,
        gain1: b.gain1,
        loss1: b.loss1,
        loss2: b.loss2,
        project_id: b.key,
        num_cases_total: totalCasesByProject,
      };
    });
    const cnaChartData = sortBy(
      cnaCancerDistData,
      d =>
        -checkers.reduce(
          (acc, f) => acc + d[f.key] / d.num_cases_total * cna[f.key],
          0,
        ),
    )
      .slice(0, 20)
      .map(d => ({
        symbol: d.project_id,
        loss2: d.loss2 / d.num_cases_total * 100,
        loss1: d.loss1 / d.num_cases_total * 100,
        gain1: d.gain1 / d.num_cases_total * 100,
        gain2: d.gain2 / d.num_cases_total * 100,
        total: d.num_cases_total,
        onClick: () => push(`/projects/${d.project_id}`),
        tooltips: checkers.reduce(
          (acc, f) => ({
            ...acc,
            [f.key]: (
              <span>
                {d[f.key].toLocaleString()}&nbsp;Case
                {d[f.key] > 1 ? 's ' : ' '}
                Affected in <b>{d.project_id}</b>
                <br />
                {d[f.key].toLocaleString()}
                &nbsp;/&nbsp;
                {d.num_cases_total.toLocaleString()}&nbsp; ({(d[f.key] * 100).toFixed(2)}%)
              </span>
            ),
          }),
          0,
        ),
      }));
    return (
      <div>
        <Row style={{ width: '100%' }}>
          {mutationChartData.length >= 5 && (
            <span style={{ width: '50%' }}>
              <Column style={{ padding: '0 0 0 2rem' }}>
                <Row
                  style={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <ChartTitle
                    cases={sum(
                      mutationCancerDistData.map(d => d.num_affected_cases),
                    )}
                    ssms={get(ssms, 'hits.total', 0)}
                    projects={mutationCancerDistData}
                    filters={filters}
                  />
                  <DownloadVisualizationButton
                    svg={() =>
                      wrapSvg({
                        selector: '#cancer-distribution svg',
                        title: 'Cancer Distribution',
                      })}
                    data={mutationChartData.map(d => ({
                      label: d.label,
                      value: d.value,
                    }))}
                    slug="cancer-distribution-bar-chart"
                    noText
                    tooltipHTML="Download image or data"
                    style={{ marginRight: '2rem' }}
                  />
                </Row>
                <BarChart
                  margin={CHART_MARGINS}
                  data={mutationChartData}
                  yAxis={{ title: '% of Cases Affected' }}
                  height={CHART_HEIGHT}
                  styles={chartStyles}
                />
              </Column>
            </span>
          )}
          <span style={{ width: '50%' }}>
            <Column style={{ padding: '0 0 0 2rem' }}>
              <Row
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <ChartTitle
                  cases={sum(
                    cnaCancerDistData.map(
                      d => d.gain2 + d.gain1 + d.loss1 + d.loss2,
                    ),
                  )}
                  ssms={get(ssms, 'hits.total', 0)}
                  projects={cnaCancerDistData}
                  filters={filters}
                  type="CNA"
                />
                <DownloadVisualizationButton
                  svg={() =>
                    wrapSvg({
                      selector: '.test-stacked-bar-chart svg',
                      title: 'CNA Distribution',
                    })}
                  data={cnaChartData.map(d => ({
                    symbol: d.symbol,
                    gain2: d.gain2,
                    gain1: d.gain1,
                    loss1: d.loss1,
                    loss2: d.loss2,
                    total: d.total,
                  }))}
                  slug="cancer-distribution-bar-chart"
                  noText
                  tooltipHTML="Download image or data"
                  style={{ marginRight: '2rem' }}
                />
              </Row>
              <Row>
                <Column
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid rgb(186, 186, 186)',
                    padding: '13px',
                    right: 10,
                    top: 10,
                    position: 'absolute',
                    zIndex: 1,
                  }}
                >
                  <Row>
                    <span
                      onClick={() => setCna(initalCna)}
                      style={{
                        color: 'rgb(27, 103, 145)',
                        cursor: 'pointer',
                      }}
                    >
                      Select All
                    </span>
                    <span>&nbsp;|&nbsp;</span>
                    <span
                      onClick={() => setCna(mapValues(initalCna, () => false))}
                      style={{
                        color: 'rgb(27, 103, 145)',
                        cursor: 'pointer',
                      }}
                    >
                      Deselect All
                    </span>
                  </Row>
                  {checkers.map(f => (
                    <label key={f.key}>
                      <span
                        onClick={() => setCna({ ...cna, [f.key]: !cna[f.key] })}
                        style={{
                          color: f.color,
                          textAlign: 'center',
                          border: '2px solid',
                          height: '18px',
                          width: '18px',
                          cursor: 'pointer',
                          display: 'inline-block',
                          marginRight: '6px',
                          marginTop: '3px',
                          verticalAlign: 'middle',
                        }}
                      >
                        {cna[f.key] ? '✓' : <span>&nbsp;</span>}
                      </span>
                      {f.name}
                    </label>
                  ))}
                </Column>
                <FilteredStackedBarChart
                  margin={CHART_MARGINS}
                  height={200}
                  data={cnaChartData}
                  displayFilters={cna}
                  colors={checkers.reduce(
                    (acc, f) => ({ ...acc, [f.key]: f.color }),
                    0,
                  )}
                  yAxis={{ title: '% of Cases Affected' }}
                  styles={chartStyles}
                />
              </Row>
            </Column>
          </span>
        </Row>
      </div>
    );
  },
);
