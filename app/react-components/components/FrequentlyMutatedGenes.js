import React from 'react';
import { scaleOrdinal, schemeCategory10 } from 'd3';
import getSurvivalCurves from '../utils/getSurvivalCurves';
import { Row, Column } from '../uikit/Flex';
import TogglableUl from '../uikit/TogglableUl';
import Tooltip from '../uikit/Tooltip';
import theme from '../theme';
import { graphTitle } from '../theme/mixins';
import SurvivalIcon from '../theme/icons/SurvivalIcon';
import BarChart from '../charts/BarChart';
import DownloadVisualizationButton from './DownloadVisualizationButton';
import SurvivalPlotWrapper from './SurvivalPlotWrapper';
import EntityPageHorizontalTable from './EntityPageHorizontalTable';

const colors = scaleOrdinal(schemeCategory10);

const styles = {
  column: {
    flexGrow: 1,
  },
  hidden: {
    width: 0,
    height: 0,
    overflow: 'hidden',
  },
};

const FrequentlyMutatedGenes = ({
  mutatedGenesChartData,
  numCasesAggByProject,
  survivalData,
  setSelectedSurvivalData,
  selectedSurvivalData,
  width,
  totalNumCases,
  projectId,
  api,
}) => {
  return (
    <span>
      <Row style={{ paddingBottom: '2.5rem' }}>
        <span>
          <div style={{ textAlign: 'right', marginRight: 50, marginLeft: 30 }}>
            <DownloadVisualizationButton
              disabled={!mutatedGenesChartData.length}
              svg="#mutated-genes-chart svg"
              data={mutatedGenesChartData}
              slug="bar-chart"
              tooltipHTML="Download image or data"
              noText
            />
          </div>
          <div style={graphTitle}>Distribution of Most Frequently Mutated Genes</div>
          {!!mutatedGenesChartData.length &&
            <div id="mutated-genes-chart">
              <Row style={{ padding: '0 2rem' }}>
                <BarChart
                  data={mutatedGenesChartData.map(g => ({
                    label: g.symbol,
                    value: ((g.num_affected_cases_project / numCasesAggByProject[projectId]) * 100),
                    tooltip: `<b>${g.symbol}</b><br />
                      ${g.num_affected_cases_project} Case${g.num_affected_cases_project > 1 ? 's' : ''}
                      Affected in ${projectId}<br />
                      ${g.num_affected_cases_project} / ${numCasesAggByProject[projectId]}
                      ${((g.num_affected_cases_project / numCasesAggByProject[projectId]) * 100)
                        .toFixed(2)}%`,
                    href: `genes/${g.gene_id}`,
                  }))}
                  yAxis={{ title: '% of Cases Affected' }}
                  height={240}
                  styles={{
                    xAxis: { stroke: theme.greyScale4, textFill: theme.greyScale3 },
                    yAxis: { stroke: theme.greyScale4, textFill: theme.greyScale3 },
                    bars: { fill: theme.secondary },
                    tooltips: {
                      fill: '#fff',
                      stroke: theme.greyScale4,
                      textFill: theme.greyScale3,
                    },
                  }}
                />
              </Row>
            </div>
          }
        </span>
        {survivalData.rawData && (
          <span style={{ ...styles.column, width: '50%' }}>
            <SurvivalPlotWrapper
              {...survivalData}
              onReset={() => setSelectedSurvivalData({})}
              height={240}
              width={width}
            />
          </span>
        )}
      </Row>
      <Column>
        {!!mutatedGenesChartData.length &&
          <EntityPageHorizontalTable
            headings={[
              { key: 'name', title: 'Name' },
              { key: 'symbol', title: 'Symbol' },
              { key: 'cytoband', title: 'Cytoband' },
              {
                key: 'num_affected_cases_project',
                title: <span># Affected Cases<br />in {projectId}</span>,
              },
              {
                key: 'num_affected_cases_all',
                title: <span># Affected Cases<br /> Across all Projects</span>,
              },
              {
                key: 'num_mutations',
                title: '# Mutations',
              },
              {
                title: 'Survival Analysis',
                key: 'survival_plot',
                style: { textAlign: 'center', width: '100px' },
              },
            ]}
            data={mutatedGenesChartData.map(g => ({
              ...g,
              symbol: <a href={`/genes/${g.gene_id}`}>{g.symbol}</a>,
              cytoband: (g.cytoband || []).join(', '),
              num_affected_cases_project:
                `${g.num_affected_cases_project} / ${numCasesAggByProject[projectId]}
                (${((g.num_affected_cases_project / numCasesAggByProject[projectId]) * 100).toFixed(2)}%)`,
              num_affected_cases_all: (
                <TogglableUl
                  items={[
                    `${g.num_affected_cases_all}/${totalNumCases}
                    (${((g.num_affected_cases_all / totalNumCases) * 100).toFixed(2)}%)`,
                    ...Object.keys(g.num_affected_cases_by_project)
                      .map(k => `
                        ${k}: ${g.num_affected_cases_by_project[k]} / ${numCasesAggByProject[k]}
                        (${((g.num_affected_cases_by_project[k] / numCasesAggByProject[k]) * 100).toFixed(2)}%)`),
                  ]}
                />
              ),
              survival_plot: (
                <Tooltip innerHTML={`Click icon to plot ${g.symbol}`}>
                  <button
                    onClick={() => {
                      if (g.symbol !== selectedSurvivalData.id) {
                        getSurvivalCurves({
                          api,
                          projectId,
                          field: 'gene.symbol',
                          value: g.symbol,
                        })
                          .then(setSelectedSurvivalData);
                      } else {
                        setSelectedSurvivalData({});
                      }
                    }}
                  >
                    <span
                      style={{
                        color: colors(selectedSurvivalData.id === g.symbol ? 1 : 0),
                        cursor: 'pointer',
                      }}
                    >
                      <SurvivalIcon />
                      <div style={styles.hidden}>add to survival plot</div>
                    </span>
                  </button>
                </Tooltip>
              ),
            }))}
          />
        }
        {!mutatedGenesChartData.length && 'No mutated gene data to display'}
      </Column>
    </span>
  );
};

export default FrequentlyMutatedGenes;
