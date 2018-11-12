// @flow

import React from 'react';
import { compose, withState } from 'recompose';
import { sortBy, sum, get } from 'lodash';
import withRouter from '@ncigdc/utils/withRouter';
import { Row, Column } from '@ncigdc/uikit/Flex';
import DownloadVisualizationButton from '@ncigdc/components/DownloadVisualizationButton';
import { withTheme } from '@ncigdc/theme';
import BarChart from '@ncigdc/components/Charts/BarChart';
import FilteredStackedBarChart from '@ncigdc/components/Charts/FilteredStackedBarChart';
import wrapSvg from '@ncigdc/utils/wrapSvg';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import ProjectsLink from '@ncigdc/components/Links/ProjectsLink';
import { IGroupFilter } from '@ncigdc/utils/filters/types';
import { cnvColors } from '@ncigdc/utils/filters/prepared/significantConsequences';
import { renderToString } from 'react-dom/server';
import { makeFilter, replaceFilters } from '@ncigdc/utils/filters';
import ExploreSSMLink from '@ncigdc/components/Links/ExploreSSMLink';

type TProps = {
  style: Object,
  filters: ?IGroupFilter,
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
}: TChartTitleProps) => {
  return (
    <div style={{ textTransform: 'uppercase', padding: '0 2rem' }}>
      {type === 'cnvs' ? (
        <span>
          <ExploreLink query={{ searchTableTab: 'cases', filters }}>
            {cases.toLocaleString()}
          </ExploreLink>{' '}
          cases affected by {ssms.toLocaleString()} cnv events across{' '}
        </span>
      ) : (
        <span>
          <ExploreSSMLink searchTableTab={'cases'} filters={filters}>
            {cases.toLocaleString()}
          </ExploreSSMLink>{' '}
          cases affected by{' '}
          <ExploreSSMLink searchTableTab={'mutations'} filters={filters}>
            {ssms.toLocaleString()}
          </ExploreSSMLink>{' '}
          mutations across{' '}
        </span>
      )}
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
};
const initalCnv = {
  gain: true,
  // amplification: true,
  loss: true, //shallow_loss: true,
  // deep_loss: true,
};
export default compose(
  withRouter,
  withTheme,
  withState('cnv', 'setCnv', initalCnv),
  withState('collapsed', 'setCollapsed', false),
)(
  (
    {
      viewer: { explore: { cases, ssms } },
      theme,
      push,
      ChartTitle = DefaultChartTitle,
      filters,
      chartType,
      style,
      cnv,
      setCnv,
      collapsed,
      setCollapsed,
      type,
    }: TProps = {},
  ) => {
    let cnvFiltered = {};
    let cnvCancerDistData = [];
    let cnvChartData = [];
    const cnvColumns = ['gain', 'loss']; //['amplification', 'gain', 'shallowLoss', 'deepLoss'];
    if (chartType !== 'ssm') {
      cnvColumns.map(cnvType =>
        cases[cnvType].project__project_id.buckets.map(
          b =>
            (cnvFiltered = {
              ...cnvFiltered,
              [b.key]: {
                ...cnvFiltered[b.key],
                [cnvType]: b.doc_count,
              },
            }),
        ),
      );
      cnvCancerDistData = Object.keys(cnvFiltered).map(p => {
        return {
          // deep_loss: cnvFiltered[p]['deepLoss'] || 0,
          loss: cnvFiltered[p]['loss'] || 0, //shallowLoss
          gain: cnvFiltered[p]['gain'] || 0,
          // amplification: cnvFiltered[p]['amplification'] || 0,
          project_id: p,
          num_cases_total: cases.cnvTotal.project__project_id.buckets.filter(
            f => f.key === p,
          )[0].doc_count,
        };
      });
      cnvChartData = sortBy(
        cnvCancerDistData,
        d =>
          -cnvColors.reduce(
            (acc, f) => acc + d[f.key] / d.num_cases_total * cnv[f.key],
            0,
          ),
      )
        .slice(0, 20)
        .map(d => ({
          symbol: d.project_id,
          // deep_loss: d.deep_loss / d.num_cases_total * 100,
          loss: d.loss / d.num_cases_total * 100, //shallow_loss: d.shallow_loss
          gain: d.gain / d.num_cases_total * 100,
          // amplification: d.amplification / d.num_cases_total * 100,
          total: d.num_cases_total,
          onClick: () => push(`/projects/${d.project_id}`),
          tooltips: cnvColors.reduce(
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
                  {d.num_cases_total.toLocaleString()}&nbsp; ({(d[f.key] / d.num_cases_total * 100).toFixed(2)}%)
                </span>
              ),
            }),
            0,
          ),
        }));
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

    const mutationCancerDistData = (cases.filtered || {
      project__project_id: { buckets: [] },
    }).project__project_id.buckets.map(b => {
      const casesByProjects = cases.total.project__project_id.buckets.filter(
        f => f.key === b.key,
      );
      const totalCasesByProject =
        casesByProjects.length > 0 ? casesByProjects[0].doc_count : 0;
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
    const Legends = () => (
      <Row style={{ display: 'flex', justifyContent: 'center' }}>
        {cnvColors.map(f => (
          <label key={f.key} style={{ paddingRight: '10px' }}>
            <span
              onClick={() =>
                setCnv({
                  ...cnv,
                  [f.key]: !cnv[f.key],
                })}
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
                lineHeight: '16px',
              }}
            >
              {cnv[f.key] ? '✓' : <span>&nbsp;</span>}
            </span>
            {f.name}
          </label>
        ))}
      </Row>
    );
    return (
      <div>
        <Row style={{ width: '100%' }}>
          {mutationChartData.length >= 5 && (
            <span style={{ width: chartType !== 'ssm' ? '50%' : '100%' }}>
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
          {chartType !== 'ssm' &&
            cnvChartData.length >= 5 && (
              <span style={{ width: '50%' }}>
                <Column style={{ padding: '0 0 0 2rem' }}>
                  <Row
                    style={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <ChartTitle
                      cases={cases.cnvTestedByGene.total}
                      ssms={cases.cnvAll.total}
                      projects={cnvCancerDistData}
                      filters={replaceFilters(
                        makeFilter([
                          {
                            field: 'cases.available_variation_data',
                            value: 'cnv',
                          },
                        ]),
                        filters,
                      )}
                      type="cnvs"
                    />
                    <DownloadVisualizationButton
                      svg={() =>
                        wrapSvg({
                          selector: '.test-stacked-bar-chart svg',
                          title: 'CNV Distribution',
                          legends: renderToString(<Legends />),
                        })}
                      data={cnvChartData.map(d => ({
                        symbol: d.symbol,
                        // amplification: d.amplification,
                        gain: d.gain,
                        loss: d.loss, //shallow_loss: d.shallow_loss
                        // deep_loss: d.deep_loss,
                        total: d.total,
                      }))}
                      slug="cancer-distribution-bar-chart"
                      noText
                      tooltipHTML="Download image or data"
                      style={{ marginRight: '2rem' }}
                    />
                  </Row>
                  <Column>
                    <FilteredStackedBarChart
                      margin={CHART_MARGINS}
                      height={200}
                      data={cnvChartData}
                      displayFilters={cnv}
                      colors={cnvColors.reduce(
                        (acc, f) => ({ ...acc, [f.key]: f.color }),
                        0,
                      )}
                      yAxis={{ title: '% of Cases Affected' }}
                      styles={chartStyles}
                    />
                    <Legends />
                  </Column>
                </Column>
              </span>
            )}
        </Row>
      </div>
    );
  },
);
